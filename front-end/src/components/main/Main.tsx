import mainStyle from "./main.module.css";
import Search from "../search/search.tsx";
import {useAppSelector} from "../../store/hooks.ts";
import searchBarStyle from "../search/components/search-bar/searchBar.module.css";
import Left from "../search/components/search-bar/icons/left.svg";
import Right from "../search/components/search-bar/icons/right.svg";
import  Queue  from "./components/queue/Queue.tsx";
import {ReactElement} from "react";


export function Main({height}: { height: number }) {
    const navOption = useAppSelector((state) => state.navigationReducer.navTo);
    // TODO have to remove as soon as the component array will be created
    const navigation:{
        [key: string]:ReactElement
    } = {
        "Search": <Search />,
        "Queue": <Queue />
    }

    return (
        <main className={mainStyle['main-container']} style={{height: `${height}px`}}>
                 <div className={searchBarStyle["left-right-nav"]}>
                            <button>
                                <img alt={'Left icon'} src={Left} height={32}></img>
                            </button>
                            <button style={{marginLeft: "-3px"}}>
                                <img alt={'Right icon'} src={Right} height={32}></img>
                            </button>
                 </div>
           <div style={{height: `${height - 110}px`}}>{navigation[navOption]}</div>

        </main>


    )
}

export default Main;