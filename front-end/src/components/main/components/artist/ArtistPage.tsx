import {Artist} from "../../../../types/artist.ts";
import {useEffect, useState} from "react";
import getArtist from "../../../../api/search/getArtist.ts";
import {useAppDispatch, useAppSelector} from "../../../../store/hooks.ts";
import artistPageStyle from './artistpage.module.css'
import PlayResumeStreaming from "../../../../api/player/playResumeStreaming.ts";
import {addLibraryAction, setUserControlActions} from "../../../../store/features/navigationSlice.ts";
import PauseStreaming from "../../../../api/player/pauseStreaming.ts";
import Pause from "../../../search/components/each-search-component/Playlists/icons/pause.svg";
import Play from "../../../search/components/each-search-component/Playlists/icons/play.svg";
import removeArtistForCurrentUser from "../../../../api/library/removeArtistForCurrentUser.ts";
import saveArtistForCurrentUser from "../../../../api/library/saveArtistForCurrentUser.ts";
import getArtistsPopularTracks from "../../../../api/main/artist/getArtistsPopularTracks.ts";
import {Track} from "../../../../types/track.ts";
import {SongCard} from "../../../search/reuseables/songCard.tsx";

export function ArtistPage({artistID}: { artistID: string }) {
    const [artistData, setArtistData] = useState<Artist>();
    const accessToken = useAppSelector(s => s.spotiUserReducer.spotiToken.accessToken);
    const dispatch = useAppDispatch();
    const isArtistSaved = useAppSelector(s => s.spotiUserReducer.userSaved.userSavedArtistIDs).includes(artistID)
    const currentlyPlaying = useAppSelector(s => s.navigationReducer.currentlyPlayingSong)
    const country = String(useAppSelector(s => s.spotiUserReducer.userInformation?.country));
    const [artistTopTracks, setArtistTopTracks] = useState<Track[]>([])
    const [showMore, setShowMore] = useState<boolean>(false)
    useEffect(() => {
        const fetchArtist = async () => {
            try {
                const artistData = (await getArtist(accessToken, artistID)).data;
                setArtistData(artistData)
                const topTracks = (await getArtistsPopularTracks(accessToken, artistID, country)).data.tracks
                setArtistTopTracks(topTracks)
            } catch (err) {

            }
        }
        fetchArtist();
    }, [artistID, accessToken, country]);

    return <section className={artistPageStyle['artist-page-wrapper']}>

        <div className={artistPageStyle['artist-general-info']}>
            <div className={artistPageStyle['artist-image']}><img alt={"Artists Image"} draggable={false}
                                                                  src={artistData?.images[0]?.url}></img></div>
            <div className={artistPageStyle['artist-name']}>
                <h1>{artistData?.name.slice(0, 25)}</h1>
                <p>{artistData?.followers.total.toLocaleString()} followers</p>
            </div>
        </div>

        <div className={artistPageStyle['play-follow']}>
            <div className={artistPageStyle['play-button']}>
                <button
                    onClick={async () => {
                        if (currentlyPlaying.artistID === artistData?.id) {
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
                            await PlayResumeStreaming(accessToken, artistData?.uri);
                            dispatch(
                                setUserControlActions({
                                    userAction: "Play Artist",
                                })
                            );
                        }
                    }}
                    className={artistPageStyle["artist-hover-button"]}
                >
                    {currentlyPlaying.artistID === artistData?.id &&
                    currentlyPlaying.isPlaying ? (
                        <div>
                            <img
                                alt={"Pause image"}

                                src={Pause} width={30} height={30}></img>
                        </div>
                    ) : (
                        <div>

                            <img alt={"Play image"} src={Play} width={50} height={50}></img>
                        </div>
                    )}
                </button>
            </div>
            <div className={artistPageStyle['follow-following']}>
                <button
                    title={isArtistSaved ? 'Remove artist from Library' : 'Save artist to Library'}
                    onClick={async () => {
                        if (isArtistSaved) {
                            const req = await removeArtistForCurrentUser(accessToken, artistID)
                            if (req.status === 204) {
                                dispatch(addLibraryAction("User removed Artist from Library"))
                            }

                        } else {
                            const req = await saveArtistForCurrentUser(accessToken, artistID)
                            if (req.status === 204) {
                                dispatch(addLibraryAction("User saved Artist to Library"))
                            }
                        }
                    }
                    }
                ><p>{isArtistSaved ? 'Following' : 'Follow'}</p></button>
            </div>
        </div>

        <div className={artistPageStyle['top-tracks']}>
            <h1>Popular</h1>

            <div className={artistPageStyle['tracks-box']}>
                <div className={artistPageStyle['tracks']}>
                    {artistTopTracks.length > 0 && artistTopTracks.slice(0, showMore ? 10 : 5).map((track, i) =>
                        <SongCard eachTrack={track} n={i + 1}
                                  accessToken={accessToken}
                                  forAlbum={false}
                                  forArtist={true}/>)}
                </div>
                <button className={artistPageStyle['see-more-tracks']}
                        onClick={() => setShowMore(prev => !prev)}
                ><p>{showMore ? 'Show less' : 'See more'}</p></button>
            </div>
        </div>
    </section>
}


export default ArtistPage;