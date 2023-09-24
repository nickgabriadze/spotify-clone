import mainStyle from "./main.module.css";
import Search from "../search/search.tsx";
import {Route, Routes} from "react-router-dom";


export function Main({height}: { height: number }) {


    return (
        <main className={mainStyle['main-container']} style={{height: `${height}px`}}>
            <Routes>
                <Route path={'/search'} element={<Search/>}/>

            </Routes>
        </main>


    )
}

export default Main;