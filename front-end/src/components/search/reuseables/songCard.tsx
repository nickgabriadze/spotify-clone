import {Track} from "../../../types/track";
import songsStyle from "../components/each-search-component/Songs/songs.module.css";
import {forwardRef, useState, useEffect, Ref} from "react";
import Equaliser from "../../player/icons/device-picker-equaliser.webp"
import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import PlayResumeStreaming from "../../../api/player/playResumeStreaming";
import {
    addLibraryAction,
    setUserControlActions
} from "../../../store/features/navigationSlice";
import Play from "../components/each-search-component/Songs/icons/play.svg"
import episodesStyle from "../components/each-search-component/PodcastsShows/podcastsShows.module.css";
import NoTrackPicture from "../components/each-search-component/icons/no-track-pic.svg"
import Pause from "../components/each-search-component/All/icons/pause.svg";
import PauseStreaming from "../../../api/player/pauseStreaming.ts";
import millisecondsToHhMmSs from "../../player/msConverter.ts";
import removeTrackForCurrentUser from "../../../api/library/removeTrackForCurrentUser.ts";
import saveTrackForCurrentUser from "../../../api/library/saveTrackForCurrentUser.ts";
import SavedTrackIcon from "../../player/icons/liked-indicator-heart.svg";
import Heart from "../../player/icons/heart.svg";
import {PlayListTrackObject} from "../../../types/playlist.ts";
import {Link, useLocation} from "react-router-dom";
import useProperNavigationState from "../../utils/useProperNavigationState.ts";

export const SongCard = forwardRef(function SongCard(props: {
    eachTrack: Track | PlayListTrackObject | undefined,
    n: number,
    accessToken: string,
    forAlbum?: boolean,
    forArtist?: boolean,
    playlistTrackAddedDate?: String,
    forPlaylist?: boolean
}, ref: Ref<HTMLDivElement>) {
    const [currentSaved, setCurrentSaved] = useState<boolean>(false)
    const savedSongs = useAppSelector((state) => state.spotiUserReducer.userSaved.userSavedSongIDs);
    const loc = useLocation();
    const currentlyPlaying = useAppSelector(s => s.navigationReducer.currentlyPlayingSong)
    const {n, eachTrack, accessToken, forAlbum, forPlaylist, playlistTrackAddedDate, forArtist} = props;
    const songID = useAppSelector((state) => state.navigationReducer.currentlyPlayingSong.songID);
    const dispatch = useAppDispatch();
    const [addedAtDate, setAddedAtDate] = useState<string>('');

    const [hoveringOver, setHoveringOver] = useState<boolean>(false)
    useEffect(() => {
        setCurrentSaved(
            savedSongs.includes(String(eachTrack?.id))
        )

    }, [savedSongs.length, String(eachTrack?.id)]);


    useEffect(() => {
        if (forPlaylist && playlistTrackAddedDate) {
            const addedAt = new Date(String(playlistTrackAddedDate))
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            const releaseDate = months[Number(addedAt.getMonth())].concat(" ").concat(String(addedAt.getDate()).concat(", ").concat(String(addedAt.getFullYear())))
            setAddedAtDate(releaseDate)
        }
    }, [eachTrack?.id]);

    return (
        <div className={songsStyle["track-wrapper"]}

             style={
                 forPlaylist ?
                     {
                         display: 'flex',
                         justifyContent: 'space-between',
                         alignItems: 'center'
                     } : {
                         display: 'flex',
                         justifyContent: 'space-between',
                         alignItems: 'center'
                     }
             }
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
            <div className={songsStyle["general-info"]}
                 style={{width: forAlbum ? '80%' : '50%'}}
            >


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
                <div className={songsStyle["img-title-artists"]}

                     style={{

                         marginLeft: forAlbum ? '10px' : '5%'
                     }}
                >
                    {!forAlbum && <div className={songsStyle["album-img"]}>
                        {eachTrack?.album?.images[0]?.url ? <img
                                src={eachTrack?.album.images[0]?.url}

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
                             width: forAlbum ? '100%' : '80%',
                             gap: forArtist ? '0px' : '10px',

                         }}
                    >
                        {!forAlbum ? <Link to={`/album/${eachTrack?.album?.id}`}
                                           state={useProperNavigationState(loc, 'album', false, String(eachTrack?.album?.id))}

                                           className={songsStyle['track-name']}

                                           style={

                                               {
                                                   color: `${eachTrack?.id === songID ? '#1ed760' : 'white'}`,
                                                   paddingBottom: forArtist && eachTrack?.explicit ? '10px' : '0px'
                                               }}>{eachTrack?.name}</Link>
                            : <a
                                className={songsStyle['track-name']}
                                style={

                                    {
                                        color: `${eachTrack?.id === songID ? '#1ed760' : 'white'}`,
                                        paddingBottom: forArtist && eachTrack?.explicit ? '10px' : '0px'
                                    }}>{eachTrack?.name}</a>
                        }
                        <div
                            className={songsStyle['artists-mapped']}

                        >
                            {eachTrack?.explicit ?
                                <div className={episodesStyle['explicit']}
                                     style={{fontSize: '8px', width: 'fit-content'}}>E</div> : ''}
                            {(forArtist === false || forAlbum == true || forPlaylist == true) &&
                                <div className={songsStyle['artists-box']}
                                     style={{width: `${forAlbum ? '55vw' : '25vw'}`}}
                                >{eachTrack?.artists.map((artist, i) =>
                                    <Link to={`/artist/${artist?.id}`} key={i}
                                          state={useProperNavigationState(loc, 'artist', false, String(artist?.id))}

                                    >{i === eachTrack.artists.slice(0, 4).length - 1 ? artist.name : `${artist.name}, `}</Link>)}</div>
                            }
                        </div>
                    </div>
                </div>
            </div>

            {
                !forAlbum && <div className={songsStyle["album-title"]}
                >
                    <a>{eachTrack?.album?.name}</a>
                </div>
            }

            <div
                className={songsStyle[`${forPlaylist ? 'date-added-duration-wrapper' : 'normal'}`]}
                style={forPlaylist === false && forAlbum === false && forArtist === false ? {width: '7vw'} : {}}
            >

                {forPlaylist && <div className={songsStyle['playlist-track-added_at']}>
                    <p>{addedAtDate}</p>

                </div>}

                <div className={songsStyle['song-duration-heart']}>
                    <div>
                        <div className={songsStyle['heart-space']}>
                            {hoveringOver && <button
                                onClick={async () => {
                                    if (currentSaved) {
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
                                title={currentSaved ? "Remove from Your Library" : "Save to Your Library"}
                            ><img alt={"Heart icon"} src={currentSaved ? SavedTrackIcon : Heart} width={20}
                                  height={30}></img>
                            </button>}
                        </div>
                        <div
                            className={songsStyle['duration']}>{millisecondsToHhMmSs(Number(eachTrack?.duration_ms))}</div>
                    </div>
                </div>
            </div>
        </div>
    )
        ;
})

