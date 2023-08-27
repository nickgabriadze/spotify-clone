import { useState, useEffect } from "react";
import playerStyle from "./player.module.css";
import { useAppSelector } from "../../store/hooks";
import { getCurrentlyPlaying } from "../../api/player/getCurrentlyPlaying";
import { CurrentlyPlaying } from "../../types/currentlyPlaying";
import Play from "./icons/play.svg";
import Pause from "./icons/pause.svg";
import Shuffle from "./icons/shuffle.svg";
import SkipNext from "./icons/skip-next.svg";
import SkipPrevious from "./icons/skip-previous.svg";
import Repeat from "./icons/repeat.svg";
import { getDevices } from "../../api/player/getDevices";
import { Devices } from "../../types/device";
import millisecondsToMmSs from "./msConverter";
import setPlayerPosition from "../../api/player/setPlayerPosition";
import SongDetails from "./playerComponents/SongsDetails";
import DeviceController from "./playerComponents/DeviceController";

export function Player() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<CurrentlyPlaying>();
  const [currentLoading, setCurrentLoading] = useState<boolean>(true);
  const [noDataAvailable, setNoDataAvailable] = useState(true);
  const [devices, setDevices] = useState<Devices>();
  const [error, setError] = useState<string | unknown>();
  const access = useAppSelector((state) => state.spotiUserReducer.spotiToken);
  const [actions, setActions] = useState<string[]>([]);

  useEffect(() => {
    const fetchCurrent = async () => {
      try {
        const devices = await getDevices(access.accessToken);
        const devicesData = devices.data;

        setDevices(devicesData);
        const req = await getCurrentlyPlaying(access.accessToken);
        const data = req.data;
        if (req.status === 204) {
          setNoDataAvailable(true);
        } else {
          setCurrentlyPlaying(data);
          setNoDataAvailable(false);
        }
      } catch (err) {
        setError(err);
      } finally {
        setCurrentLoading(false);
      }
    };

    if (actions.length > 50) {
      setActions([]);
    }

    fetchCurrent();
  }, [access, actions.length]);

  if (noDataAvailable) {
    document.title = "Spotify Clone";
    return <div></div>;
  } else {
    document.title = String(currentlyPlaying?.item?.name)
      .concat(" • ")
      .concat(String(currentlyPlaying?.item.artists[0].name));

    return (
      <section className={playerStyle["player-wrapper"]}>
        <SongDetails currentlyPlaying={currentlyPlaying} />
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
                  (Number(currentlyPlaying?.progress_ms) /
                    Number(currentlyPlaying?.item?.duration_ms)) *
                  100
                }%, #4d4d4d ${
                  (Number(currentlyPlaying?.progress_ms) /
                    Number(currentlyPlaying?.item?.duration_ms)) *
                  100
                }%)`,
              }}
              onChange={async (e) => {
                await setPlayerPosition(
                  Number(e.target.value),
                  access.accessToken
                );
                setActions((prev) => [...prev, "Seek To Pos"]);
              }}
              type="range"
              value={Number(currentlyPlaying?.progress_ms)}
              max={currentlyPlaying?.item?.duration_ms}
              min={0}
            />
            <p>
              {millisecondsToMmSs(Number(currentlyPlaying?.item?.duration_ms))}
            </p>
          </div>
        </div>
        <DeviceController devices={devices} />
      </section>
    );
  }
}

export default Player;
