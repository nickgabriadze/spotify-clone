import {Album} from "../../../../../../types/album.ts";
import {Track} from "../../../../../../types/track.ts";
import {useEffect, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../../../../store/hooks.ts";
import getAlbumTracks from "../../../../../../api/main/album/getAlbumTracks.ts";
import {SongCard} from "../../../../../search/reuseables/songCard.tsx";
import discographyStyle from './discography.module.css';
import {Link} from "react-router-dom";
import PlayButtonIcon from "./../../../../../player/icons/play.svg"
import PauseButtonIcon from "./../../../../../player/icons/pause.svg"
import HeartIcon from "./../../../../../player/icons/heart.svg"
import HeartFilledIcon from './../../../../../player/icons/liked-indicator-heart.svg'
import Duration from "../../../../../search/components/each-search-component/icons/duration.svg";
import removeAlbumForCurrentUser from "../../../../../../api/library/removeAlbumForCurrentUser.ts";
import {addLibraryAction, setUserControlActions} from "../../../../../../store/features/navigationSlice.ts";
import saveAlbumForCurrentUser from "../../../../../../api/library/saveAlbumForCurrentUser.ts";
import PlayResumeStreaming from "../../../../../../api/player/playResumeStreaming.ts";
import PauseStreaming from "../../../../../../api/player/pauseStreaming.ts";
import {setWhatsInView} from "../../../../../../store/features/spotiUserSlice.ts";
import SongCardSkeleton from "../../../../../../skeletons/songCardSkeleton.tsx";

export const DiscoAlbum = ({album, index}: { album: Album, index: number }) => {
    const [albumTracks, setAlbumTracks] = useState<Track[]>([]);
    const accessToken = useAppSelector(s => s.spotiUserReducer.spotiToken.accessToken);
    const [tracksLoading, setTracksLoading] = useState<boolean>(true);
    const albumIsSaved = useAppSelector(s => s.spotiUserReducer.userSaved.userSavedAlbumIDs).includes(String(album.id))
    const dispatch = useAppDispatch();
    const currentlyPlaying = useAppSelector(s => s.navigationReducer.currentlyPlayingSong);
    const albumRef = useRef<HTMLAnchorElement>(null);
    const [fetchTracksCommand, setFetchTracksCommand] = useState<boolean>(false);
    useEffect(() => {
        const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
            entries.forEach((e) => {
                if (e.isIntersecting && !fetchTracksCommand) {
                    setFetchTracksCommand(true)
                }

                if (e.isIntersecting && Number(albumRef?.current?.offsetTop) < 200) {
                    dispatch(setWhatsInView({
                        pageName: 'None',
                        pageItemName: 'None',
                        uri: 'None'
                    }))
                }

                if (!(albumRef?.current)) {
                    dispatch(setWhatsInView({
                        pageName: 'None',
                        pageItemName: 'None',
                        uri: 'None'
                    }))
                } else if (index === 0 && e.isIntersecting && !fetchTracksCommand) {
                    dispatch(setWhatsInView({
                        pageName: 'None',
                        pageItemName: 'None',
                        uri: 'None'
                    }))
                } else {
                    if (!e.isIntersecting && !tracksLoading) {
                        dispatch(setWhatsInView({
                            pageName: 'Discography',
                            pageItemName: album.name,
                            uri: album.uri
                        }))
                    }
                }
            });
        }, {threshold: 1});

        if (albumRef.current) {
            observer.observe(albumRef.current);
        }

        return () => {
            if (albumRef.current) {
                observer.unobserve(albumRef.current);
                dispatch(setWhatsInView({
                    pageName: 'None',
                    pageItemName: 'None',
                    uri: 'None'
                }))
            }
        };
    }, [album.id, albumRef.current, fetchTracksCommand, tracksLoading]);
    useEffect(() => {
        const fetchTracks = async () => {
            try {
                setTracksLoading(true)
                const tracks = (await getAlbumTracks(accessToken, album?.id)).data.items;
                setAlbumTracks(tracks)
            } catch (_) {
            } finally {
                setTracksLoading(false)

            }
        }

        if (fetchTracksCommand) {
            fetchTracks()
        }

        return () => {
            dispatch(setWhatsInView({
                pageName: 'None',
                pageItemName: 'None',
                uri: 'None'
            }))
        }
    }, [accessToken, album.id, fetchTracksCommand]);


    return <section className={discographyStyle['disco-album-wrapper']}

    >
        <div className={discographyStyle['disco-album-info']}>
            <div className={discographyStyle['disco-album-image']}>
                <img src={album?.images[0]?.url} alt={"Album image"}></img>
            </div>
            <div className={discographyStyle['disco-meta']}>
                <div className={discographyStyle['disco-meta-heading']}>
                    <Link to={`/album/${album.id}`} ref={albumRef} placeholder={album.name}>{album.name}</Link>
                    <p>{album.album_type[0].toUpperCase().concat(album.album_type.slice(1,))} • {new Date(album.release_date).getFullYear()} • {albumTracks.length > 0 ? albumTracks.length : ''} {albumTracks.length > 1 ? 'songs' : 'song'}</p>
                </div>

                <div className={discographyStyle['disco-meta-buttons']}>
                    <button onClick={async () => {
                        if (String(currentlyPlaying?.context?.uri) === album.uri) {
                            if (!currentlyPlaying.isPlaying) {
                                await PlayResumeStreaming(accessToken);
                                dispatch(
                                    setUserControlActions({
                                        userAction: "Play Album",
                                    })
                                );
                            } else {
                                await PauseStreaming(accessToken);
                                dispatch(
                                    setUserControlActions({
                                        userAction: "Pause Album",
                                    })
                                );
                            }
                        } else {
                            await PlayResumeStreaming(accessToken, album?.uri);
                            dispatch(
                                setUserControlActions({
                                    userAction: "Play Album",
                                })
                            );
                        }
                    }}>{String(currentlyPlaying.context?.uri) === album.uri &&
                    currentlyPlaying.isPlaying ? (
                        <div>
                            <img

                                alt={"Pause icon"} src={PauseButtonIcon} width={38} height={38}></img>
                        </div>
                    ) : (
                        <div>
                            <img alt={"Play icon"} src={PlayButtonIcon} width={38} height={38}></img>
                        </div>
                    )}</button>
                    <button
                        onClick={async () => {
                            if (albumIsSaved) {
                                const req = await removeAlbumForCurrentUser(accessToken, String(album.id))
                                if (req.status === 200) {
                                    dispatch(addLibraryAction("User removed Album from Library"))
                                }
                            } else {
                                const req = await saveAlbumForCurrentUser(accessToken, String(album.id))
                                if (req.status === 200) {
                                    dispatch(addLibraryAction("User added Album to Library"))
                                }
                            }
                        }}
                        title={albumIsSaved ? "Remove from Your Library" : "Save to Your Library"}
                    ><img alt={"Save icon"} src={albumIsSaved ? HeartFilledIcon : HeartIcon} width={28}
                          height={28}></img></button>
                </div>
            </div>
        </div>
        <div className={discographyStyle['disco-tracks-wrapper']}>
            <nav className={discographyStyle['numbering-title-duration']}>
                <div className={discographyStyle['i-title']}>
                    <p>#</p>
                    <p>Title</p>

                </div>

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
            <div>{albumTracks.length === 0 ? Array.from({length: 10}).map((_, i) => <SongCardSkeleton
                key={i}/>) : albumTracks.map((t, i) => <SongCard eachTrack={t} n={i + 1} key={i}
                                                                 accessToken={accessToken}
                                                                 forAlbum={true}/>
            )}</div>
        </div>
    </section>
}

