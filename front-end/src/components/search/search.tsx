import BrowsingCategory from "./components/browsing-categories/BrowsingCategory.tsx";
import SearchResult from "./components/search-result/searchResult";

import {Route, Routes} from "react-router-dom";


export function Search() {



    return (
        <section style={{height: '100%', width: '100%'}}>
            <div style={{ height: '100%', width: '100%'}}>
                <Routes>
                    <Route path={'/:query/:type/*'} element={<SearchResult />}></Route>
                    <Route path={''} element={<BrowsingCategory />}></Route>
                </Routes>
            </div>
        </section>
    );
}

export default Search;
