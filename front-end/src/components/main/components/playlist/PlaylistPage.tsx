import NoPlaylistImage from "../../../search/components/each-search-component/icons/no-playlist-pic.webp";
import playlistPageStyle from './playlistpage.module.css';
import {RefObject, useCallback, useEffect, useRef, useState} from "react";
import getPlaylist from "../../../../api/search/getPlaylist.ts";
import {FullPlayList, PlayListTrackObject} from "../../../../types/playlist.ts";
import {useAppDispatch, useAppSelector} from "../../../../store/hooks.ts";
import albumStyle from "../album/albumpage.module.css";
import PlayResumeStreaming from "../../../../api/player/playResumeStreaming.ts";
import {addLibraryAction, setUserControlActions} from "../../../../store/features/navigationSlice.ts";
import PauseStreaming from "../../../../api/player/pauseStreaming.ts";
import Pause from "../../../search/components/each-search-component/Playlists/icons/pause.svg";
import Play from "../../../search/components/each-search-component/Playlists/icons/play.svg";
import HeartSaved from "../../../player/icons/liked-indicator-heart.svg";
import Heart from "../../../player/icons/heart.svg";
import unfollowPlaylistForCurrentUser from "../../../../api/library/unfollowPlaylistForCurrentUser.ts";
import followPlaylistForCurrentUser from "../../../../api/library/followPlaylistForCurrentUser.ts";
import Duration from "../../../search/components/each-search-component/icons/duration.svg";
import {SongCard} from "../../../search/reuseables/songCard.tsx";
import SongCardSkeleton from "../../../../skeletons/songCardSkeleton.tsx";
import axiosInstance from "../../../../axios.ts";
import {checkInView} from "../../../utils/checkInView.ts";
import {setWhatsInView} from "../../../../store/features/spotiUserSlice.ts";


export function PlaylistPage({playlistID, mainRef}: { playlistID: string, mainRef: RefObject<HTMLDivElement> }) {
    const [playListData, setPlayListData] = useState<FullPlayList>();
    const accessToken = useAppSelector(s => s.spotiUserReducer.spotiToken.accessToken);
    const dispatch = useAppDispatch();
    const currentlyPlaying = useAppSelector(s => s.navigationReducer.currentlyPlayingSong);
    const playlistSaved = useAppSelector(s => s.spotiUserReducer.userSaved.userSavedPlaylistIDs).includes(playlistID)
    const [playlistLoading, setPlaylistLoading] = useState<boolean>(true);
    const [playlistTracks, setPlaylistTracks] = useState<{
        data: Array<PlayListTrackObject | typeof SongCardSkeleton>;
        next: string | null;
    }>({
        next: null,
        data: [],
    });

    const [tracksLoading, setTracksLoading] = useState<boolean>(true);
    const playBtnRef = useRef<HTMLDivElement>(null)
    const playlistPageRef = useRef<HTMLDivElement>(null)

    useEffect(() => {

        const duringScroll = () => {

            if (!checkInView(playBtnRef)) {
                dispatch(setWhatsInView({
                    pageName: 'Playlist',
                    pageItemName: String(playListData?.name),
                    uri: String(playListData?.uri)

                }))
            } else {
                dispatch(setWhatsInView({
                    pageName: 'None',
                    pageItemName: 'None',
                    uri: 'None'
                }))
            }

        }


        if (mainRef.current) {
            mainRef.current.addEventListener('scroll', duringScroll)
        }
        return () =>  mainRef.current?.removeEventListener('scroll', duringScroll)


    }, [playBtnRef.current, playlistPageRef.current, playlistID]);

    useEffect(() => {
        if (!currentlyPlaying.isPlaying && playListData?.id) {
            document.title = `${playListData?.name} by ${playListData?.owner.display_name}`
        }
    }, [currentlyPlaying.isPlaying, playListData?.id]);

    useEffect(() => {
        const getPlayListData = async () => {
            try {
                setPlaylistLoading(true)
                setTracksLoading(true)
                const pl: FullPlayList = (await getPlaylist(accessToken, playlistID)).data;
                setPlayListData(pl)
                setPlaylistTracks(prev => {
                    return {
                        ...prev,
                        data: pl?.tracks?.items,
                        next: pl?.tracks?.next
                    }
                })
            } catch (e) {

            } finally {
                setPlaylistLoading(false)
                setTracksLoading(false)
            }
        }

        getPlayListData();
    }, [accessToken, playlistID]);
    const observing = useRef<null | IntersectionObserver>(null);
    const lastSong = useCallback(
        (node: HTMLDivElement | null) => {

            const fetchTracks = async () => {
                try {

                    setPlaylistTracks((prev) => {
                        return {
                            ...prev,
                            data: [...prev.data, ...Array(30).fill(SongCardSkeleton)],
                            next: prev.next,
                        };
                    });
                    setTracksLoading(true);
                    const req = await axiosInstance.get(String(playlistTracks?.next), {headers: {Authorization: `Bearer ${accessToken}`}})

                    const data = req.data;
                    setPlaylistTracks((prev) => {
                        return {
                            ...prev,
                            data: [...prev.data.filter((e) => typeof e !== typeof SongCardSkeleton), ...data.items],
                            next: data.next,
                        };
                    });
                } catch (err) {

                } finally {
                    setTracksLoading(false);
                }
            };

            if (!node) return;
            if (tracksLoading) return;
            if (observing.current) observing.current?.disconnect();
            observing.current = new IntersectionObserver((e) => {
                if (e[0].isIntersecting && playlistTracks.next !== null) {

                    fetchTracks();
                }
            });
            observing.current?.observe(node);
        },
        [accessToken, playlistTracks.next, tracksLoading, playlistID]
    );

    if (playlistLoading) return <></>


    return <section className={playlistPageStyle['playlist-page-wrapper']}
                    ref={playlistPageRef}
    >
        <div className={playlistPageStyle['general-info-wrapper']}>
            {playListData?.images[0]?.url && <div className={playlistPageStyle['img-placement']}>
                <img title={playListData?.name} alt="Playlist image"
                     src={playListData?.images[0].url ? playListData?.images[0]?.url : NoPlaylistImage}></img>
            </div>}
            <div className={playlistPageStyle['pl-info']}>
                <p className={playlistPageStyle['pl-type']}>{playListData?.type[0].toUpperCase().concat(playListData?.type.slice(1,))}</p>
                <h1 className={playlistPageStyle['pl-name']}>{playListData?.name}</h1>
                {playListData?.description &&
                    <p className={playlistPageStyle['pl-desc']}>{playListData?.description.replace('&#x27;', "'")}</p>}
                <div className={playlistPageStyle['owner-likes-total-dur']}>
                    <p>{playListData?.owner?.display_name} • </p>
                    <p>{Number(playListData?.followers?.total)} likes • </p>
                    <p>{playListData?.tracks.total} {Number(playListData?.tracks?.total) > 1 ? 'songs' : 'song'}</p>

                </div>
            </div>
        </div>
        <div className={albumStyle['play-save']}>
            <div
                ref={playBtnRef}
            >
                <button

                    className={albumStyle["album-hover-button"]}
                    onClick={async () => {
                        if (currentlyPlaying?.context?.uri === playListData?.uri) {
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
                            await PlayResumeStreaming(accessToken, playListData?.uri);
                            dispatch(
                                setUserControlActions({
                                    userAction: "Play Playlist",
                                })
                            );
                        }
                    }}
                >{currentlyPlaying?.context?.uri === playListData?.uri &&
                currentlyPlaying.isPlaying ? (
                    <div>
                        <img

                            alt={"Pause icon"} src={Pause} width={40} height={40}></img>
                    </div>
                ) : (
                    <div>
                        <img alt={"Play icon"} src={Play} width={60} height={60}></img>
                    </div>
                )}

                </button>
            </div>
            <div className={albumStyle['heart']}>
                <nav>
                    <button
                        onClick={async () => {
                            if (playlistSaved) {
                                const req = await unfollowPlaylistForCurrentUser(accessToken, playlistID)
                                if (req.status === 200) {
                                    dispatch(addLibraryAction("User removed Playlist from Library"))
                                }
                            } else {
                                const req = await followPlaylistForCurrentUser(accessToken, playlistID)
                                if (req.status === 200) {
                                    dispatch(addLibraryAction("User added Playlist to Library"))
                                }
                            }
                        }}
                        title={playlistSaved ? "Remove from Your Library" : "Save to Your Library"}
                    ><img alt={"Heart icon"} src={playlistSaved ? HeartSaved : Heart} width={40}
                          height={45}></img></button>
                </nav>
            </div>
        </div>

        <nav className={playlistPageStyle['numbering-title-duration']}>
            <div className={playlistPageStyle['i-title']}>
                <div>#</div>
                <div>Title</div>

            </div>

            <div className={playlistPageStyle['i-album']}>Album</div>

            <div className={playlistPageStyle['date_added_at']}>Date Added</div>

            <div>
                <img
                    src={Duration}
                    draggable={false}
                    width={20}
                    height={20}
                    alt="Duration"
                    style={{marginBottom: "-5px"}}
                ></img>
            </div>
        </nav>


        <div>

            {playlistTracks.data.map((plTrack, i) => {
                if (typeof plTrack == typeof SongCardSkeleton) {
                    return <SongCardSkeleton forPlaylist={true} key={i}/>;
                } else {
                    return <SongCard
                        ref={i === playlistTracks.data.length - 1 ? lastSong : null}
                        playlistTrackAddedDate={typeof plTrack === "object" ? plTrack.added_at : undefined}
                        forPlaylist={true}
                        eachTrack={typeof plTrack === "object" ? plTrack.track : undefined} n={i + 1} key={i}
                        accessToken={accessToken}/>
                }
            })}

        </div>

    </section>
}

export default PlaylistPage;