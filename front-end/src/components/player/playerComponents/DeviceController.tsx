import { useState } from "react";
import { Devices } from "../../../types/device";
import playerStyle from "../player.module.css";
import Queue from "../icons/queue.svg";
import DevicesSVG from "../icons/devices.svg";
import VolumeUp from "../icons/volume.svg";
import VolumeOff from "../icons/volume-off.svg";

export function DeviceController({
  devices,
}: {
  devices: Devices | undefined;
}) {
  const [sliderVolume, setSliderVolume] = useState<number>(
    Number(
       devices?.devices?.filter((each) => each.is_active)[0]?.volume_percent
    )
  );


  return (
    <div className={playerStyle["devices-volume"]}>
      <img src={Queue} width={22} alt="Song Queue icon"></img>
      <img src={DevicesSVG} width={22} alt="Devices icon"></img>
      <img
        src={
          Number(
            devices?.devices.filter((each) => each.is_active)[0].volume_percent
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
          background: `linear-gradient(to right, #1ed760 ${
            sliderVolume
          }%, #4d4d4d ${
            sliderVolume
          }%)`,
        }}
        onChange={(e) => {
          setSliderVolume(Number(e.target.value));
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
