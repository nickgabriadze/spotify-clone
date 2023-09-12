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
import PlayNext from "../../../api/player/playNext";
import PlayPrevious from "../../../api/player/playPrevious";
import { useAppDispatch } from "../../../store/hooks";
import { setUserControlActions } from "../../../store/features/navigationSlice";
import PauseStreaming from "../../../api/player/pauseStreaming";
import PlayResumeStreaming from "../../../api/player/playResumeStreaming";
import SeekToPosition from "../../../api/player/seekToPosition";

export function StreamController({
  currentlyPlaying,
  accessToken,
}: {
  accessToken: string;
  currentlyPlaying: CurrentlyPlaying | undefined;
}) {
  const [pos, setPos] = useState<number>(
    (Number(currentlyPlaying?.progress_ms) /
      Number(currentlyPlaying?.item?.duration_ms)) *
      100
  );

  const dispatch = useAppDispatch();

  const [duration, setDuration] = useState<number>(
    Number(currentlyPlaying?.progress_ms)
  );

  useEffect(() => {
    setPos(
      (Number(currentlyPlaying?.progress_ms) /
        Number(currentlyPlaying?.item?.duration_ms)) *
        100
    );

    setDuration(Number(currentlyPlaying?.progress_ms));
  }, [currentlyPlaying?.progress_ms, currentlyPlaying?.item?.duration_ms]);

  useEffect(() => {
    if (currentlyPlaying?.is_playing) {
      const timerInterval = setInterval(() => {
        setPos((duration / Number(currentlyPlaying?.item?.duration_ms)) * 100);

        setDuration((prev) => prev + 1000);
      }, 1000);

      if(duration >= Number(currentlyPlaying?.item?.duration_ms)){
          dispatch(setUserControlActions({
              userAction: 'Retrieve New One'
          }))
      }
      return () => clearInterval(timerInterval);
    }
  }, [
    duration,
    currentlyPlaying?.item?.duration_ms,
    currentlyPlaying?.progress_ms,
    currentlyPlaying?.is_playing,
  ]);

  return (
    <div className={playerStyle["playback-control"]}>
      <div className={playerStyle["actual-controls"]}>
        <button style={{ marginBottom: "9px" }}>
          <img alt="Shuffle" src={Shuffle} width={20}></img>
        </button>
        <button
          onClick={async () => {
            await PlayPrevious(accessToken);
            dispatch(
              setUserControlActions({
                userAction: "Play Previous Song",
              })
            );
          }}
        >
          <img alt="Skip Previous" src={SkipPrevious} width={30}></img>
        </button>
        <button
        onClick={async () => {
          if(currentlyPlaying?.is_playing){
            await PauseStreaming(accessToken);
            dispatch(setUserControlActions({
              userAction: 'Pause Streaming'
            }))
          }else{
            await PlayResumeStreaming(accessToken);
            dispatch(setUserControlActions({
              userAction: 'Resume Streaming'
            }))
          }
        }}
        >
          <img
            alt="Play/Pause"
            src={currentlyPlaying?.is_playing ? Pause : Play}
            width={40}
          ></img>
        </button>
        <button
          onClick={async () => {
            await PlayNext(accessToken);
            dispatch(
              setUserControlActions({
                userAction: "Play Next Song",
              })
            );
          }}
        >
          <img alt="Skip Next" src={SkipNext} width={30}></img>
        </button>
        <button style={{ marginBottom: "9px" }}>
          <img alt="Repeat" src={Repeat} width={20}></img>
        </button>
      </div>

      <div className={playerStyle["duration"]}>
        <p>{millisecondsToMmSs(Number(duration))}</p>

        <input
          style={{
            background: `linear-gradient(to right, #1ed760 ${pos}%, #4d4d4d ${pos}%)`,
          }}

          onChange={async (e) => {setPos(Number(e.target.value));
            await SeekToPosition(accessToken, Math.round(Number(currentlyPlaying?.item?.duration_ms) * Number(e.target.value) / 100));
            dispatch(setUserControlActions({
              userAction: 'Seek To Position'
            }))
          }}
          type="range"
          value={String(pos)}
          max={100}
          min={0}
        />
        <p>{millisecondsToMmSs(Number(currentlyPlaying?.item?.duration_ms))}</p>
      </div>
    </div>
  );
}

export default StreamController;
