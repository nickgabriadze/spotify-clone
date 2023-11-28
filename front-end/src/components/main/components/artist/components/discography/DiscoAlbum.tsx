import {Album} from "../../../../../../types/album.ts";
import {Track} from "../../../../../../types/track.ts";
import {useEffect, useState} from "react";
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

export function DiscoAlbum({album}: { album: Album }) {
    const [albumTracks, setAlbumTracks] = useState<Track[]>([]);
    const accessToken = useAppSelector(s => s.spotiUserReducer.spotiToken.accessToken);
    const [tracksLoading, setTracksLoading] = useState<boolean>(true);
    const albumIsSaved = useAppSelector(s => s.spotiUserReducer.userSaved.userSavedAlbumIDs).includes(String(album.id))
    const dispatch = useAppDispatch();
    const currentlyPlaying = useAppSelector(s => s.navigationReducer.currentlyPlayingSong);
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

        fetchTracks()
    }, [accessToken, album.id]);

    if (tracksLoading) {
        return
    }

    return <section className={discographyStyle['disco-album-wrapper']}>
        <div className={discographyStyle['disco-album-info']}>
            <div className={discographyStyle['disco-album-image']}>
                <img src={album?.images[0]?.url} alt={"Album image"}></img>
            </div>
            <div className={discographyStyle['disco-meta']}>
                <div className={discographyStyle['disco-meta-heading']}>
                    <Link to={`/album/${album.id}`}><h1>{album.name}</h1></Link>
                    <p>{album.album_type[0].toUpperCase().concat(album.album_type.slice(1,))} • {new Date(album.release_date).getFullYear()} • {albumTracks.length} {albumTracks.length > 1 ? 'songs' : 'song'}</p>
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
            <div>{albumTracks.map((t, i) => <SongCard eachTrack={t} n={i + 1} accessToken={accessToken}
                                                      forAlbum={true}/>)}</div>
        </div>
    </section>
}