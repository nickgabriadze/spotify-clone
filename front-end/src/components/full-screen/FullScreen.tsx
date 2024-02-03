import {CurrentlyPlaying} from "../../types/currentlyPlaying.ts";
import {useEffect, useState} from "react";
import {getCurrentlyPlaying} from "../../api/player/getCurrentlyPlaying.ts";
import {useAppDispatch, useAppSelector} from "../../store/hooks.ts";
import SpotifyLOGO from './icons/spotify-icon-black.svg';
import fullScreenStyling from './fullscreen.module.css';
import {setDevices, setWindowFullScreen} from "../../store/features/spotiUserSlice.ts";
import UpNextInQueue from "./components/UpNext.tsx";
import CloseFullScreen from "./icons/close-full-screen.svg";
import LikeButton from "./components/LikeButton.tsx";
import ProgressBar from "./components/ProgressBar.tsx";
import FullScreenPlaybackControl from "./components/FullScreenPlaybackControl.tsx";
import {average} from "color.js";
import VolumeController from "../player/playerComponents/VolumeController.tsx";
import {getDevices} from "../../api/player/getDevices.ts";

export function FullScreen({currentlyPlayingSong}: { currentlyPlayingSong: CurrentlyPlaying | null }) {
    const [currentlyPlaying, setCurrentlyPlaying] = useState<CurrentlyPlaying | null>(currentlyPlayingSong);
    const access = useAppSelector(s => s.spotiUserReducer.spotiToken)
    const fullScreen = useAppSelector(s => s.spotiUserReducer.windowFullScreen);
    const dispatch = useAppDispatch();
    const [backgroundColorHex, setBackgroundColorHex] = useState<String>("#000000")
    useEffect(() => {
        const getBackgroundAVGColor = async () => {
            try {
                const hex = (await average(String(currentlyPlaying?.item?.album?.images[0].url), {format: 'rgb'})).toString();
                setBackgroundColorHex(`rgba(${hex},0.5)`)
            } catch (err) {
                setBackgroundColorHex("#000000")
            }
        }
        getBackgroundAVGColor()
    }, [currentlyPlaying?.item?.album?.images[0].url]);

    useEffect(() => {
        const fetchCurrent = async () => {
            try {

                const req = await getCurrentlyPlaying(access.accessToken);
                const data = req.data;

                const devices = await getDevices(access.accessToken);
                const devicesData = devices.data;

                if (req.status !== 204) {
                    setCurrentlyPlaying(data);
                    dispatch(setDevices({devices: devicesData}))
                }
            } catch (_) {
            }
        };


        const fetcher = setInterval(() => {
            if (localStorage.getItem('access_token')) {
                fetchCurrent()
            }
        }, 3000);

        return () => clearInterval(fetcher)
    }, [access.accessToken])

    useEffect(() => {
        const handleESC = async (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                dispatch(setWindowFullScreen(false))
                try {
                    await document.exitFullscreen();
                } catch (err) {

                }
            }

        };

        document.addEventListener('keydown', handleESC);

        return () => document.removeEventListener('keydown', handleESC)

    }, []);


    if (fullScreen && currentlyPlaying === null) dispatch(setWindowFullScreen(false));


    return <section className={fullScreenStyling['full-screen-wrapper']}
                    style={{display: fullScreen ? 'initial' : 'none', backgroundColor: `${backgroundColorHex}`}}
    >

        <div className={fullScreenStyling['header-logo-queue']}>
            <img draggable={false} className={fullScreenStyling['spotify-logo']} alt={'Spotify logo'} src={SpotifyLOGO}
                 width={100}

                 height={100}></img>
            <UpNextInQueue/>
        </div>


        <div className={fullScreenStyling['bottom-part']}>
            <div className={fullScreenStyling['song-info-wrapper']}>
                <div className={fullScreenStyling['album-img']}><img src={currentlyPlaying?.item.album.images[0].url}
                                                                     width={120} height={120}
                                                                     draggable={false}
                                                                     alt={"Album image"}></img></div>
                <div className={fullScreenStyling['song-details']}><h1>{currentlyPlaying?.item.name}</h1>
                    <h4>{currentlyPlaying?.item.artists.map(each => each.name).join(', ')}</h4></div>
            </div>

            <div className={fullScreenStyling['playback-controls']}>
                <div>
                    <ProgressBar/>
                </div>

                <div className={fullScreenStyling['like-playback-closefs']}>
                    <div style={{width: '5%'}}>
                        <LikeButton/>
                    </div>

                    <FullScreenPlaybackControl/>

                    <div className={fullScreenStyling['volume-control-exit-fs']}>
                        <VolumeController/>
                        <div
                            style={{width: 'fit-content'}}
                            onClick={async () => {
                                dispatch(setWindowFullScreen(false))
                                await document.exitFullscreen()

                            }}>
                            <img
                                title={"Exit full screen"}
                                alt={"Close full-screen Icon"}
                                className={fullScreenStyling['close-fs-btn']}
                                width={30} height={30} src={CloseFullScreen}></img>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    </section>

}

export default FullScreen;