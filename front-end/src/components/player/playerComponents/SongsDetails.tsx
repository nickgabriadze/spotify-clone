import {CurrentlyPlaying} from "../../../types/currentlyPlaying"
import playerStyle from "../player.module.css"
import Heart from "../icons/heart.svg";
import {useEffect, useRef, useState} from "react";
import './animation.css';
import SavedTrackIcon from "../icons/liked-indicator-heart.svg"
import {useAppSelector} from "../../../store/hooks.ts";
import {
    addLibraryAction, setNavigationHistory,
} from "../../../store/features/navigationSlice.ts";
import {useDispatch} from "react-redux";
import removeTrackForCurrentUser from "../../../api/library/removeTrackForCurrentUser.ts";
import {saveTrackForCurrentUser} from "../../../api/library/saveTrackForCurrentUser.ts";
import {Link, useLocation} from "react-router-dom";
import useProperNavigationState from "../../utils/useProperNavigationState.ts";

export function SongDetails({currentlyPlaying}: { currentlyPlaying: CurrentlyPlaying | undefined }) {

    const accessToken = useAppSelector(s => s.spotiUserReducer.spotiToken.accessToken);
    const [, setSongNameHover] = useState(false)
    const [, setArtistNameHover] = useState(false)
    const songNameRef = useRef<HTMLAnchorElement>(null)
    const artistNameRef = useRef<HTMLDivElement>(null)
    const savedSongs = useAppSelector((state) => state.spotiUserReducer.userSaved.userSavedSongIDs);
    const [currentSaved, setCurrentSaved] = useState<boolean>(false)
    const loc = useLocation();
    useEffect(() => {
        setCurrentSaved(
            savedSongs.includes(String((currentlyPlaying?.item?.id)))
        )

    }, [savedSongs.length, currentlyPlaying?.item?.id]);


    const dispatch = useDispatch();
    return (<div className={playerStyle["currently-playing-info"]}>
        <Link to={`/album/${currentlyPlaying?.item?.album?.id}`}
              onClick={() => {
                  dispatch(setNavigationHistory(useProperNavigationState(loc, 'album', false, String(currentlyPlaying?.item?.album.id)).previousPaths))
              }}
              state={useProperNavigationState(loc, 'album', false, String(currentlyPlaying?.item?.album?.id))}

              className={playerStyle["currently-playing-info-album-img"]}
        >
            {currentlyPlaying?.item?.album?.images[0]?.url ? <img
                    alt="Album picture"
                    draggable={false}
                    src={currentlyPlaying?.item?.album?.images[0]?.url}

                ></img> :
                <div className={playerStyle["currently-playing-info-album-img-skeleton"]}></div>
            }
        </Link>
        <div className={playerStyle["song-info"]}

        >
            <div className={playerStyle['song-info-box-without-heart']}

            >
                <div
                    className={playerStyle['song-name-artists-details']}>
                    <div className={playerStyle['song-name-box']}
                         onMouseOver={() => setSongNameHover(true)}
                         onMouseOut={() => setSongNameHover(false)}
                    >
                        {currentlyPlaying?.item?.name ? <Link to={`/album/${currentlyPlaying?.item?.album?.id}`}
                                                              className={playerStyle["song-name"]}
                                                              onClick={() => {
                                                                  dispatch(setNavigationHistory(useProperNavigationState(loc, 'album', false, String(currentlyPlaying?.item?.album.id)).previousPaths))
                                                              }}
                                                              state={useProperNavigationState(loc, 'album', false, String(currentlyPlaying?.item?.album?.id))}
                                                              ref={songNameRef}
                            >{currentlyPlaying?.item?.name}</Link> :
                            <div className={playerStyle['song-name-skeleton']}>

                            </div>
                        }
                    </div>
                    <div className={playerStyle['song-name-box']}
                         onMouseOver={() => setArtistNameHover(true)}
                         onMouseOut={() => setArtistNameHover(false)}
                    >
                        {Number(currentlyPlaying?.item?.artists.length) > 0 ?
                            <div ref={artistNameRef}

                            >
                                {currentlyPlaying?.item?.artists.map((each, i) => (
                                    <Link to={`/artist/${each?.id}`} key={each.id}
                                          className={playerStyle["artists-name"]}
                                          onClick={() => {
                                              dispatch(setNavigationHistory(useProperNavigationState(loc, 'artist', false, each?.id).previousPaths))
                                          }}
                                          state={useProperNavigationState(loc, 'artist', false, String(each.id))}

                                    >
                                        {each.name}
                                        {i === currentlyPlaying.item.artists.length - 1 ? "" : ", "}
                                    </Link>
                                ))}
                            </div> :

                            <div className={playerStyle['artists-name-skeleton']}></div>
                        }

                    </div>

                </div>

            </div>
            <div>
                {currentlyPlaying?.item?.name &&
                    <button
                        onClick={async () => {
                            if (currentSaved) {
                                const req = (await removeTrackForCurrentUser(accessToken, currentlyPlaying?.item?.id)).status;
                                if (req === 200) {
                                    dispatch(addLibraryAction('Remove Track'))
                                }

                            } else {

                                const req = (await saveTrackForCurrentUser(accessToken, currentlyPlaying?.item?.id)).status;
                                if (req === 200) {
                                    dispatch(addLibraryAction('Saved Track'))
                                }
                            }
                        }}
                        title={currentSaved ? "Remove from Your Library" : "Save to Your Library"}
                    >
                        <img
                            style={{cursor: 'pointer'}}
                            src={currentSaved ? SavedTrackIcon : Heart} width={20} height={18} alt="heart icon"></img>
                    </button>}
            </div>
        </div>
    </div>)

}

export default SongDetails