import React, {useEffect, useState} from "react";
import {Playlist} from "../../../types/playlist";
import playlistsStyle from "../components/each-search-component/Playlists/playlists.module.css";
import NoPlaylistImage from "../components/each-search-component/icons/no-playlist-pic.webp";
import Play from "../components/each-search-component/Playlists/icons/play.svg";
import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import PlayResumeStreaming from "../../../api/player/playResumeStreaming";
import {setUserControlActions} from "../../../store/features/navigationSlice";
import getPlaylist from "../../../api/search/getPlaylist.ts";
import PlaylistCardSkeleton from "../../../skeletons/playlistCardSekeleton.tsx";
import PauseStreaming from "../../../api/player/pauseStreaming.ts";
import Pause from "../components/each-search-component/Playlists/icons/pause.svg";
import {Link, useLocation} from "react-router-dom";
import artistsStyle from "../components/each-search-component/Artists/artists.module.css";
import CloseIcon from "../../player/icons/close-icon.svg";
import useSearchHistory from "../../main/hooks/useSearchHistory.ts";
import useProperNavigationState from "../../utils/useProperNavigationState.ts";


export function PlaylistCardApi({playlistID, forSearchHistory, searchHistorySetter}: {
    playlistID: string,
    forSearchHistory?: boolean,
    searchHistorySetter?: React.Dispatch<React.SetStateAction<{ type: string, id: string }[]>>
}) {
    const [singlePlayList, setSinglePlaylist] = useState<Playlist | undefined>();
    const accessToken = useAppSelector(
        (state) => state.spotiUserReducer.spotiToken.accessToken
    );
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getSinglePlaylist = async () => {
            try {
                setLoading(true)
                const playlistData = (await getPlaylist(accessToken, playlistID)).data;
                setSinglePlaylist(playlistData)
            } catch (err) {
            } finally {
                setLoading(false)
            }
        }
        getSinglePlaylist()
    }, [accessToken, playlistID]);

    return loading ? <PlaylistCardSkeleton/> :
        <PlaylistCard forSearchHistory={forSearchHistory} searchHistorySetter={searchHistorySetter}
                      eachPlaylist={singlePlayList}/>
}

export function PlaylistCard({eachPlaylist, fromSearch, playlistDescription, forSearchHistory, searchHistorySetter}: {
    eachPlaylist: Playlist | undefined,
    playlistDescription?: boolean,
    fromSearch?: boolean,
    forSearchHistory?: boolean,
    searchHistorySetter?: React.Dispatch<React.SetStateAction<{ type: string, id: string }[]>>
}) {
    const loc = useLocation;
    const [hoveringOver, setHoveringOver] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const accessToken = useAppSelector(
        (state) => state.spotiUserReducer.spotiToken.accessToken
    );
    const currentlyPlaying = useAppSelector(s => s.navigationReducer.currentlyPlayingSong);

    return (
        <div
            className={playlistsStyle["playlist-card"]}
            onMouseOver={() => setHoveringOver(true)}
            onMouseOut={() => setHoveringOver(false)}
        >
            <Link to={`/playlist/${eachPlaylist?.id}`}
                      state={useProperNavigationState(loc, 'playlist', Boolean(fromSearch), String(eachPlaylist?.id))}>

                <div className={playlistsStyle["playlist-img"]}
                >
                    <img

                        alt={'Playlist image'}
                        src={
                            eachPlaylist?.images[0]?.url
                                ? eachPlaylist?.images[0]?.url
                                : NoPlaylistImage
                        }

                    ></img>

                    {hoveringOver && (
                        <button
                            onClick={async () => {
                                if (currentlyPlaying?.context?.uri === eachPlaylist?.uri) {
                                    if (!currentlyPlaying.isPlaying) {
                                        await PlayResumeStreaming(accessToken);
                                        dispatch(
                                            setUserControlActions({
                                                userAction: "Play Playlist",
                                            })
                                        );
                                    } else {
                                        await PauseStreaming(accessToken);
                                        dispatch(
                                            setUserControlActions({
                                                userAction: "Pause Playlist",
                                            })
                                        );
                                    }
                                } else {
                                    await PlayResumeStreaming(accessToken, eachPlaylist?.uri);
                                    dispatch(
                                        setUserControlActions({
                                            userAction: "Play Playlist",
                                        })
                                    );
                                }
                            }}
                            className={playlistsStyle["playlist-hover-button"]}
                        >
                            {currentlyPlaying?.context?.uri === eachPlaylist?.uri &&
                            currentlyPlaying.isPlaying ? (
                                <div>
                                    <img
                                        style={{padding: '7px'}}
                                        alt={"Pause icon"} src={Pause} width={40} height={40}></img>
                                </div>
                            ) : (
                                <div>

                                    <img alt={"Play icon"} src={Play} width={200} height={200}></img>
                                </div>
                            )}
                        </button>
                    )}
                </div>
            </Link>

            <Link to={`/playlist/${eachPlaylist?.id}`}
                      state={useProperNavigationState(loc, 'playlist', Boolean(fromSearch), String(eachPlaylist?.id))}>

                <div className={playlistsStyle["playlist-details"]}>
                    <h1
                    >
                        {Number(eachPlaylist?.name?.length) > 15
                            ? eachPlaylist?.name.slice(0, 16).concat("...")
                            : eachPlaylist?.name}
                    </h1>
                    {!playlistDescription ? <p
                        >
                            By{" "}
                            {Number(eachPlaylist?.owner?.display_name?.length) > 15
                                ? eachPlaylist?.owner.display_name.slice(0, 16).concat("...")
                                : eachPlaylist?.owner.display_name}
                        </p> :
                        <p>{String(eachPlaylist?.description).includes('<a') ? `By ${eachPlaylist?.owner.display_name}` :
                            Number(eachPlaylist?.description.length) > 15 ? eachPlaylist?.description.slice(0, 20).concat("...")
                                : eachPlaylist?.description.toString()}</p>}
                </div>
            </Link>

            {forSearchHistory && <div className={artistsStyle['close-search-history-item']}
                                      onClick={() => {
                                          searchHistorySetter && searchHistorySetter((prev) => [...prev.filter(e => e.id !== eachPlaylist?.id)])
                                          useSearchHistory({type: 'playlist', id: String(eachPlaylist?.id)}, "REMOVE")
                                      }}
            >
                <img alt={"Close icon"} src={CloseIcon} width={35} height={35}></img>
            </div>}

        </div>
    );
}

export default PlaylistCard;
