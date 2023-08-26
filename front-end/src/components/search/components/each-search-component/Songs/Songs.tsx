import Duration from "../icons/duration.svg";
import songsStyle from "./songs.module.css";
import { useState, useEffect, useRef, useCallback } from "react";
import { Track, Tracks } from "../../../../../types/track";
import { useAppSelector } from "../../../../../store/hooks";
import getTracks from "../../../../../api/search/getTracks";
import { SongCard } from "../../../reuseables/songCard";
export function SongsRes({
  songName,
  
}: {
  songName: string;
 
}) {
  const [tracksData, setTracksData] = useState<{
    data: Track[];
    next: string | null;
  }>({
    next: null,
    data: [],
  });
  const [tracksLoading, setTracksLoading] = useState<boolean>(true);
  const [tracksError, setTracksError] = useState<string | unknown>();
  const query = songName.split(" ").join("%20");
  const observing = useRef< null | IntersectionObserver>(null)

  const accessToken = useAppSelector(
    (state) => state.spotiUserReducer.spotiToken.accessToken
  );



  useEffect(() => {
    setTracksData({
      data: [],
      next: null,
    });
  }, [songName]);


  useEffect(() =>{
    const fetchTracks = async () => {
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
            data: [...prev.data, ...data.items],
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
  }, [accessToken, query])


  const lastSong = useCallback((node: HTMLDivElement | null) => {
    const fetchTracks = async () => {
      try {
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
            data: [...prev.data, ...data.items],
            next: data.next,
          };
        });
      } catch (err) {
        setTracksError(err);
      } finally {
        setTracksLoading(false);
      }
    };
  

    if(!node) return;
    if(tracksLoading) return;
    if(observing.current) observing.current?.disconnect();
    observing.current = new IntersectionObserver((e) => {
      if(e[0].isIntersecting){
        console.log(e)
        fetchTracks()
      }
   
    });
    observing.current?.observe(node)
      
 }, [accessToken, query, tracksData.next, tracksLoading]);

  console.log(tracksData.data.length);
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
        {tracksData.data.map((eachTrack, i) => (
        <SongCard innerRef={i === tracksData.data.length - 1? lastSong: null}
        n={i+1}
        eachTrack={eachTrack}
        />
        ))}
        </div>
    </section>
  );
}

export default SongsRes;
