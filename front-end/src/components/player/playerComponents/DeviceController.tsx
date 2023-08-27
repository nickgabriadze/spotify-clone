import { useState } from "react";
import { Devices } from "../../../types/device";
import playerStyle from "../player.module.css";
import Queue from "../icons/queue.svg";
import DevicesSVG from "../icons/devices.svg";
import VolumeUp from "../icons/volume.svg";
import VolumeOff from "../icons/volume-off.svg";
import setPlaybackVolume from "../../../api/player/setPlaybackVolume";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setUserControlActions } from "../../../store/features/navigationSlice";

export function DeviceController({
  devices,
  
}:{
  devices: Devices | undefined;
}) {
  const [sliderVolume, setSliderVolume] = useState<number>(
    Number(
       devices?.devices?.filter((each) => each.is_active)[0]?.volume_percent
    )
  );
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(state => state.spotiUserReducer.spotiToken.accessToken)  

  return (
    <div className={playerStyle["devices-volume"]}>
      <img src={Queue} width={22} alt="Song Queue icon"></img>
      <div className={playerStyle['devices-triangle']}><img src={DevicesSVG} width={22} alt="Devices icon"></img>
      <div></div>
      </div>
      <button
      onClick={async () => {
        await setPlaybackVolume(Number(
          devices?.devices.filter((each) => each.is_active)[0]?.volume_percent
        ) > 0 ? 0 : sliderVolume, accessToken);
          
        dispatch(setUserControlActions({
          userAction: 'Volume On/Off'
        }))
      }}
      ><img
        src={
          Number(
            devices?.devices.filter((each) => each.is_active)[0]?.volume_percent
          ) > 0
            ? VolumeUp
            : VolumeOff
        }
        alt="Volume icon"
        width={22}
      ></img>
      </button>
      <input
        className={playerStyle["volume-rocker"]}
        style={{
          background: `linear-gradient(to right, #1ed760 ${
            sliderVolume
          }%, #4d4d4d ${
            sliderVolume
          }%)`,
        }}
        onChange={async  (e) => {
          setSliderVolume(Number(e.target.value));
          
          await setPlaybackVolume(Number(e.target.value), accessToken)
          dispatch(setUserControlActions({
            userAction: "Set Playback Volume"
          }))
        }}
        type="range"
        value={sliderVolume}
        max={100}
        min={0}
      />
    </div>
  );
}

export default DeviceController;
