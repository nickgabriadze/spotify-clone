import Duration from "../icons/duration.svg";
import songsStyle from "./songs.module.css";
import { useState, useEffect, useRef, useCallback } from "react";
import { Track, Tracks } from "../../../../../types/track";
import { useAppSelector } from "../../../../../store/hooks";
import getTracks from "../../../../../api/search/getTracks";
import { SongCard } from "../../../reuseables/songCard";
import SongCardSkeleton from "../../../../../skeletons/songCardSkeleton";
export function SongsRes({ songName }: { songName: string }) {
  const [tracksData, setTracksData] = useState<{
    data: Array<Track | typeof SongCardSkeleton>;
    next: string | null;
  }>({
    next: null,
    data: [],
  });
  const [tracksLoading, setTracksLoading] = useState<boolean>(true);
  const [_tracksError, setTracksError] = useState<string | unknown>();
  const query = songName.split(" ").join("%20");
  const observing = useRef<null | IntersectionObserver>(null);

  const accessToken = useAppSelector(
    (state) => state.spotiUserReducer.spotiToken.accessToken
  );

  useEffect(() => {
    setTracksData({
      data: [],
      next: null,
    });
  }, [songName]);

  useEffect(() => {
    const fetchTracks = async () => {
      setTracksData((prev) => {
        return {
          ...prev,
          data: [...prev.data, ...Array(30).fill(SongCardSkeleton)],
          next: prev.next,
        };
      });
      try {
        setTracksLoading(true);
        const req = await getTracks(
          `/search?q=${query}&type=track&limit=30`,
          accessToken
        );
        const data: Tracks = req.data.tracks;

        setTracksData((prev) => {
          return {
            ...prev,
            data: [
              ...prev.data.filter((e) => typeof e !== typeof SongCardSkeleton),
              ...data.items,
            ],
            next: data.next,
          };
        });
      } catch (err) {
        setTracksError(err);
      } finally {
        setTracksLoading(false);
      }
    };

    fetchTracks();
  }, [accessToken, query]);

  const lastSong = useCallback(
    (node: HTMLDivElement | null) => {
      const fetchTracks = async () => {
        try {
          setTracksData((prev) => {
            return {
              ...prev,
              data: [...prev.data, ...Array(30).fill(SongCardSkeleton)],
              next: prev.next,
            };
          });
          setTracksLoading(true);
          const req = await getTracks(
            tracksData.next
              ? tracksData.next
              : `/search?q=${query}&type=track&limit=30`,
            accessToken
          );
          const data: Tracks = req.data.tracks;

          setTracksData((prev) => {
            return {
              ...prev,
              data: [...prev.data.filter((e) => typeof e !== typeof SongCardSkeleton), ...data.items],
              next: data.next,
            };
          });
        } catch (err) {
          setTracksError(err);
        } finally {
          setTracksLoading(false);
        }
      };
     
      if (!node) return;
      if (tracksLoading) return;
      if (observing.current) observing.current?.disconnect();
      observing.current = new IntersectionObserver((e) => {
        if (e[0].isIntersecting) {
       
          fetchTracks();
        }
      });
      observing.current?.observe(node);
    },
    [accessToken, query, tracksData.next, tracksLoading]
  );

  return (
    <section className={songsStyle["tracks-wrapper"]}>
      <div className={songsStyle["navigation-wrapper"]}>
        <div className={songsStyle["numbering-title"]}>
          <div>#</div>
          <div>Title</div>
        </div>

        <div>Album</div>

        <div>
          <img
            src={Duration}
            draggable={false}
            width={20}
            height={20}
            alt="Duration"
            style={{ marginBottom: "-5px" }}
          ></img>
        </div>
      </div>

      <div>
        {tracksData.data.map((eachTrack, i) => {
          if (typeof eachTrack === typeof SongCardSkeleton) {
            return <SongCardSkeleton key={i} />;
          } else {
            return (
              
              <SongCard
                ref={i === tracksData.data.length - 1 ? lastSong : null}
                n={i + 1}
                key={i}
                accessToken={accessToken}
                eachTrack={typeof eachTrack === "object" ? eachTrack : null}
              />
            );
          }
        })}
      </div>
    </section>
  );
}

export default SongsRes;
