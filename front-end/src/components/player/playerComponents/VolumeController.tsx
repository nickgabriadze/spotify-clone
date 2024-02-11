import setPlaybackVolume from "../../../api/player/setPlaybackVolume.ts";
import {setUserControlActions} from "../../../store/features/navigationSlice.ts";
import VolumeUp from "../icons/volume.svg";
import VolumeOff from "../icons/volume-off.svg";
import playerStyle from "../player.module.css";
import {useAppDispatch, useAppSelector} from "../../../store/hooks.ts";
import {useEffect, useRef, useState} from "react";

export function VolumeController() {
    const devices = useAppSelector(s => s.spotiUserReducer.devices)
    const volumeTrackerWrapperRef = useRef<HTMLDivElement | null>(null)
    const volumeProgressBarTrackerRef = useRef<HTMLDivElement | null>(null)
    const [trackerHover, setTrackerHover] = useState<boolean>(false);
    const [sliderVolume, setSliderVolume] = useState<number>(
        Number(
            devices?.devices?.filter((each) => each.is_active)[0]?.volume_percent
        )
        | 30
    );
    const [volumeOn, setVolumeOn] = useState<boolean>(
        Number(devices?.devices.filter((each) => each.is_active)[0]?.volume_percent) > 0)
    const [previousSliderVolume, setPreviousSliderVolume] = useState<number>(sliderVolume === 0 ? 30 : sliderVolume)
    const [mouseDrag, setMouseDrag] = useState<boolean>(false)
    const accessToken = useAppSelector(s => s.spotiUserReducer.spotiToken.accessToken)
    const dispatch = useAppDispatch();

    useEffect(() => {
        setSliderVolume(Number(devices?.devices?.filter((each) => each.is_active)[0]?.volume_percent));
    }, [devices?.devices?.filter((each) => each.is_active)[0]?.volume_percent]);


    useEffect(() => {
        const changeSliderVolume = setTimeout(async () => {
            await setPlaybackVolume(Number(sliderVolume), accessToken)
            dispatch(setUserControlActions({
                userAction: "Set Playback Volume"
            }))
        }, 500)

        return () => {
            clearTimeout(changeSliderVolume)
        }

    }, [sliderVolume, accessToken]);

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
    }, [previousSliderVolume, accessToken]);

    useEffect(() => {

        const changeVolumeInstant = (e: MouseEvent) => {
            if (mouseDrag) {
                const percentage =
                    Math.round(((e.clientX - Number(volumeTrackerWrapperRef.current?.getClientRects()[0].x) - 5)
                    /
                    Number(volumeTrackerWrapperRef.current?.clientWidth)) * 100)
                setPreviousSliderVolume(sliderVolume)
                setSliderVolume(percentage)             }
            e.preventDefault()
        }

        const changeVolumeOnClick = (e: MouseEvent) => {
            if (!mouseDrag) {
                const percentage =
                    Math.round(((e.clientX - Number(volumeTrackerWrapperRef.current?.getClientRects()[0].x) - 5)
                        /
                        Number(volumeTrackerWrapperRef.current?.clientWidth)) * 100)
                    console.log(percentage)
                setPreviousSliderVolume(sliderVolume)
                setSliderVolume(percentage)

            }
            e.preventDefault()
        }

        volumeTrackerWrapperRef.current?.addEventListener('mousedown', changeMouseDragTrue)
        volumeTrackerWrapperRef.current?.addEventListener("mouseup", changeMouseDragFalse)
        volumeTrackerWrapperRef.current?.addEventListener("mousemove", changeVolumeInstant)
        volumeTrackerWrapperRef.current?.addEventListener("click", changeVolumeOnClick)

        return () => {
            volumeTrackerWrapperRef.current?.removeEventListener('mousedown', changeMouseDragTrue)
            volumeTrackerWrapperRef.current?.removeEventListener("mouseup", changeMouseDragFalse)
            volumeTrackerWrapperRef.current?.removeEventListener("mousemove",changeVolumeInstant)
            volumeTrackerWrapperRef.current?.removeEventListener("click", changeVolumeOnClick)
        }

    }, [mouseDrag, volumeTrackerWrapperRef.current, volumeProgressBarTrackerRef.current])

    const changeMouseDragTrue = () => setMouseDrag(true)
    const changeMouseDragFalse = () => setMouseDrag(false)

    return <div style={{width: '100%', minWidth: '10px'}}>
        <button
            onClick={async () => {
                setVolumeOn((prev) => !prev)
                await setPlaybackVolume(Number(
                    (devices?.devices.filter((each) => each.is_active)[0])?.volume_percent
                ) > 0 ? 0 : previousSliderVolume, accessToken);


                dispatch(setUserControlActions({
                    userAction: 'Volume On/Off'
                }))
            }}
        ><img
            src={
                volumeOn
                    ? VolumeUp
                    : VolumeOff
            }
            alt="Volume icon"
            width={22}
        ></img>
        </button>
        <div className={playerStyle['volume-tracker-wrapper']}
             ref={volumeTrackerWrapperRef}
             onMouseOver={() => {
                 setTrackerHover(true)
             }}
             onMouseOut={() => setTrackerHover(false)}
        >
            <div className={playerStyle['volume-tracker-progress-bar']}
                 ref={volumeProgressBarTrackerRef}
                 style={{backgroundColor: trackerHover ? '#1ed760' : 'white', width: `${sliderVolume}%`}}
            >
                <button className={playerStyle['volume-tracker-btn']}
                     style={trackerHover ? {display: 'block'} : {display: 'none'}}
                >

                </button>
            </div>

        </div>
    </div>
}

export default VolumeController;