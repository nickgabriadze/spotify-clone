import artistsStyle from "../components/each-search-component/Artists/artists.module.css";
import {Artist} from "../../../types/artist";
import NoArtistImage from "../components/each-search-component/icons/no-artist-pic.webp";
import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import PlayResumeStreaming from "../../../api/player/playResumeStreaming";
import Play from "../components/each-search-component/Playlists/icons/play.svg";
import Pause from "../components/each-search-component/Playlists/icons/pause.svg";
import {setUserControlActions} from "../../../store/features/navigationSlice";
import PauseStreaming from "../../../api/player/pauseStreaming";
import getArtist from "../../../api/search/getArtist.ts";
import ArtistCardSkeleton from "../../../skeletons/artistCardSkeleton.tsx";
import {Link} from "react-router-dom";


export function ArtistCardApi({artistID}: { artistID: string }) {

    const [singleArtist, setSingleArtist] = useState<Artist | undefined>();
    const accessToken = useAppSelector(
        (state) => state.spotiUserReducer.spotiToken.accessToken
    );
    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        const getSingleArtist = async () => {
            try {
                setLoading(true)
                const reqArtist = await getArtist(accessToken, artistID);
                const artistData = reqArtist.data;
                setSingleArtist(artistData)
            } catch (err) {
            } finally {
                setLoading(false)
            }
        }

        getSingleArtist()
    }, [accessToken, artistID]);

    return loading ? <ArtistCardSkeleton/> : <ArtistCard eachArtist={singleArtist}/>
}

export function ArtistCard({eachArtist}: { eachArtist: Artist | undefined }) {
    const [hoveringOver, setHoveringOver] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const currentlyPlaying = useAppSelector(
        (state) => state.navigationReducer.currentlyPlayingSong
    );

    const accessToken = useAppSelector(
        (state) => state.spotiUserReducer.spotiToken.accessToken
    );

    return (
        <div
            className={artistsStyle["each-artist"]}
            style={{color: "white"}}
            onMouseOver={() => setHoveringOver(true)}
            onMouseOut={() => setHoveringOver(false)}
        >
            <div className={artistsStyle['artist-img-wrapper']}>
                <Link to={`/artist/${eachArtist?.id}`}>
                    <div className={artistsStyle["artist-img"]}

                    >
                        {eachArtist?.images[0]?.url ? (
                            <img
                                draggable={false}
                                src={eachArtist?.images[0]?.url}

                                alt={"Artist image"}
                            ></img>
                        ) : (
                            <img
                                className={artistsStyle["no-artist-img"]}
                                draggable={false}
                                src={NoArtistImage}

                                alt={"Artist image placeholder"}
                            ></img>
                        )}
                    </div>
                </Link>
                    {hoveringOver && (
                        <button
                            onClick={async () => {
                                if (currentlyPlaying.artistID === eachArtist?.id) {
                                    if (!currentlyPlaying.isPlaying) {
                                        await PlayResumeStreaming(accessToken);
                                        dispatch(
                                            setUserControlActions({
                                                userAction: "Play Artist",
                                            })
                                        );
                                    } else {
                                        await PauseStreaming(accessToken);
                                        dispatch(
                                            setUserControlActions({
                                                userAction: "Pause Artist",
                                            })
                                        );
                                    }
                                } else {
                                    await PlayResumeStreaming(accessToken, eachArtist?.uri);
                                    dispatch(
                                        setUserControlActions({
                                            userAction: "Play Artist",
                                        })
                                    );
                                }
                            }}
                            className={artistsStyle["artist-hover-button"]}
                        >
                            {currentlyPlaying?.context?.uri === eachArtist?.uri &&
                            currentlyPlaying.isPlaying ? (
                                <div>
                                    <img
                                        style={{padding: '10px'}}
                                        alt={"Pause icon"} src={Pause} width={40} height={40}></img>
                                </div>
                            ) : (

                                <div>
                                    <img

                                        alt={"Pause icon"} src={Play} width={100} height={100}></img>
                                </div>

                            )}
                        </button>
                    )}
            </div>


            <Link to={`/artist/${eachArtist?.id}`}>
                <div className={artistsStyle["artist-info"]}

                >
                    <h1>
                        {Number(eachArtist?.name.length) > 21
                            ? eachArtist?.name.slice(0, 22).concat("...")
                            : eachArtist?.name}
                    </h1>
                    <p>
                        {eachArtist?.type[0].toUpperCase().concat(eachArtist?.type.slice(1))}
                    </p>
                </div>
            </Link>

        </div>
);
}

export default ArtistCard;
