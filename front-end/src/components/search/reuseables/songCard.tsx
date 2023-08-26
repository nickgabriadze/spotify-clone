import { Track } from "../../../types/track";
import songsStyle from "../components/each-search-component/Songs/songs.module.css";
import millisecondsToMmSs from "../../player/msConverter";
import React, { LegacyRef } from "react";
export function SongCard({innerRef, n, eachTrack }: {innerRef:LegacyRef<HTMLDivElement> | undefined, n: number; eachTrack: Track }) {




  return (
    <div className={songsStyle["track-wrapper"]}
    ref={innerRef}
    >
      <div className={songsStyle["general-info"]}>
        <div
      
        >{n}</div>
        <div className={songsStyle["img-title-artists"]}>
          <div className={songsStyle["album-img"]}>
            <img
              src={eachTrack.album.images[0]?.url}
             width={50}
              height={50}
              draggable={false}
              alt="Album Picture"
            ></img>
          </div>

          <div className={songsStyle["title-artists"]}>
            <a>{eachTrack.name.length > 25 ? eachTrack.name.slice(0, 25).concat("...") : eachTrack.name}</a>
            <p>{eachTrack.artists.map((each) => each.name).join(", ")}</p>
          </div>
        </div>
      </div>

      <div className={songsStyle["album-title"]}>
        <a>{eachTrack.album.name.length > 25 ? eachTrack.album.name.slice(0, 25).concat('...') : eachTrack.album.name}</a>
      </div>

      <div className={songsStyle["duration"]}>
        {millisecondsToMmSs(Number(eachTrack.duration_ms))}
      </div>
    </div>
  );
}

export default React.forwardRef((props) => <SongCard  {...props} />) as typeof SongCard;
