import mainStyle from "./main.module.css";
import {useAppDispatch, useAppSelector} from "../../store/hooks.ts";
import searchBarStyle from "../search/components/search-bar/searchBar.module.css";
import Left from "../search/components/search-bar/icons/left.svg";
import Right from "../search/components/search-bar/icons/right.svg";
import Queue from "./components/queue/Queue.tsx";
import {useEffect, useState} from "react";
import Home from "./components/home/Home.tsx";
import {Me} from "../../types/me.ts";
import getMe from "../../api/getMe.ts";
import SearchBar from "../search/components/search-bar/searchBar.tsx";
import Searchables from "../search/components/searchables/searchables.tsx";
import {setUserInformation} from "../../store/features/spotiUserSlice.ts";
import AlbumPage from "./components/album/AlbumPage.tsx";
import {Route, Routes, useNavigate, useParams, useLocation} from 'react-router-dom'
import {setUserControlActions} from "../../store/features/navigationSlice.ts";
import ArtistPage from "./components/artist/ArtistPage.tsx";
import PlaylistPage from "./components/playlist/PlaylistPage.tsx";
import PlayResumeStreaming from "../../api/player/playResumeStreaming.ts";
import PauseStreaming from "../../api/player/pauseStreaming.ts";
import artistPageStyle from "./components/artist/artistpage.module.css";
import Pause from "../search/components/each-search-component/Playlists/icons/pause.svg";
import Play from "../search/components/each-search-component/Playlists/icons/play.svg";
import {useUpdateNumberOfItems} from "./hooks/useNumberOfItems.ts";
import Category from "./components/browsingCategory/category.tsx";
import Error from "../Error.tsx";
import {LikedSongs} from "./components/playlist/LikedSongs.tsx";
import ArtistLayout from "./components/artist/ArtistLayout.tsx";
import {Discography} from "./components/artist/components/discography/Discography.tsx";
import SearchLayout from "../search/layouts/SearchLayout.tsx";
import BrowsingCategory from "../search/components/browsing-categories/BrowsingCategory.tsx";
import SearchResult from "../search/components/search-result/searchResult.tsx";


export function Main({height}: {
    height: number
}) {
    const [userData, setUserData] = useState<Me>();
    const [loading, setLoading] = useState<boolean>(true);
    const access = useAppSelector((state) => state.spotiUserReducer.spotiToken.accessToken)
    const dispatch = useAppDispatch();
    useUpdateNumberOfItems();
    const navigatePages = useNavigate();

    const params = useParams();
    const weAreSearching = Object.values(params).toString().includes('search')
    const weHaveQuery = String(Object.values(params).toString().split('/')[1]) !== 'undefined'
    const searchingPage = String(Object.values(params)).includes('search')
    useEffect(() => {
        const fetchMyData = async () => {
            try {
                const req = await getMe(access);
                const data = req.data;
                setUserData(data);
                dispatch(setUserInformation(data))
            } catch (err) {
                // setErr(err);
            } finally {
                setLoading(false);
            }
        };

        if (localStorage.getItem('access_token')) {
            fetchMyData();
        }
    }, [access]);
    const whatsInView = useAppSelector(s => s.spotiUserReducer.whatsInViewForPlay);
    const currentlyPlaying = useAppSelector(s => s.navigationReducer.currentlyPlayingSong)
    const [displayLogOut, setDisplayLogout] = useState<boolean>(false)


    const {state} = useLocation();

    return (
        <main
            className={mainStyle['main-container']} style={{height: `${height}px`}}>
            <div
                className={mainStyle['header-container']}
                style={searchingPage ? {
                    position: 'sticky',
                    top: '0',
                    zIndex: '9999',
                    backgroundColor: '#121212',
                    paddingTop: '15px',
                    paddingBottom: '20px'
                } : {paddingTop: '15px', paddingBottom: '20px'}}
            >
                <div className={mainStyle['head-of-main']}

                >
                    <div className={mainStyle["left-right-nav"]}>
                        <button

                            onClick={() => {
                                navigatePages(-1)

                            }}
                        >
                            <img
                                style={{filter: `${state === 0 ? `brightness(50%)` : `brightness(100%)`}`}}
                                alt={'Left icon'} src={Left} height={32}></img>
                        </button>
                        <button style={{marginLeft: "-3px"}}
                                onClick={() => {
                                    navigatePages(1)

                                }}
                        >
                            <div>


                                <img
                                    style={{filter: `${window.history.length - 2 === state || !Boolean(state) ? `brightness(50%)` : `brightness(100%)`}`}}
                                    alt={'Right icon'} src={Right} height={32}></img>

                            </div>
                        </button>

                        {weAreSearching && <SearchBar/>}
                        {whatsInView.pageName !== 'None' &&
                            <div className={mainStyle['fast-access']}
                            >
                                <div className={mainStyle['play-button']}>
                                    <button
                                        onClick={async () => {
                                            if (currentlyPlaying?.context?.uri === whatsInView.uri) {
                                                if (!currentlyPlaying.isPlaying) {
                                                    await PlayResumeStreaming(access);
                                                    dispatch(
                                                        setUserControlActions({
                                                            userAction: "Play",
                                                        })
                                                    );
                                                } else {
                                                    await PauseStreaming(access);
                                                    dispatch(
                                                        setUserControlActions({
                                                            userAction: "Pause",
                                                        })
                                                    );
                                                }
                                            } else {
                                                await PlayResumeStreaming(access, whatsInView.uri);
                                                dispatch(
                                                    setUserControlActions({
                                                        userAction: "Play",
                                                    })
                                                );
                                            }
                                        }}
                                        className={artistPageStyle["artist-hover-button"]}
                                    >
                                        {currentlyPlaying?.context?.uri === whatsInView.uri &&
                                        currentlyPlaying.isPlaying ? (
                                            <div>
                                                <img
                                                    alt={"Pause image"}

                                                    src={Pause} width={40} height={40}></img>
                                            </div>
                                        ) : (
                                            <div>

                                                <img alt={"Play image"} src={Play} width={50} height={50}></img>
                                            </div>
                                        )}
                                    </button>
                                </div>
                                <h1>{whatsInView.pageItemName}</h1>
                            </div>}
                    </div>

                    <div className={searchBarStyle["install-profile"]}>
                        {loading ? (
                            <div className={searchBarStyle['profile-pic-loading']}></div>
                        ) : (
                            <div className={mainStyle['user-icon-log-out-wrapper']}>
                                {displayLogOut && <button
                                    className={mainStyle['log-out-btn']}
                                    onClick={() => {
                                        localStorage.clear()
                                        dispatch(setUserControlActions({
                                            userAction: 'USER_LOGOUT'
                                        }))
                                        navigatePages('/welcome')
                                    }

                                    }>Log Out</button>}
                                <button
                                    onClick={() => {

                                        setDisplayLogout((prev) => !prev)
                                        const timeout = setTimeout(() => {
                                            setDisplayLogout(false)

                                            return () => clearTimeout(timeout)
                                        }, 3000)
                                    }}
                                >
                                    <img alt={'User picture'} src={userData?.images[0].url} width={32}
                                         height={32}></img>
                                </button>
                            </div>

                        )}

                    </div>

                </div>
                {weAreSearching && weHaveQuery && <Searchables/>}
            </div>

            <div>
                <Routes>
                    <Route path={'/'} element={<Home/>}/>
                    <Route path={'/search'} element={<SearchLayout/>}>
                        <Route path={''} element={<BrowsingCategory/>}></Route>
                        <Route path={':query/:type'} element={<SearchResult/>}></Route>

                    </Route>
                    <Route path={'/genre/:genreID'} element={<Category/>}/>
                    <Route path={'/artist'} element={<ArtistLayout/>}>
                        <Route path={':artistID'} element={<ArtistPage/>}/>
                        <Route path={':artistID/discography'} errorElement={<Error/>} element={<Discography/>}></Route>
                        <Route path={':artistID/discography/:type'} element={<Discography/>}></Route>
                    </Route>
                    <Route path={'/queue'} element={<Queue/>}/>
                    <Route path={'/album/:albumID'} element={<AlbumPage/>}/>
                    <Route path={'/playlist/:playlistID'} element={<PlaylistPage/>}/>
                    <Route path={'/collection/tracks'} element={<LikedSongs/>}/>

                </Routes>
            </div>
        </main>


    )
}

export default Main;