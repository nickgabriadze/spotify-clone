import Duration from "../icons/duration.svg";
import songsStyle from "./songs.module.css";
import { useState, useEffect } from "react";
import { Track, Tracks } from "../../../../../types/track";
import { useAppSelector } from "../../../../../store/hooks";
import getTracks from "../../../../../api/search/getTracks";
import SongCard from "../../../reuseables/songCard";
export function SongsRes({
  songName,
  scrolledToTheBottom,
}: {
  songName: string;
  scrolledToTheBottom: boolean;
}) {
  const [tracksData, setTracksData] = useState<Track[]>([]);
  const [tracksLoading, setTracksLoading] = useState<boolean>(true);
  const [tracksError, setTracksError] = useState<string | unknown>();
  const query = songName.split(" ").join("%20");
  const [nextApiCall, setNextApiCall] = useState<string | null>(
null
  );
  
  const accessToken = useAppSelector(
    (state) => state.spotiUserReducer.spotiToken.accessToken
  );

useEffect(()=> {
  setTracksData([])
  setNextApiCall(null)
}, [songName])


  

  useEffect(() => {
   
    const fetchTracks = async () => {
      try {
        setTracksLoading(true);
        const req = await getTracks(
          nextApiCall ? nextApiCall : `/search?q=${query}&type=track&limit=30`,
          accessToken
        );
        const data: Tracks = req.data.tracks;
        setNextApiCall((prev) =>
       scrolledToTheBottom === true ? data.next : prev
        );
     
          
        setTracksData((prev) => [...prev, ...data.items]);
      } catch (err) {
        setTracksError(err);
      } finally {
        setTracksLoading(false);
       
      }
    };
    
    
      fetchTracks();
 

      
 
  }, [accessToken, scrolledToTheBottom, nextApiCall, query]);

console.log(tracksData.length)
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
        {tracksData?.map((eachTrack, i) => (
          <SongCard n={i + 1} eachTrack={eachTrack} key={i} />
        ))}
      </div>
    </section>
  );
}

export default SongsRes;
