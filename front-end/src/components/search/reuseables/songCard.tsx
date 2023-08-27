import { Track } from "../../../types/track";
import songsStyle from "../components/each-search-component/Songs/songs.module.css";
import millisecondsToMmSs from "../../player/msConverter";
import { LegacyRef, forwardRef } from "react";
import Equaliser from "../../player/icons/device-picker-equaliser-animation.946e7243.webp"
import { useAppSelector } from "../../../store/hooks";

export const SongCard =  forwardRef(function SongCard(props:{
  eachTrack: Track | null,
  n: number
}, ref:LegacyRef<HTMLDivElement>) {

  const {n, eachTrack} = props;
  const songID = useAppSelector((state) => state.navigationReducer.currentlyPlayingSong);


  return (
    <div className={songsStyle["track-wrapper"]}
    ref={ref}
    >
      <div className={songsStyle["general-info"]}>
        
      
        {eachTrack?.id === songID? <div style={{width: '15px', marginLeft: '-5px'}}> <img src={Equaliser} width={20} height={30} ></img></div> : <div>{n}</div>}
        <div className={songsStyle["img-title-artists"]}>
          <div className={songsStyle["album-img"]}>
            <img
              src={eachTrack?.album.images[0]?.url}
             width={50}
              height={50}
              draggable={false}
              alt="Album Picture"
            ></img>
          </div>

          <div className={songsStyle["title-artists"]}>
            <a>{Number(eachTrack?.name?.length) > 25 ? eachTrack?.name.slice(0, 25).concat("...") : eachTrack?.name}</a>
            <p>{eachTrack?.artists.map((each) => each.name).join(", ")}</p>
          </div>
        </div>
      </div>

      <div className={songsStyle["album-title"]}>
        <a>{Number(eachTrack?.album.name.length) > 25 ? eachTrack?.album.name.slice(0, 25).concat('...') : eachTrack?.album.name}</a>
      </div>

      <div className={songsStyle["duration"]}>
        {millisecondsToMmSs(Number(eachTrack?.duration_ms))}
      </div>
    </div>
  );
})

