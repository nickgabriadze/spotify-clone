import playerStyle from "../player.module.css";
import millisecondsToMmSs from "../msConverter";
import Play from "../icons/play.svg";
import Pause from "../icons/pause.svg";
import Shuffle from "../icons/shuffle.svg";
import SkipNext from "../icons/skip-next.svg";
import SkipPrevious from "../icons/skip-previous.svg";
import Repeat from "../icons/repeat.svg";
import { CurrentlyPlaying } from "../../../types/currentlyPlaying";
import { useEffect, useState } from "react";

export function StreamController({currentlyPlaying}: {currentlyPlaying: CurrentlyPlaying | undefined}){
    const [pos, setPos] = useState<number>(
       
            (Number(currentlyPlaying?.progress_ms) /
            Number(currentlyPlaying?.item?.duration_ms)) * 100
        
      );

      useEffect(() => {
            setPos((Number(currentlyPlaying?.progress_ms) /
            Number(currentlyPlaying?.item?.duration_ms)) * 100)

      }, [currentlyPlaying?.progress_ms, currentlyPlaying?.item?.duration_ms])
    
    return (
        <div className={playerStyle["playback-control"]}>
        <div className={playerStyle["actual-controls"]}>
          <button style={{ marginBottom: "9px" }}>
            <img alt="Shuffle" src={Shuffle} width={20}></img>
          </button>
          <button>
            <img alt="Skip Previous" src={SkipPrevious} width={30}></img>
          </button>
          <button>
            <img
              alt="Play/Pause"
              src={currentlyPlaying?.is_playing ? Pause : Play}
              width={40}
            ></img>
          </button>
          <button>
            <img alt="Skip Next" src={SkipNext} width={30}></img>
          </button>
          <button style={{ marginBottom: "9px" }}>
            <img alt="Repeat" src={Repeat} width={20}></img>
          </button>
        </div>

        <div className={playerStyle["duration"]}>
          <p>{millisecondsToMmSs(Number(currentlyPlaying?.progress_ms))}</p>

          <input
            style={{
              background: `linear-gradient(to right, #1ed760 ${
               pos
              }%, #4d4d4d ${
               pos
              }%)`,
            }}
            onChange={(e) => setPos(Number(e.target.value))}
            type="range"
            value={pos}
            max={100}
            min={0}
          />
          <p>
            {millisecondsToMmSs(Number(currentlyPlaying?.item?.duration_ms))}
          </p>
        </div>
      </div>
    )
}

export default StreamController;
