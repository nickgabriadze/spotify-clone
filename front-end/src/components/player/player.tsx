import { useState, useEffect, useMemo } from "react";
import playerStyle from "./player.module.css";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getCurrentlyPlaying } from "../../api/player/getCurrentlyPlaying";
import { CurrentlyPlaying } from "../../types/currentlyPlaying";
import { getDevices } from "../../api/player/getDevices";
import { Devices } from "../../types/device";
import SongDetails from "./playerComponents/SongsDetails";
import DeviceController from "./playerComponents/DeviceController";
import StreamController from "./playerComponents/StreamController";
import { setCurrentlyPlayingSong } from "../../store/features/navigationSlice";

export function Player() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<CurrentlyPlaying>();
  const [currentLoading, setCurrentLoading] = useState<boolean>(true);
  const [noDataAvailable, setNoDataAvailable] = useState(true);
  const [devices, setDevices] = useState<Devices>();
  const [error, setError] = useState<string | unknown>();
  const access = useAppSelector((state) => state.spotiUserReducer.spotiToken);
  const [actions, setActions] = useState<string[]>([]);
  const dispatch = useAppDispatch();
 

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
          
          dispatch(setCurrentlyPlayingSong({
            currentlyPlayingSong: data.item.id
          }))
       
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
  }, [access, actions.length, dispatch ]);



  if (noDataAvailable) {
    document.title = "Spotify Clone";
    return <div></div>;
  } else {
    document.title = String(currentlyPlaying?.item?.name)
      .concat(" • ")
      .concat(String(currentlyPlaying?.item.artists[0].name));

    return (
      <section className={playerStyle["player-wrapper"]}>
        <SongDetails currentlyPlaying={noDataAvailable ? undefined: currentlyPlaying} />
        <StreamController currentlyPlaying={noDataAvailable ? undefined: currentlyPlaying}/>
        <DeviceController devices={noDataAvailable ? undefined: devices} />
      </section>
    );
  }
}

export default Player;
