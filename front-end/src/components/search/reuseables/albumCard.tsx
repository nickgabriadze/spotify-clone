import {useEffect, useState} from "react";
import {Album} from "../../../types/album";
import albumsStyle from "../components/each-search-component/Albums/albums.module.css";
import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import Play from "../components/each-search-component/Playlists/icons/play.svg";
import PlayResumeStreaming from "../../../api/player/playResumeStreaming";
import {setUserControlActions} from "../../../store/features/navigationSlice";
import Pause from "../components/each-search-component/Playlists/icons/pause.svg";
import PauseStreaming from "../../../api/player/pauseStreaming";
import NoAlbumPicture from "../components/each-search-component/icons/no-album-pic.svg"
import getAlbum from "../../../api/search/getAlbum.ts";
import AlbumCardSkeleton from "../../../skeletons/albumCardSkeleton.tsx";
import {Link} from "react-router-dom";


export function AlbumCardApi({albumID}: { albumID: string }) {
    const [singleAlbum, setSingleAlbum] = useState<Album | undefined>();
    const accessToken = useAppSelector((state) => state.spotiUserReducer.spotiToken.accessToken);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getSingleAlbum = async () => {
            try {
                setLoading(true)
                const reqAlbum = await getAlbum(accessToken, albumID);
                const albumData = reqAlbum.data;
                setSingleAlbum(albumData)
            } catch (err) {
            } finally {
                setLoading(false)
            }
        }

        getSingleAlbum();
    }, [accessToken, albumID]);

    return loading ? <AlbumCardSkeleton/> : <AlbumCard eachAlbum={singleAlbum}/>

}


export function AlbumCard({eachAlbum, fromSearch}: { eachAlbum: Album | undefined, fromSearch?: boolean }) {
    const [hoveringOver, setHoveringOver] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const accessToken = useAppSelector((state) => state.spotiUserReducer.spotiToken.accessToken);
    const currentlyPlaying = useAppSelector((state) => state.navigationReducer.currentlyPlayingSong);

    return (
        <div className={albumsStyle["album-card"]}

             onMouseOver={() => setHoveringOver(true)}
             onMouseOut={() => setHoveringOver(false)}>
            <div className={albumsStyle['album-inner-content']}>
                <Link to={`/album/${eachAlbum?.id}`} state={fromSearch ? {type: 'album', id: eachAlbum?.id} : null}

                >
                    <div className={albumsStyle["album-img"]}

                    >
                        {eachAlbum?.images[0]?.url ? <img
                                src={eachAlbum?.images[0]?.url}
                                draggable={false}
                                alt="Album Picture"
                            ></img> :
                            <img
                                style={{
                                    backgroundColor: '#302f2f',
                                    padding: '5px',
                                    borderRadius: '5px',

                                }}
                                src={NoAlbumPicture}

                                draggable={false}
                                alt="Album Picture"></img>}
                    </div>
                </Link>

                {hoveringOver && (
                    <button

                        className={albumsStyle["album-hover-button"]}
                        onClick={async () => {
                            if (currentlyPlaying.albumID === eachAlbum?.id) {
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
                                await PlayResumeStreaming(accessToken, eachAlbum?.uri);
                                dispatch(
                                    setUserControlActions({
                                        userAction: "Play Album",
                                    })
                                );
                            }
                        }}
                    >
                        {currentlyPlaying.albumID === eachAlbum?.id &&
                        currentlyPlaying.isPlaying ? (
                            <div>
                                <img
                                    style={{padding: '10px'}}
                                    alt={"Pause icon"} src={Pause} width={30} height={30}></img>
                            </div>
                        ) : (
                            <div>
                                <img alt={"Play icon"} src={Play} width={50} height={50}></img>
                            </div>
                        )}
                    </button>
                )}
                <Link to={`/album/${eachAlbum?.id}`}
                      state={fromSearch ? {type: 'album', id: eachAlbum?.id} : null}>
                    <div className={albumsStyle["album-details"]}
                    >
                        <h1>
                            {Number(eachAlbum?.name?.length) > 15
                                ? eachAlbum?.name.slice(0, 16).concat("...")
                                : eachAlbum?.name}
                        </h1>
                        <p>
                            {String(eachAlbum?.release_date).slice(0, 4)} •{" "}
                            {Number(eachAlbum?.artists?.map((each) => each.name).join(", ").length) > 15
                                ? eachAlbum?.artists
                                    .map((each) => each.name)
                                    .join(", ")
                                    .slice(0, 10)
                                    .concat("...")
                                : eachAlbum?.artists.map((each) => each.name).join(", ")}
                        </p>
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default AlbumCard;
