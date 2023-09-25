import mainStyle from "./main.module.css";
import Search from "../search/search.tsx";
import {useAppSelector} from "../../store/hooks.ts";
import searchBarStyle from "../search/components/search-bar/searchBar.module.css";
import Left from "../search/components/search-bar/icons/left.svg";
import Right from "../search/components/search-bar/icons/right.svg";


export function Main({height}: { height: number }) {
    const navOption = useAppSelector((state) => state.navigationReducer.navTo);


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
           <div style={{height: `${height}px`}}>{navOption === 'search' ? <Search/> : <div></div>}</div>

        </main>


    )
}

export default Main;