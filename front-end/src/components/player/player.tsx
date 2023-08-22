import { useState, useEffect } from "react";
import playerStyle from "./player.module.css";
import { useAppSelector } from "../../store/hooks";
import { getCurrentlyPlaying } from "../../api/player/getCurrentlyPlaying";
import { CurrentlyPlaying } from "../../types/currentlyPlaying";
import Heart from "./icons/heart.svg";
import Play from "./icons/play.svg";
import Queue from "./icons/queue.svg";
import DevicesSVG from "./icons/devices.svg";
import Pause from "./icons/pause.svg";
import Shuffle from "./icons/shuffle.svg";
import SkipNext from "./icons/skip-next.svg";
import SkipPrevious from "./icons/skip-previous.svg";
import Repeat from "./icons/repeat.svg";
import { getDevices } from "../../api/player/getDevices";
import { Devices } from "../../types/device";
import millisecondsToMmSs from "./msConverter";
import VolumeUp from "./icons/volume.svg";
import VolumeOff from "./icons/volume-off.svg";
import setPlaybackVolume from "../../api/player/setPlaybackVolume";

export function Player() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<CurrentlyPlaying>();
  const [currentLoading, setCurrentLoading] = useState<boolean>(true);
  const [noDataAvailable, setNoDataAvailable] = useState(false);
  const [devices, setDevices] = useState<Devices>();
  const [error, setError] = useState<string | unknown>();
  const access = useAppSelector((state) => state.spotiUserReducer.spotiToken);
  const [actions, setActions] = useState<string[]>([])
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
        }
      } catch (err) {
        setError(err);
      } finally {
        setCurrentLoading(false);
      }
    };

    if(actions.length > 50){
      setActions([])
    }

    fetchCurrent();
  }, [access, actions.length]);

  const [sliderVolume, setSliderVolume] = useState<number>(
    Number(
      devices?.devices?.filter((each) => each.is_active)[0]?.volume_percent
    )
  );

  if (noDataAvailable) {
    document.title = "Spotify Clone";
    return <div></div>;
  } else {
    document.title = String(currentlyPlaying?.item?.name)
      .concat(" • ")
      .concat(String(currentlyPlaying?.item.artists[0].name));

    return (
      <section className={playerStyle["player-wrapper"]}>
        <div className={playerStyle["currently-playing-info"]}>
          <img
            alt="Album picture"
            draggable={false}
            src={currentlyPlaying?.item?.album?.images[2].url}
            height={70}
            width={70}
          ></img>
          <div className={playerStyle["song-info"]}>
            <a className={playerStyle["song-name"]}>
              {currentlyPlaying?.item?.name}
            </a>
            <div>
              {currentlyPlaying?.item?.artists.map((each, i) => (
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
              type="range"
              value={
                (Number(currentlyPlaying?.progress_ms) /
                  Number(currentlyPlaying?.item?.duration_ms)) *
                100
              }
              max={100}
              min={0}
            />
            <p>
              {millisecondsToMmSs(Number(currentlyPlaying?.item?.duration_ms))}
            </p>
          </div>
        </div>
        <div className={playerStyle["devices-volume"]}>
          <img src={Queue} width={22} alt="Song Queue icon"></img>
          <img src={DevicesSVG} width={22} alt="Devices icon"></img>
          <img
          onClick={async () => {
            setActions((prev) => [...prev, "Volume On/Off"])
            await setPlaybackVolume(
              Number(devices?.devices.filter((each) => each.is_active)[0].volume_percent) > 0 ? 0 : 100,
              access.accessToken
            );
          }}
            src={
              Number(
                devices?.devices.filter((each) => each.is_active)[0]
                  .volume_percent
              ) > 0
                ? VolumeUp
                : VolumeOff
            }
            alt="Volume icon"
            width={22}
          ></img>
          <input
            className={playerStyle["volume-rocker"]}
            style={{
              background: `linear-gradient(to right, #1ed760 ${ devices?.devices?.filter((each) => each.is_active)[0]?.volume_percent}%, #4d4d4d ${ devices?.devices?.filter((each) => each.is_active)[0]?.volume_percent}%)`,
            }}
            onChange={async (e) => {
              setSliderVolume(Number(e.target.value));
               await setPlaybackVolume(
                Number(e.target.value),
                access.accessToken
              );
              setActions((prev) => [...prev, "Volume Up"])
            }}
            type="range"
            value={sliderVolume}
            max={100}
            min={0}
          />
        </div>
      </section>
    );
  }
}

export default Player;
