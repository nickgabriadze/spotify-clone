import albumStyle from "./albumpage.module.css";
import {SimplifiedTrack} from "../../../../types/track.ts";
import {AlbumWithTracks} from "../../../../types/album.ts";
import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../../store/hooks.ts";
import getAlbum from "../../../../api/search/getAlbum.ts";
import getAlbumTracks from "../../../../api/home/album/getAlbumTracks.ts";
import millisecondsToHhMmSs from "../../../player/msConverter.ts";
import PlayResumeStreaming from "../../../../api/player/playResumeStreaming.ts";
import {addLibraryAction, setUserControlActions} from "../../../../store/features/navigationSlice.ts";
import PauseStreaming from "../../../../api/player/pauseStreaming.ts";
import Pause from "../../../search/components/each-search-component/Playlists/icons/pause.svg";
import Play from "../../../search/components/each-search-component/Playlists/icons/play.svg";
import Heart from '../../../player/icons/heart.svg';
import HeartSaved from '../../../player/icons/liked-indicator-heart.svg';
import removeAlbumForCurrentUser from "../../../../api/library/removeAlbumForCurrentUser.ts";
import saveAlbumForCurrentUser from "../../../../api/library/saveAlbumForCurrentUser.ts";

export function AlbumPage({albumID}: { albumID: string }) {
    const [albumData, setAlbumData] = useState<{ album: AlbumWithTracks, albumTracks: SimplifiedTrack[] }>();
    const accessToken = useAppSelector(state => state.spotiUserReducer.spotiToken.accessToken);
    const [dataLoading, setDataLoading] = useState<boolean>(true);
    const currentlyPlaying = useAppSelector(s => s.navigationReducer.currentlyPlayingSong)
    const dispatch = useAppDispatch();
    const albumIsSaved = useAppSelector(s => s.spotiUserReducer.userSaved.userSavedAlbumIDs).includes(albumID)

    useEffect(() => {
        const getAlbumInformation = async () => {
            try {
                setDataLoading(true)
                const album = (await getAlbum(accessToken, albumID)).data;
                const tracks: SimplifiedTrack[] = (await getAlbumTracks(accessToken, albumID)).data.items;

                setAlbumData({
                    album: album,
                    albumTracks: tracks
                })
            } catch (err) {

            } finally {
                setDataLoading(false)
            }
        }

        getAlbumInformation()
    }, [accessToken]);


    if (!dataLoading) {

        return <section className={albumStyle['album-page-wrapper']}

        >
            <div className={albumStyle['album-main-info']}
            >
                <div className={albumStyle['album-picture']}>
                    <img alt="Album Image" draggable={false} src={albumData?.album.images[0]?.url}
                         width={albumData?.album.images[0]?.width}></img>
                </div>
                <div className={albumStyle['album-general-information']}>
                    <div>
                        <p>{albumData?.album.album_type.slice(0, 1).toUpperCase().concat(albumData?.album.album_type.slice(1,))}</p>
                        <h1>{Number(albumData?.album.name.length) < 20 ? albumData?.album.name : albumData?.album.name.slice(0, 20).concat("...")}</h1>
                    </div>
                    <div className={albumStyle['artist-information']}>
                        <h4 className={albumStyle['artist-name-ry-nos']}>{albumData?.album.artists[0].name} • {new Date(String(albumData?.album.release_date)).getFullYear()} • {albumData?.album.total_tracks} song, </h4>
                        <p className={albumStyle['album-duration']}>{millisecondsToHhMmSs(Number(albumData?.album.tracks.items.map(e => e.duration_ms).reduce((a, b) => a + b, 0)), true)}</p>
                    </div>
                </div>
            </div>

            <div className={albumStyle['play-track-list']}>
                <div className={albumStyle['play-save']}>
                    <div>
                        <button

                            className={albumStyle["album-hover-button"]}
                            onClick={async () => {
                                if (currentlyPlaying.albumID === albumID) {
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
                                    await PlayResumeStreaming(accessToken, albumData?.album?.uri);
                                    dispatch(
                                        setUserControlActions({
                                            userAction: "Play Album",
                                        })
                                    );
                                }
                            }}
                        >
                            {currentlyPlaying.albumID === albumID &&
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
                                    if(albumIsSaved){
                                       const req = await removeAlbumForCurrentUser(accessToken, albumID)
                                        if(req.status === 200){
                                         dispatch(addLibraryAction("User removed Album from Library"))
                                        }
                                    }else{
                                        const req = await saveAlbumForCurrentUser(accessToken, albumID)
                                        if(req.status === 200){
                                         dispatch(addLibraryAction("User added Album to Library"))
                                        }
                                    }
                                }}
                              title={albumIsSaved ? "Remove from Your Library" : "Save to Your Library"}
                            ><img alt={"Heart icon"} src={albumIsSaved ? HeartSaved : Heart} width={40}
                                  height={45}></img></button>
                        </nav>
                    </div>
                </div>
            </div>
        </section>
    }
}

export default AlbumPage;