import mainStyle from "./main.module.css";
import Search from "../search/search.tsx";
import {useAppDispatch, useAppSelector} from "../../store/hooks.ts";
import searchBarStyle from "../search/components/search-bar/searchBar.module.css";
import Left from "../search/components/search-bar/icons/left.svg";
import Right from "../search/components/search-bar/icons/right.svg";
import Queue from "./components/queue/Queue.tsx";
import {ReactNode, useEffect, useState} from "react";
import Home from "./components/home/Home.tsx";
import {Me} from "../../types/me.ts";
import getMe from "../../api/getMe.ts";
import SearchBar from "../search/components/search-bar/searchBar.tsx";
import Searchables from "../search/components/searchables/searchables.tsx";
import {setUserInformation} from "../../store/features/spotiUserSlice.ts";
import AlbumPage from "./components/album/AlbumPage.tsx";
import {navigateToDirection} from "../../store/features/navigationSlice.ts";
import ArtistPage from "./components/artist/ArtistPage.tsx";
import  {CategoryPage} from "./components/browsingCategory/category.tsx";


export function Main({height}: { height: number }) {
    const [userData, setUserData] = useState<Me>();
    const [loading, setLoading] = useState<boolean>(true);
    const access = useAppSelector((state) => state.spotiUserReducer.spotiToken.accessToken)
    const navOption = useAppSelector((state) => state.navigationReducer.navTo);
    const searching = useAppSelector((state) => state.navigationReducer.searchQuery);
    const dispatch = useAppDispatch();
    const navigation: {
        [key: string]: (data: any) => ReactNode
    } = {
        "Search": () => <Search/>,
        "Home": () => <Home/>,
        "Queue": () => <Queue/>,
        "Album": (ID: string) => <AlbumPage albumID={ID}/>,
        "Artist": (ID: string) => <ArtistPage artistID={ID} />,
        "BrowsingCategory": (categoryStuff: string[]) => <CategoryPage categoryStuff={categoryStuff} />
    }
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

        fetchMyData();
    }, [access, dispatch]);


    const PageNavigation = useAppSelector(state => state.navigationReducer.pageNavigation);


    const componentObject = PageNavigation.pageHistory[PageNavigation.currentPageIndex]
    return (
        <main className={mainStyle['main-container']} style={{height: `${height}px`}}>
            <div
                className={mainStyle['header-container']}
                style={navOption === 'Search' ? {position: 'sticky', top: '0', zIndex: '9999', backgroundColor: '#121212'} : {paddingTop: '15px', paddingBottom: '20px'}}
            >
                <div className={mainStyle['head-of-main']}

                >
                    <div className={mainStyle["left-right-nav"]}>
                        <button

                            onClick={() => {
                                dispatch(navigateToDirection("BACK"))
                            }}
                        >
                            <img
                                style={{filter: `${PageNavigation.currentPageIndex === 0 ? `brightness(50%)` : `brightness(100%)`}`}}
                                alt={'Left icon'} src={Left} height={32}></img>
                        </button>
                        <button style={{marginLeft: "-3px"}}
                                onClick={() => {
                                    dispatch(navigateToDirection("FORWARD"))
                                }}
                        >
                            <img
                                style={{filter: `${PageNavigation.currentPageIndex === PageNavigation.pageHistory.length - 1 ? `brightness(50%)` : `brightness(100%)`}`}}
                                alt={'Right icon'} src={Right} height={32}></img>
                        </button>

                        {componentObject.component === 'Search' && <SearchBar/>}
                    </div>

                    <div className={searchBarStyle["install-profile"]}>
                        {loading ? (
                            <div className={searchBarStyle['profile-pic-loading']}></div>
                        ) : (
                            <img alt={'User picture'} src={userData?.images[0].url} width={32} height={32}></img>
                        )}
                    </div>
                </div>
                {componentObject.component === 'Search' && searching.trim().length > 0 ? <Searchables/> : ""}
            </div>

            <div>{navigation[componentObject.component](componentObject.props)}</div>

        </main>


    )
}

export default Main;