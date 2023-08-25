import Duration from "../icons/duration.svg";
import songsStyle from "./songs.module.css";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Tracks } from "../../../../../types/track";
import { useAppSelector } from "../../../../../store/hooks";
import getTracks from "../../../../../api/search/getTracks";
import SongCard from "../../../reuseables/songCard";
export function SongsRes({ songName }: { songName: string }) {
  const [tracksData, setTracksData] = useState<Tracks>();
  const [tracksLoading, setTracksLoading] = useState<boolean>(true);
  const [tracksError, setTracksError] = useState<string | unknown>();

  const accessToken = useAppSelector(
    (state) => state.spotiUserReducer.spotiToken.accessToken
  );

  

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setTracksLoading(true);
        const req = await getTracks(songName, accessToken);
        const data = req.data;

        setTracksData(data.tracks);
      } catch (err) {
        setTracksError(err);
      } finally {
        setTracksLoading(false);
      }
    };
    fetchTracks();
  }, [accessToken, songName]);


  
 
    
  
  
  
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
            style={{marginBottom: '-5px'}}
          ></img>
        </div>
      </div>

      <div>
        {tracksData?.items.map((eachTrack, i) => <SongCard 
        n={i+1}eachTrack={eachTrack} key={eachTrack.id} />)}
      </div>
    </section>
  );
}

export default SongsRes;
