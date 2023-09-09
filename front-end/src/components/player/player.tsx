import { useState, useEffect, useCallback } from "react";
import playerStyle from "./player.module.css";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getCurrentlyPlaying } from "../../api/player/getCurrentlyPlaying";
import { CurrentlyPlaying } from "../../types/currentlyPlaying";
import { getDevices } from "../../api/player/getDevices";
import { Devices } from "../../types/device";
import SongDetails from "./playerComponents/SongsDetails";
import DeviceController from "./playerComponents/DeviceController";
import StreamController from "./playerComponents/StreamController";
import { setCurrentlyPlayingSong, setUserControlActions } from "../../store/features/navigationSlice";
import GraphEQ from "./icons/graphicEq.svg"

export function Player() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<CurrentlyPlaying>();
  const [currentLoading, setCurrentLoading] = useState<boolean>(true);
  const [noDataAvailable, setNoDataAvailable] = useState(true);
  const [devices, setDevices] = useState<Devices>();
  const [error, setError] = useState<string | unknown>();
  const access = useAppSelector((state) => state.spotiUserReducer.spotiToken);
  const dispatch = useAppDispatch();
  const userActions = useAppSelector(state => state.navigationReducer.userControlActions);



  const fetchCurrentData = useCallback( async () => {
    try {
      setCurrentLoading(true)
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
          currentlyPlayingSong: {
            artistID: data.item.artists[0].id,
            albumID: data.item.album.id,
            songID: data.item.id,
            isPlaying: data.is_playing
          }
        }))
      }
    } catch (err) {
      setError(err);
    } finally {
      setCurrentLoading(false);
    }
  }, [access.accessToken, dispatch]);

  useEffect(() => {
        fetchCurrentData();
        if (userActions.length > 50) {
          dispatch(setUserControlActions({
            userAction: 'Nullify'
          }))
        } else {
          fetchCurrentData();

        }

      },
      [fetchCurrentData, dispatch, userActions.length])

  
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
            currentlyPlayingSong: {
              artistID: data.item.artists[0].id,
              albumID: data.item.album.id,
              songID: data.item.id,
              isPlaying: data.is_playing
            }
          }))
       
        }
      } catch (err) {
        setError(err);
      } 
    };

    
    const fetcher = setInterval(() => fetchCurrent(), 3000);

    return () => clearInterval(fetcher)
  

  }, [access, dispatch]);



  if (noDataAvailable) {
    document.title = "Spotify Clone";
    return <div></div>;
  } else {
    document.title = currentlyPlaying?.item?.name?  String(currentlyPlaying?.item?.name)
      .concat(" • ")
      .concat(String(currentlyPlaying?.item?.artists.map((each) => each.name).join(", "))) : 'Spotify Clone';

    return (
      <section className={playerStyle["player"]}>
        <div className={playerStyle['player-wrapper']}>
        <SongDetails  currentlyPlaying={noDataAvailable ? undefined: currentlyPlaying} />
        <StreamController accessToken={access.accessToken} currentlyPlaying={noDataAvailable ? undefined: currentlyPlaying}/>
        <DeviceController devices={noDataAvailable ? undefined: devices} />
        </div>
        <div className={playerStyle['which-device']}>
            <img
                alt={"Small Graphical Eq icon"}
                src={GraphEQ} width={25} height={25}></img><h5>Listening on {devices?.devices.filter((each) => each.is_active)[0]?.name}</h5>
        </div>
      </section>
    );
  }
}

export default Player;
