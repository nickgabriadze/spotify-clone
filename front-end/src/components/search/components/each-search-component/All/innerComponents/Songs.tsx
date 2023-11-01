import allResultsStyle from "../allresults.module.css";
import {Track} from "../../../../../../types/track.ts";
import millisecondsToHhMmSs from "../../../../../player/msConverter.ts";
import {useEffect, useState} from "react";
import PlayResumeStreaming from "../../../../../../api/player/playResumeStreaming.ts";
import {
    addLibraryAction,
    addReactComponentToNavigation,
    setUserControlActions
} from "../../../../../../store/features/navigationSlice.ts";
import PauseStreaming from "../../../../../../api/player/pauseStreaming.ts";
import {useAppDispatch, useAppSelector} from "../../../../../../store/hooks.ts";
import Pause from "../icons/pause.svg"
import Play from "../icons/play.svg";
import episodesStyle from "../../PodcastsShows/podcastsShows.module.css";
import TopSongCardSkeleton from "../../../../../../skeletons/topSongCardSkeleton.tsx";
import NoTrackPicture from "../../icons/no-track-pic.svg";
import removeTrackForCurrentUser from "../../../../../../api/library/removeTrackForCurrentUser.ts";
import saveTrackForCurrentUser from "../../../../../../api/library/saveTrackForCurrentUser.ts";
import SavedTrackIcon from "../../../../../player/icons/liked-indicator-heart.svg";
import Heart from "../../../../../player/icons/heart.svg";

export function Songs({firstFour, resultsLoading}: { firstFour: Track[] | undefined, resultsLoading: boolean }) {
    const [hoveringOver, setHoveringOver] = useState<string>('none');
    const currentlyPlaying = useAppSelector((state) => state.navigationReducer.currentlyPlayingSong);
    const accessToken = useAppSelector(state => state.spotiUserReducer.spotiToken.accessToken);
    const dispatch = useAppDispatch();
    const [currentSaved, setCurrentSaved] = useState<string[]>([])
    const savedSongs = useAppSelector((state) => state.spotiUserReducer.userSaved.userSavedSongIDs);

    useEffect(() => {
        setCurrentSaved(
            firstFour !== undefined ?  [...firstFour?.filter(eachTrack => savedSongs.includes(String(eachTrack?.id))).map(e => String(e?.id))] : []
        )

    }, [savedSongs.length, firstFour?.length]);

    return <div className={allResultsStyle['top-songs-wrapper']}>
        <h2>Songs</h2>
        <div className={allResultsStyle['top-songs-box']}>
            {resultsLoading ?
                Array.from({length: 4}).map((_, i) => <TopSongCardSkeleton key={i}/>)
                :

                firstFour?.map((eachTrack, i) =>
                    <div key={i} className={allResultsStyle['top-song']}
                         onDoubleClick={async () => {
                             await PlayResumeStreaming(accessToken, undefined, [String(eachTrack?.uri)]);
                             dispatch(
                                 setUserControlActions({
                                     userAction: "Play Track",
                                 })
                             );
                         }}
                         style={eachTrack.id === hoveringOver ? {
                             cursor: "pointer",
                             backgroundColor: `#3b3a3a`,
                             borderRadius: '4px'
                         } : {}}
                         onMouseOut={() => setHoveringOver('none')}
                         onMouseOver={() => setHoveringOver(eachTrack.id)}>
                        <div className={allResultsStyle['song-img-details']}>
                            <div className={allResultsStyle['interactive-album-img']}>
                                {eachTrack?.album.images[0]?.url ? <img
                                        src={eachTrack?.album.images[0]?.url}
                                        width={40}
                                        height={40}
                                        draggable={false}
                                        alt="Album Picture"
                                    ></img> :
                                    <img
                                        style={{
                                            backgroundColor: '#181818',
                                            padding: '5px',
                                            borderRadius: '5px',
                                            filter: 'brightness(30%)'
                                        }}
                                        src={NoTrackPicture}
                                        width={40}
                                        height={40}
                                        draggable={false}
                                        alt="Album Picture"></img>}
                                {eachTrack.id === hoveringOver &&
                                    <div
                                        onClick={async () => {

                                            if (!(currentlyPlaying.songID === String(eachTrack?.id))) {
                                                await PlayResumeStreaming(accessToken, undefined, [String(eachTrack?.uri)]);
                                                dispatch(
                                                    setUserControlActions({
                                                        userAction: "Play Track",
                                                    })
                                                );
                                            } else if (currentlyPlaying.isPlaying && currentlyPlaying.songID === String(eachTrack?.id)) {
                                                await PauseStreaming(accessToken);
                                                dispatch(
                                                    setUserControlActions({
                                                        userAction: "Pause Track",
                                                    })
                                                );
                                            } else if (!(currentlyPlaying.isPlaying) && currentlyPlaying.songID === String(eachTrack?.id)) {
                                                await PlayResumeStreaming(accessToken);
                                                dispatch(
                                                    setUserControlActions({
                                                        userAction: "Resume Track",
                                                    })
                                                );
                                            }
                                        }}
                                    >{(currentlyPlaying.songID === String(eachTrack?.id) && currentlyPlaying.isPlaying) ?
                                        <img style={{padding: '5px'}} className={allResultsStyle['play-button']}
                                             width={40}
                                             alt={'Pause Button'} height={40} src={Pause}></img>
                                        :
                                        <img className={allResultsStyle['play-button']} width={40} height={40}
                                             alt={'Play Button'} src={Play}></img>
                                    }

                                    </div>}
                            </div>
                            <div className={allResultsStyle['song-details']}>
                                <a
                                    onClick={() => {
                                        dispatch(addReactComponentToNavigation({
                                            componentName: 'Album',
                                            props: eachTrack?.album?.id
                                        }))
                                    }}
                                >{eachTrack?.name[0].toUpperCase().concat(eachTrack?.name.slice(1,)).length > 30 ? eachTrack?.name[0].toUpperCase().concat(eachTrack?.name.slice(1,)).slice(0, 30).concat('...') : eachTrack?.name[0].toUpperCase().concat(eachTrack?.name.slice(1,))}</a>
                                <div className={allResultsStyle['song-artists']}>
                                    {eachTrack?.explicit ?
                                        <div className={episodesStyle['explicit']}
                                             style={{fontSize: '8px'}}>E</div> : ''}
                                    <span
                                        className={allResultsStyle['song-artists-box']}
                                    >{eachTrack.artists.slice(0, 4).map((artist, i) =>
                                        <a key={i}
                                           onClick={() => {
                                               dispatch(addReactComponentToNavigation({
                                                   componentName: 'Artist',
                                                   props: artist?.id
                                               }))
                                           }}
                                        >{i === eachTrack.artists.slice(0, 4).length - 1 ? artist.name : `${artist.name}, `}</a>)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className={allResultsStyle['song-duration-heart']}>

                                <div className={allResultsStyle['heart']}>
                                    {eachTrack.id === hoveringOver && <button
                                        onClick={async () => {
                                            if (currentSaved.includes(eachTrack.id)) {
                                                const req = (await removeTrackForCurrentUser(accessToken, String(eachTrack?.id))).status;
                                                if (req === 200) {
                                                    dispatch(addLibraryAction('Remove Track'))
                                                }

                                            } else {

                                                const req = (await saveTrackForCurrentUser(accessToken, String(eachTrack?.id))).status;
                                                if (req === 200) {
                                                    dispatch(addLibraryAction('Saved Track'))
                                                }
                                            }
                                        }}
                                        title={currentSaved.includes(eachTrack.id) ? "Remove from Your Library" : "Save to Your Library"}
                                    ><img alt={"Heart icon"} src={currentSaved.includes(eachTrack.id) ? SavedTrackIcon : Heart} width={20}
                                          height={28}></img>
                                    </button>}
                                </div>
                            <div
                                className={allResultsStyle['duration']}>{millisecondsToHhMmSs(Number(eachTrack?.duration_ms))}</div>
                        </div>
                    </div>
                )
            }
        </div>
    </div>
}

export default Songs;
