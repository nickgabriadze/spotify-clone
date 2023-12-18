import {CurrentlyPlaying} from "../../types/currentlyPlaying.ts";
import {useEffect, useState} from "react";
import {getCurrentlyPlaying} from "../../api/player/getCurrentlyPlaying.ts";
import getPlaybackState from "../../api/player/getPlaybackState.ts";
import {PlaybackState} from "../../types/playbackState.ts";
import {useAppSelector} from "../../store/hooks.ts";
import SpotifyLOGO from './icons/spotify-icon-black.svg';
import fullScreenStyling from './fullscreen.module.css';

export function FullScreen({currentlyPlayingSong}: { currentlyPlayingSong: CurrentlyPlaying | null }) {
    console.log(currentlyPlayingSong)
    const [, setNoDataAvailable] = useState(true);
    const [currentlyPlaying, setCurrentlyPlaying] = useState<CurrentlyPlaying | null>(currentlyPlayingSong);
    const [, setPlaybackStateInformation] = useState<PlaybackState>();
    const access = useAppSelector(s => s.spotiUserReducer.spotiToken)
    useEffect(() => {
        const fetchCurrent = async () => {
            try {

                const req = await getCurrentlyPlaying(access.accessToken);
                const data = req.data;
                const requestPlaybackState = await getPlaybackState(access.accessToken);
                const playbackStateData = requestPlaybackState.data;


                if (req.status === 204) {
                    setNoDataAvailable(true);
                } else {
                    setCurrentlyPlaying(data);
                    setNoDataAvailable(false);
                    setPlaybackStateInformation(playbackStateData)


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
            if (e.key === "Escape") {
                await document.exitFullscreen();
            }
        }

        window.addEventListener('keydown', (e) => handleESC(e));

        return () => window.removeEventListener('keydown', (e) => handleESC(e))

    }, []);

    if (currentlyPlayingSong === null) {
        const exitFullScreen = async () => {
            await document.exitFullscreen();
        }
        exitFullScreen();
    }

    return <section className={fullScreenStyling['full-screen-wrapper']}>

        <img className={fullScreenStyling['spotify-logo']} alt={'Spotify logo'} src={SpotifyLOGO} width={80}
             height={80}></img>
        <div className={fullScreenStyling['song-info-wrapper']}>
            <div className={fullScreenStyling['album-img']}><img src={currentlyPlaying?.item.album.images[0].url}
                                                                 width={120} height={120}
                                                                 alt={"Album image"}></img></div>
            <div className={fullScreenStyling['song-details']}><h1>{currentlyPlaying?.item.name}</h1>
                <h4>{currentlyPlaying?.item.artists.map(each => each.name).join(', ')}</h4></div>
        </div>
    </section>

}

export default FullScreen;