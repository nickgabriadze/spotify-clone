import {useAppDispatch, useAppSelector} from "../../store/hooks";
import Genres from "./components/genres/genres";
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
        <section>
            <SearchBar/>
            <div>
                {searchStuff.searchQuery.trim().length > 0 ? (
                    <SearchResult/>
                ) : (
                    <Genres/>
                )}
            </div>
        </section>
    );
}

export default Search;
