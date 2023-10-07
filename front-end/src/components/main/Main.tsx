import mainStyle from "./main.module.css";
import Search from "../search/search.tsx";
import {useAppSelector} from "../../store/hooks.ts";
import searchBarStyle from "../search/components/search-bar/searchBar.module.css";
import Left from "../search/components/search-bar/icons/left.svg";
import Right from "../search/components/search-bar/icons/right.svg";
import Queue from "./components/queue/Queue.tsx";
import {ReactElement, useEffect, useState} from "react";
import Home from "./components/home/Home.tsx";
import {Me} from "../../types/me.ts";
import getMe from "../../api/getMe.ts";
import SearchBar from "../search/components/search-bar/searchBar.tsx";


export function Main({height}: { height: number }) {
    const [userData, setUserData] = useState<Me>();
    const [loading, setLoading] = useState<boolean>(true);
    const access = useAppSelector((state) => state.spotiUserReducer.spotiToken.accessToken)
    const navOption = useAppSelector((state) => state.navigationReducer.navTo);
    // TODO have to remove as soon as the component array will be created
    const navigation: {
        [key: string]: ReactElement
    } = {
        "Search": <Search/>,
        "Home": <Home/>,
        "Queue": <Queue/>
    }
    useEffect(() => {
        const fetchMyData = async () => {
            try {
                const req = await getMe(access);
                const data = req.data;
                setUserData(data);
            } catch (err) {
                // setErr(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMyData();
    }, [access]);

    return (
        <main className={mainStyle['main-container']} style={{height: `${height}px`}}>

            <div className={mainStyle['head-of-main']}>
                <div className={mainStyle["left-right-nav"]}>
                    <button>
                        <img alt={'Left icon'} src={Left} height={32}></img>
                    </button>
                    <button style={{marginLeft: "-3px"}}>
                        <img alt={'Right icon'} src={Right} height={32}></img>
                    </button>

                    {navOption === 'Search' && <SearchBar />}
                </div>
                <div className={searchBarStyle["install-profile"]}>
                    {loading ? (
                        <div className={searchBarStyle['profile-pic-loading']}></div>
                    ) : (
                        <img alt={'User picture'} src={userData?.images[0].url} width={32} height={32}></img>
                    )}
                </div>
            </div>

            <div>{navigation[navOption]}</div>

        </main>


    )
}

export default Main;