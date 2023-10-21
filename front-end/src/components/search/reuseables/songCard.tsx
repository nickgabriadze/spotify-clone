import {Track} from "../../../types/track";
import songsStyle from "../components/each-search-component/Songs/songs.module.css";
import millisecondsToMmSs from "../../player/msConverter";
import {LegacyRef, forwardRef, useState} from "react";
import Equaliser from "../../player/icons/device-picker-equaliser.webp"
import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import PlayResumeStreaming from "../../../api/player/playResumeStreaming";
import {addReactComponentToNavigation, setUserControlActions} from "../../../store/features/navigationSlice";
import Play from "../components/each-search-component/Songs/icons/play.svg"
import episodesStyle from "../components/each-search-component/PodcastsShows/podcastsShows.module.css";
import NoTrackPicture from "../components/each-search-component/icons/no-track-pic.svg"
import Pause from "../components/each-search-component/All/icons/pause.svg";
import PauseStreaming from "../../../api/player/pauseStreaming.ts";

export const SongCard = forwardRef(function SongCard(props: {
    eachTrack: Track | undefined,
    n: number,
    accessToken: string,
    forAlbum: boolean,
}, ref: LegacyRef<HTMLDivElement>) {

    const currentlyPlaying = useAppSelector(s => s.navigationReducer.currentlyPlayingSong)
    const {n, eachTrack, accessToken, forAlbum} = props;
    const songID = useAppSelector((state) => state.navigationReducer.currentlyPlayingSong.songID);
    const dispatch = useAppDispatch();
    const [hoveringOver, setHoveringOver] = useState<boolean>(false)


    return (
        <div className={songsStyle["track-wrapper"]}

             style={!forAlbum ? {
                 display: 'grid',
                 gridTemplateColumns: '1fr 1fr auto'
             } : {
                 display: 'flex',
                 justifyContent: 'space-between',
                 alignItems: 'center'

             }}
             onDoubleClick={async () => {
                 await PlayResumeStreaming(accessToken, undefined, [String(eachTrack?.uri)])
                 dispatch(setUserControlActions({
                     userAction: 'Play Track'
                 }))
             }}

             onMouseOver={() => setHoveringOver(true)}
             onMouseOut={() => setHoveringOver(false)}
             ref={ref}
        >
            <div className={songsStyle["general-info"]}>


                {eachTrack?.id === songID && !hoveringOver ?
                    <div style={{width: '15px', marginLeft: '-5px'}}>
                        <img alt={'Equaliser icon'} src={Equaliser}
                             width={20} height={30}></img></div>
                    :
                    <div>{hoveringOver ?
                        <div
                            onClick={async () => {
                                if (eachTrack?.id !== songID) {

                                    await PlayResumeStreaming(accessToken, undefined, [String(eachTrack?.uri)])
                                    dispatch(setUserControlActions({
                                        userAction: 'Play Track'
                                    }))

                                }
                                if (eachTrack?.id === songID && currentlyPlaying.isPlaying) {
                                    await PauseStreaming(accessToken)
                                    dispatch(setUserControlActions({
                                        userAction: 'Pause Track'
                                    }))
                                }

                                if (eachTrack?.id === songID && currentlyPlaying.isPlaying === false) {
                                    await PlayResumeStreaming(accessToken)
                                    dispatch(setUserControlActions({
                                        userAction: 'Resume Track'
                                    }))
                                }

                            }
                            }
                            className={songsStyle['during-hover']}
                        >{(currentlyPlaying.songID === String(eachTrack?.id) && currentlyPlaying.isPlaying) ?
                            <img style={{width: '30px', marginLeft: '-10px', marginRight: '-10px'}}

                                 alt={'Pause Button'} src={Pause}></img>
                            :
                            <img
                                style={{width: '40px', marginLeft: '-10px', marginRight: '-10px'}}
                                alt={'Play Button'} src={Play}></img>
                        }

                        </div> :
                        <p style={{width: '10px', color: '#b3b3b3'}}>{n}</p>}
                    </div>
                }
                <div className={songsStyle["img-title-artists"]}>
                    {!forAlbum && <div className={songsStyle["album-img"]}>
                        {eachTrack?.album.images[0]?.url ? <img
                                src={eachTrack?.album.images[0]?.url}
                                width={45}
                                height={45}
                                draggable={false}
                                alt="Album Picture"
                            ></img> :
                            <img
                                style={{
                                    backgroundColor: '#181818',
                                    padding: '5px',
                                    borderRadius: '5px'
                                }}
                                src={NoTrackPicture}
                                width={40}
                                height={40}
                                draggable={false}
                                alt="Album Picture"></img>}
                    </div>}

                    <div className={songsStyle["title-artists"]}
                         style={{
                             width: `${forAlbum ? '55vw' : '30vw'}`
                         }}
                    >
                        <a
                            onClick={() => {
                                if (eachTrack?.album?.id) {
                                    dispatch(addReactComponentToNavigation({
                                        componentName: 'Album',
                                        props: eachTrack?.album?.id
                                    }))
                                }
                            }}
                            style={

                                {
                                    width: 'fit-content',
                                    color: `${eachTrack?.id === songID ? '#1ed760' : 'white'}`
                                }}>{eachTrack?.name}</a>
                        <div
                            style={{display: 'flex', gap: '5px', alignItems: 'center'}}>
                            {eachTrack?.explicit ?
                                <div className={episodesStyle['explicit']} style={{fontSize: '8px'}}>E</div> : ''}
                            <p>{eachTrack?.artists.map((each) => each.name).join(", ")}</p></div>
                    </div>
                </div>
            </div>

            {
                !forAlbum && <div className={songsStyle["album-title"]}

                >
                    <a>{eachTrack?.album.name}</a>
                </div>
            }

            <div className={songsStyle["duration"]}>
                {
                    millisecondsToMmSs(Number(eachTrack?.duration_ms))
                }
            </div>
        </div>
    )
        ;
})

