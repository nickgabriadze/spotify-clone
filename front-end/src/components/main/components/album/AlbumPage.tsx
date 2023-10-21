import albumStyle from "./albumpage.module.css";
import {Track} from "../../../../types/track.ts";
import {Album, AlbumWithTracks} from "../../../../types/album.ts";
import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../../store/hooks.ts";
import getAlbum from "../../../../api/search/getAlbum.ts";
import getAlbumTracks from "../../../../api/home/album/getAlbumTracks.ts";
import millisecondsToHhMmSs from "../../../player/msConverter.ts";
import PlayResumeStreaming from "../../../../api/player/playResumeStreaming.ts";
import {
    addLibraryAction,
    setUserControlActions
} from "../../../../store/features/navigationSlice.ts";
import PauseStreaming from "../../../../api/player/pauseStreaming.ts";
import Pause from "../../../search/components/each-search-component/Playlists/icons/pause.svg";
import Play from "../../../search/components/each-search-component/Playlists/icons/play.svg";
import Heart from '../../../player/icons/heart.svg';
import HeartSaved from '../../../player/icons/liked-indicator-heart.svg';
import removeAlbumForCurrentUser from "../../../../api/library/removeAlbumForCurrentUser.ts";
import saveAlbumForCurrentUser from "../../../../api/library/saveAlbumForCurrentUser.ts";
import Duration from "../../../search/components/each-search-component/icons/duration.svg";
import {SongCard} from "../../../search/reuseables/songCard.tsx";
import getArtistAlbums from "../../../../api/home/album/getArtistAlbums.ts";
import AlbumCard from "../../../search/reuseables/albumCard.tsx";

export function AlbumPage({albumID}: { albumID: string }) {
    const [albumData, setAlbumData] = useState<{ album: AlbumWithTracks, albumTracks: Track[] }>();
    const accessToken = useAppSelector(state => state.spotiUserReducer.spotiToken.accessToken);
    const [dataLoading, setDataLoading] = useState<boolean>(true);
    const currentlyPlaying = useAppSelector(s => s.navigationReducer.currentlyPlayingSong)
    const dispatch = useAppDispatch();
    const albumIsSaved = useAppSelector(s => s.spotiUserReducer.userSaved.userSavedAlbumIDs).includes(albumID)
    const [artistAlbums, setArtistAlbums] = useState<Album[]>([]);
    const [onFullScreen, setOnFullScreen] = useState<boolean>(false);


    useEffect(() => {
        const getOtherAlbums = async () => {
            try {

                const artistAlbums = (await getArtistAlbums(accessToken, String(albumData?.album.artists[0].id))).data;
                setArtistAlbums(artistAlbums.items)
            } catch (err) {

            }
        }

        if (albumData?.album.artists[0].id) {
            getOtherAlbums();
        }
    }, [accessToken, String(albumData?.album.artists[0].id), albumID]);

    useEffect(() => {

        const getAlbumInformation = async () => {
            try {
                setDataLoading(true)
                const album = (await getAlbum(accessToken, albumID)).data;
                const tracks: Track[] = (await getAlbumTracks(accessToken, albumID)).data.items;
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
    }, [accessToken, albumID]);

    if (!dataLoading && albumData?.albumTracks.length !== 0) {
        const albumDate = new Date(String(albumData?.album.release_date))
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        const releaseDate = months[albumDate.getMonth()].concat(" ").concat(String(albumDate.getDate()).concat(", ").concat(String(albumDate.getFullYear())))
        return <section className={albumStyle['album-page-wrapper']}

        >
            <div className={albumStyle['album-main-info']}
            >
                {onFullScreen && <div

                    style={{
                             position: 'absolute',
                             width: '100%',
                             height: '100%',
                             display: 'flex',
                             justifyContent: 'center',
                             alignItems: 'center',
                             top: '50%',
                             left: '50%',
                             translate: "-50% -50%",
                             zIndex: 999,

                             backdropFilter: 'brightness(20%)'
                         }}
                >
                    <img alt="Album Image"

                         onClick={() => setOnFullScreen(false)}
                         style={{ borderRadius: '10px',width: '70vh', height: '70vh', cursor: 'pointer'}}
                         draggable={false} src={albumData?.album.images[0]?.url}
                         width={albumData?.album.images[0]?.width}></img>

                </div>}
                <div className={albumStyle['album-picture']}
                      onBlur={() => {
                        setOnFullScreen(false);
                    }}
                    tabIndex={-1}
                     onClick={() => {
                         setOnFullScreen(true);
                     }}

                >
                    <img alt="Album Image"
                         style={{borderRadius: onFullScreen ? '10px' : ''}}
                         draggable={false} src={albumData?.album.images[0]?.url}
                         width={albumData?.album.images[0]?.width}></img>
                </div>
                <div className={albumStyle['album-general-information']}>
                    <div>
                        <p>{albumData?.album.album_type.slice(0, 1).toUpperCase().concat(albumData?.album.album_type.slice(1,))}</p>
                        <h1>{albumData?.album.name}</h1>
                    </div>
                    <div className={albumStyle['artist-information']}>
                        <h4 className={albumStyle['artist-name-ry-nos']}>{albumData?.album.artists[0].name} • {albumDate.getFullYear()} • {albumData?.album.total_tracks} song, </h4>
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
                                    if (albumIsSaved) {
                                        const req = await removeAlbumForCurrentUser(accessToken, albumID)
                                        if (req.status === 200) {
                                            dispatch(addLibraryAction("User removed Album from Library"))
                                        }
                                    } else {
                                        const req = await saveAlbumForCurrentUser(accessToken, albumID)
                                        if (req.status === 200) {
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
                <div className={albumStyle['track-list-box']}>
                    <nav className={albumStyle['numbering-title-duration']}>
                        <div className={albumStyle['i-title']}>
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
                    <div className={albumStyle['track-box']}>
                        {albumData?.albumTracks.map((eachTrack, i) => <SongCard eachTrack={eachTrack}
                                                                                key={i} n={i + 1}
                                                                                accessToken={accessToken}
                                                                                forAlbum={true}/>)}
                    </div>
                </div>
            </div>
            <div className={albumStyle['exact-date-copyright']}>
                <p>
                    {releaseDate}
                </p>
                {albumData?.album.copyrights.map((c, i) =>
                    <p key={i}>{c.text}</p>
                )}
            </div>

            <div className={albumStyle['more-from-artist']}>
                <h2>More by {albumData?.album.artists[0].name}</h2>
                <div className={albumStyle['displayed-albums']}>
                    {artistAlbums.map((eachAlbum) => <AlbumCard eachAlbum={eachAlbum} key={eachAlbum.id}/>)}
                </div>
            </div>
        </section>
    }
}

export default AlbumPage;