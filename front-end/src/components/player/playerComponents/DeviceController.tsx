import {useEffect, useRef, useState} from "react";
import {Devices} from "../../../types/device";
import playerStyle from "../player.module.css";
import Queue from "../icons/queue.svg";
import CastDevice from "../icons/cast-device.svg"
import DevicesSVG from "../icons/devices.svg";
import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import {setNavigationHistory} from "../../../store/features/navigationSlice";
import DeviceEqualiser from "../icons/device-picker-equaliser.webp"
import SmartphoneDevice from "../icons/smartphone-device.svg";
import TVDevice from "../icons/tv-device.svg";
import LaptopDevice from '../icons/laptop-device.svg'
import switchActiveDevice from "../../../api/player/switchActiveDevice.ts";
import {Link, useLocation, useParams} from "react-router-dom";
import OpenInFullScreen from '../icons/open-full-screen.svg';
import useProperNavigationState from "../../utils/useProperNavigationState.ts";
import VolumeController from "./VolumeController.tsx";


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






    const dispatch = useAppDispatch();
    const accessToken = useAppSelector(state => state.spotiUserReducer.spotiToken.accessToken)
    const [showDevices, setShowDevices] = useState<boolean>(false)
    const loc = useLocation();
    const popupRef = useRef<HTMLDivElement>(null);
    const devicesIconRef = useRef<HTMLImageElement>(null);
    const params = useParams();
    const isCurrentQueue = Object.values(params).includes('queue')
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



    const listeningOnDevice = String(devices?.devices.filter(each => each.is_active)[0]?.type)
    return (
        <div className={playerStyle["devices-volume"]}>
            <Link to={'/queue'}
                  onClick={() => {
                      dispatch(setNavigationHistory(useProperNavigationState(loc, 'queue', false, 'queue').previousPaths))
                  }}
                  state={useProperNavigationState(loc, 'queue', false, 'queue')}

            >
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
            <div className={playerStyle['volume-controller']}>
                <VolumeController />
                <img

                    alt={"Open In FullScreen icon"}
                     className={playerStyle['full-screen-icon']}
                     title={'Open in Full Screen'}
                     onClick={() => document.documentElement.requestFullscreen()} width={18}
                     src={OpenInFullScreen}></img>

            </div>
        </div>
    );
}

export default DeviceController;
