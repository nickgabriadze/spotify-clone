import mainStyle from "./main.module.css";
import Search from "../search/search.tsx";
import {useAppSelector} from "../../store/hooks.ts";


export function Main({height}: { height: number }) {
    const homeOrSearch = useAppSelector((state) => state.navigationReducer.navTo);


    return <main className={mainStyle['main-container']}
                 style={{height: `calc(${height}px - 120px)`}}>{homeOrSearch === "search" ?
        <Search /> : <div></div>}
    </main>
}

export default Main;