import setPlaybackVolume from "../../../api/player/setPlaybackVolume.ts";
import {setUserControlActions} from "../../../store/features/navigationSlice.ts";
import VolumeUp from "../icons/volume.svg";
import VolumeOff from "../icons/volume-off.svg";
import playerStyle from "../player.module.css";
import {useAppDispatch, useAppSelector} from "../../../store/hooks.ts";
import {useEffect, useState} from "react";

export function VolumeController() {
    const devices = useAppSelector(s => s.spotiUserReducer.devices)

    const [sliderVolume, setSliderVolume] = useState<number>(
        Number(
            devices?.devices?.filter((each) => each.is_active)[0]?.volume_percent
        )
    );
    const [previousSliderVolume, setPreviousSliderVolume] = useState<number>(sliderVolume === 0 ? 30 : sliderVolume)

    const accessToken = useAppSelector(s => s.spotiUserReducer.spotiToken.accessToken)
    const dispatch = useAppDispatch();

    useEffect(() => {
        setSliderVolume(Number(devices?.devices?.filter((each) => each.is_active)[0]?.volume_percent));
    }, [devices?.devices?.filter((each) => each.is_active)[0]?.volume_percent]);

    useEffect(() => {

        const handleSliderVolumeTimeout = setTimeout(async () => {
            await setPlaybackVolume(Number(previousSliderVolume), accessToken)
            dispatch(setUserControlActions({
                userAction: "Set Playback Volume"
            }))
        }, 500)

        return () => {
            clearTimeout(handleSliderVolumeTimeout)
        }
    }, [previousSliderVolume]);
    return <div>
        <button
            onClick={async () => {
                await setPlaybackVolume(Number(
                    (devices?.devices.filter((each) => each.is_active)[0])?.volume_percent
                ) > 0 ? 0 : previousSliderVolume, accessToken);


                dispatch(setUserControlActions({
                    userAction: 'Volume On/Off'
                }))
            }}
        ><img
            src={
                Number(
                    devices && devices?.devices.filter((each) => each.is_active)[0]?.volume_percent
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
                background: `linear-gradient(to right, white ${
                    sliderVolume
                }%, #4d4d4d ${
                    sliderVolume
                }%)`,
            }}
            onChange={async (e) => {
                setSliderVolume(Number(e.target.value));
                setPreviousSliderVolume(Number(e.target.value))

            }}
            type="range"
            value={String(sliderVolume)}
            max={100}
            min={0}
        />
    </div>
}

export default VolumeController;