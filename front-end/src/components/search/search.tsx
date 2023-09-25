import {useAppDispatch, useAppSelector} from "../../store/hooks";
import BrowsingCategory from "./components/browsing-categories/BrowsingCategory.tsx";
import SearchBar from "./components/search-bar/searchBar";
import SearchResult from "./components/search-result/searchResult";
import {useEffect} from "react";
import {setSearchOption} from "../../store/features/navigationSlice.ts";

export function Search() {
    const searchStuff = useAppSelector((state) => state.navigationReducer);
    const appDispatch = useAppDispatch();

    useEffect(() => {
        if (searchStuff.searchQuery.trim().length === 0) {
            appDispatch(setSearchOption({
                option: 'All'
            }))
        }
    }, [searchStuff.searchQuery.trim().length]);

    return (
        <section style={{height: 'calc(100% - 110px)'}}>
            <SearchBar/>
            <div style={{ height: '100%'}}>
                {searchStuff.searchQuery.trim().length > 0 ? (
                    <SearchResult/>
                ) : (
                    <BrowsingCategory/>
                )}
            </div>
        </section>
    );
}

export default Search;
