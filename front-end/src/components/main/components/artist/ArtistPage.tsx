import {Artist} from "../../../../types/artist.ts";
import {RefObject, useEffect, useRef, useState} from "react";
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
import NoArtistImage from "../../../search/components/each-search-component/icons/no-artist-pic.webp";
import artistsStyle from "../../../search/components/each-search-component/Artists/artists.module.css";
import getArtistsAlbums from "../../../../api/main/artist/getArtistsAlbums.ts";
import AlbumCard from "../../../search/reuseables/albumCard.tsx";
import {Album} from "../../../../types/album.ts";
import AppearsOn from "./components/AppearsOn.tsx";
import FansAlsoLike from "./components/FansAlsoLike.tsx";
import {checkInView} from "../../../utils/checkInView.ts";
import {setWhatsInView} from "../../../../store/features/spotiUserSlice.ts";
import {useParams} from "react-router-dom";

export function ArtistPage({ mainRef}: {  mainRef: RefObject<HTMLDivElement> }) {
    const {artistID} = useParams();
    const [artistData, setArtistData] = useState<Artist>();
    const accessToken = useAppSelector(s => s.spotiUserReducer.spotiToken.accessToken);
    const dispatch = useAppDispatch();
    const isArtistSaved = useAppSelector(s => s.spotiUserReducer.userSaved.userSavedArtistIDs).includes(String(artistID))
    const currentlyPlaying = useAppSelector(s => s.navigationReducer.currentlyPlayingSong)
    const country = String(useAppSelector(s => s.spotiUserReducer.userInformation?.country));
    const [artistTopTracks, setArtistTopTracks] = useState<Track[]>([])
    const [showMore, setShowMore] = useState<boolean>(false)
    const [discography, setDiscography] = useState<{ [key: string]: any }[]>([]);
    const [discoWhich, setDiscoWhich] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const playBtnRef = useRef<HTMLDivElement>(null)
    const artistPageRef = useRef<HTMLDivElement>(null)
    const numberOfItems = useAppSelector(s => s.spotiUserReducer.numberOfItemsToBeShown);

    useEffect(() => {

        const duringScroll = () => {

            if (!checkInView(playBtnRef)) {
                dispatch(setWhatsInView({
                    pageName: 'Artist',
                    pageItemName: String(artistData?.name),
                    uri: String(artistData?.uri)

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
        return () => mainRef.current?.removeEventListener('scroll', duringScroll)


    }, [playBtnRef.current, artistPageRef.current, artistID]);

    useEffect(() => {
        if (!currentlyPlaying.isPlaying && artistData?.id) {
            document.title = `Artist / ${artistData?.name}`
        }
    }, [currentlyPlaying.isPlaying, artistData?.id]);

    useEffect(() => {

        const fetchArtist = async () => {
            try {
                setLoading(true)
                setShowMore(false)
                const artistData = (await getArtist(accessToken, String(artistID))).data;
                setArtistData(artistData)
                const topTracks = (await getArtistsPopularTracks(accessToken, String(artistID), country)).data.tracks
                setArtistTopTracks(topTracks)

                const discoTime = (await getArtistsAlbums(accessToken, String(artistID), ['album', 'single', 'compilation']))
                setDiscography(discoTime)
                setDiscoWhich(Object.keys(discoTime[0]).toString())

            } catch (err) {

            } finally {
                setLoading(false)
            }
        }
        fetchArtist();
    }, [artistID, accessToken, country]);

    if (loading) return <></>



    return <section className={artistPageStyle['artist-page-wrapper']}
                    ref={artistPageRef}
    >


        <div className={artistPageStyle['artist-general-info']}>
            <div className={artistPageStyle['artist-image']}>{artistData?.images[0]?.url ? (
                <img
                    draggable={false}
                    src={artistData?.images[0]?.url}
                    alt={"Artist image"}
                ></img>
            ) : (
                <img
                    className={artistsStyle["no-artist-img"]}
                    draggable={false}
                    src={NoArtistImage}
                    width={150}
                    height={150}
                    alt={"Artist image placeholder"}
                ></img>
            )}</div>
            <div className={artistPageStyle['artist-name']}>
                <h1>{artistData?.name.slice(0, 25)}</h1>
                <p>{artistData?.followers.total.toLocaleString()} followers</p>
            </div>
        </div>

        <div className={artistPageStyle['play-follow']}>
            <div className={artistPageStyle['play-button']}
                 ref={playBtnRef}
            >
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
                            const req = await removeArtistForCurrentUser(accessToken, String(artistID))
                            if (req.status === 204) {
                                dispatch(addLibraryAction("User removed Artist from Library"))
                            }

                        } else {
                            const req = await saveArtistForCurrentUser(accessToken, String(artistID))
                            if (req.status === 204) {
                                dispatch(addLibraryAction("User saved Artist to Library"))
                            }
                        }
                    }
                    }
                ><p>{isArtistSaved ? 'Following' : 'Follow'}</p></button>
            </div>
        </div>

        {artistTopTracks.length > 0 && <div className={artistPageStyle['top-tracks']}>
            <h1>Popular</h1>

            <div className={artistPageStyle['tracks-box']}>
                <div className={artistPageStyle['tracks']}>
                    {artistTopTracks.length > 0 && artistTopTracks.slice(0, showMore ? 10 : 5).map((track, i) =>
                        <SongCard eachTrack={track} n={i + 1}
                                  accessToken={accessToken}
                                  forAlbum={false}
                                  key={i}
                                  forArtist={true}/>)}
                </div>
                <button className={artistPageStyle['see-more-tracks']}
                        onClick={() => setShowMore(prev => !prev)}
                ><p>{showMore ? 'Show less' : 'See more'}</p></button>
            </div>
        </div>}


        {discography.length > 0 && <div className={artistPageStyle['discography-section']}>

            <div className={artistPageStyle['disco-header']}>
                <h1>Discography</h1>
                <button className={artistPageStyle['see-more-tracks']}><h4>Show all</h4></button>
            </div>

            <div className={artistPageStyle['option-disco']}>
                {discography.map((each, i) => <div
                    style={{
                        backgroundColor: discoWhich === Object.keys(each).toString() ? 'white' : '#232323',

                    }}
                    key={i}>
                    <button
                        onClick={() => setDiscoWhich(Object.keys(each).toString())}
                    >
                        <p
                            style={{color: discoWhich === Object.keys(each).toString() ? 'black' : '#FFFFFF'}}
                        >{Object.keys(each)[0].slice(0, 1).toUpperCase().concat(Object.keys(each)[0].slice(1,)).concat('s')}</p>
                    </button>
                </div>)}
            </div>

            <div
                className={artistPageStyle['disco-albums-list']}
            style={{gridTemplateColumns: `repeat(${numberOfItems}, minmax(0, 1fr)`}}
            >{discography.filter(e => Object.keys(e).toString() === discoWhich)[0][discoWhich].slice(0, numberOfItems).map((chosenGroup: Album, i: number) =>
                <AlbumCard eachAlbum={chosenGroup} key={i}/>)
            }</div>

        </div>}


        <FansAlsoLike artistID={String(artistID)}/>


        <AppearsOn artistID={String(artistID)}/>

    </section>
}


export default ArtistPage;