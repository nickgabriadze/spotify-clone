import { useState, useEffect } from "react";
import playerStyle from "./player.module.css";
import { useAppSelector } from "../../store/hooks";
import { getCurrentlyPlaying } from "../../api/getCurrentlyPlaying";
import SpotiError from "../Error";
import { CurrentlyPlaying } from "../../types/currentlyPlaying";
import Heart from "./icons/heart.svg";
import Play from "./icons/play.svg";
import Pause from "./icons/pause.svg";
import Shuffle from "./icons/shuffle.svg";
import SkipNext from "./icons/skip-next.svg";
import SkipPrevious from "./icons/skip-previous.svg";
import Repeat from "./icons/repeat.svg";

export function Player() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<CurrentlyPlaying>();
  const [currentLoading, setCurrentLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | unknown>("");
  const access = useAppSelector((state) => state.spotiUserReducer.spotiToken);
  function millisecondsToMmSs(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const mm = minutes.toString().padStart(2, "0");
    const ss = seconds.toString().padStart(2, "0");

    return `${mm}:${ss}`;
  }

  useEffect(() => {
    const fetchCurrent = async () => {
      try {
        const req = await getCurrentlyPlaying(access.accessToken);
        const data = req.data;
        setCurrentlyPlaying(data);
      } catch (err) {
        setError(err);
      } finally {
        setCurrentLoading(false);
      }
    };

    fetchCurrent();
  }, [access]);

 

  if (error) {
    return <SpotiError />;
  }
  if (currentLoading) {
    return <h1>loading...</h1>;
  } else {
    return (
      <section className={playerStyle["player-wrapper"]}>
        <div className={playerStyle["currently-playing-info"]}>
          <img
            alt="Album picture"
            draggable={false}
            src={currentlyPlaying?.item.album?.images[2].url}
            height={55}
            width={55}
          ></img>
          <div className={playerStyle["song-info"]}>
            <a className={playerStyle["song-name"]}>
              {currentlyPlaying?.item.name}
            </a>
            <div>
              {" "}
              {currentlyPlaying?.item.artists.map((each, i) => (
                <a key={each.id} className={playerStyle["artists-name"]}>
                  {each.name}
                  {i === currentlyPlaying.item.artists.length - 1 ? "" : ", "}
                </a>
              ))}
            </div>
          </div>
          <img src={Heart} width={20} height={18} alt="heart icon"></img>
        </div>
        <div className={playerStyle["playback-control"]}>
          <div className={playerStyle["actual-controls"]}>
            <button>
              <img alt="Shuffle" src={Shuffle} width={20}></img>
            </button>
            <button>
              {" "}
              <img alt="Skip Previous" src={SkipPrevious} width={30}></img>
            </button>
            <button>
              {" "}
              <img
                alt="Play/Pause"
                src={currentlyPlaying?.is_playing ? Pause : Play}
                width={40}
              ></img>
            </button>
            <button>
              <img alt="Skip Next" src={SkipNext} width={30}></img>
            </button>
            <button>
              <img alt="Repeat" src={Repeat} width={20}></img>
            </button>
          </div>

          <div className={playerStyle["duration"]}>
            <p>{millisecondsToMmSs(Number(currentlyPlaying?.progress_ms))}</p>
            <div
            
              style={{
                backgroundColor: "#4c4c4c",
                width: "100%",
                height: "4px",
                borderRadius: "5px",
              }}
            >
              <div
                className={playerStyle["duration-track"]}
                style={{
                  width: `${
                    (Number(currentlyPlaying?.progress_ms) /
                      Number(currentlyPlaying?.item.duration_ms)) *
                    100
                  }%`,
                  
                  height: " 4px",
                  borderRadius: "5px",
                }}
              ></div>
            </div>
            <p>
              {millisecondsToMmSs(Number(currentlyPlaying?.item.duration_ms))}
            </p>
          </div>
        </div>
        <div className={playerStyle["devices-volume"]}></div>
      </section>
    );
  }
}

export default Player;
