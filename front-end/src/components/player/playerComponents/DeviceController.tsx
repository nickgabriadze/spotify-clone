import {useEffect, useRef, useState} from "react";
import {Devices} from "../../../types/device";
import playerStyle from "../player.module.css";
import Queue from "../icons/queue.svg";
import CastDevice from "../icons/cast-device.svg"
import DevicesSVG from "../icons/devices.svg";
import VolumeUp from "../icons/volume.svg";
import VolumeOff from "../icons/volume-off.svg";
import setPlaybackVolume from "../../../api/player/setPlaybackVolume";
import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import {setUserControlActions} from "../../../store/features/navigationSlice";
import DeviceEqualiser from "../icons/device-picker-equaliser.webp"
import SmartphoneDevice from "../icons/smartphone-device.svg";
import TVDevice from "../icons/tv-device.svg";
import LaptopDevice from '../icons/laptop-device.svg'
import switchActiveDevice from "../../../api/player/switchActiveDevice.ts";
import {Link, useParams} from "react-router-dom";


export function DeviceController({devices,}: {
    devices: Devices | undefined;
}) {

    const currentlyPlayingIsPlaying = useAppSelector((state) => state.navigationReducer.currentlyPlayingSong.isPlaying)
    const deviceImages: {
        [key: string]: string
    } = {
        'TV': TVDevice,
        'Smartphone': SmartphoneDevice,
        'Computer': LaptopDevice,
        'default': DevicesSVG,
        "CastVideo": CastDevice

    }


    const [sliderVolume, setSliderVolume] = useState<number>(
        Number(
            devices?.devices?.filter((each) => each.is_active)[0]?.volume_percent
        )
    );


    useEffect(() => {
        setSliderVolume(Number(devices?.devices?.filter((each) => each.is_active)[0]?.volume_percent));
    }, [devices?.devices?.filter((each) => each.is_active)[0]?.volume_percent]);


    const dispatch = useAppDispatch();
    const accessToken = useAppSelector(state => state.spotiUserReducer.spotiToken.accessToken)
    const [showDevices, setShowDevices] = useState<boolean>(false)

    const popupRef = useRef<HTMLDivElement>(null);
    const devicesIconRef = useRef<HTMLImageElement>(null);
    const params = useParams();
    const isCurrentQueue = Object.values(params).includes('queue')
    const [previousSliderVolume, setPreviousSliderVolume] = useState<number>(sliderVolume === 0 ? 30 : sliderVolume)
    useEffect(() => {
        const handleClickOutside = (e: any) => {
            if (popupRef.current && !popupRef.current.contains(e.target)

            ) {

                if (e.target !== devicesIconRef.current) {
                    setShowDevices(false);
                }
            }
        };


        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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

    const listeningOnDevice = String(devices?.devices.filter(each => each.is_active)[0]?.type)
    return (
        <div className={playerStyle["devices-volume"]}>
            <Link to={'/queue'}>
                <button

                    style={{
                        padding: '2px 0 2px 0',
                        filter: `${isCurrentQueue ? 'invert(10%) sepia(60%) saturate(800%) hue-rotate(83deg) brightness(95%) contrast(80%)' : 'initial'}`
                    }}
                ><img src={Queue} width={23} style={{marginRight: '3px'}} alt="Song Queue icon"></img></button>
            </Link>
            <div className={playerStyle['devices-triangle']}


            ><img
                className={playerStyle['choose-devices']}
                onClick={() => setShowDevices((prev) => !prev)}
                src={deviceImages[listeningOnDevice ? listeningOnDevice : 'default']}
                ref={devicesIconRef}
                alt={"Device image"}

            ></img>
                <div className={playerStyle['triangle']}></div>

                {showDevices && <div className={playerStyle['devices-popup']} ref={popupRef}>

                    <div className={playerStyle['current-devices']}>
                        <div className={playerStyle['listening-on']}>
                            <img draggable={false} alt={"Equaliser icon"} src={DeviceEqualiser} width={30}
                                 height={30}></img>
                            <div className={playerStyle['actual-device']}>
                                <h3>Current Device</h3>
                                <h4>{devices?.devices.filter((each) => each.is_active)[0]?.name}</h4>
                            </div>

                        </div>
                    </div>
                    <div className={playerStyle['available-devices']}>
                        <h4>Select other devices</h4>
                        <div className={playerStyle['other-devices']}>
                            {devices?.devices.filter(each => !each.is_active).map((eachDevice) =>
                                <div key={eachDevice.id}

                                     onClick={async () => {
                                         await switchActiveDevice(accessToken, String(eachDevice?.id), Boolean(currentlyPlayingIsPlaying))

                                     }}
                                >

                                    <img
                                        draggable={false}
                                        alt={"Device icon"}
                                        src={deviceImages[eachDevice.type]} width={20} height={20}>

                                    </img>
                                    <h4>{eachDevice.name}</h4>


                                </div>)}
                        </div>
                    </div>

                    <div className={playerStyle['available-devices-triangle-indicator']}></div>
                </div>}
            </div>
            <button
                onClick={async () => {
                    await setPlaybackVolume(Number(
                        devices?.devices.filter((each) => each.is_active)[0]?.volume_percent
                    ) > 0 ? 0 : previousSliderVolume, accessToken);


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
    );
}

export default DeviceController;
