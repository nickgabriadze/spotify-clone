import {useAppDispatch, useAppSelector} from "../../store/hooks";
import BrowsingCategory from "./components/browsing-categories/BrowsingCategory.tsx";
import SearchResult from "./components/search-result/searchResult";
import {useEffect} from "react";
import {setSearchOption} from "../../store/features/navigationSlice.ts";
import Searchables from "./components/searchables/searchables.tsx";

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
        <section style={{height: '100%'}}>
            <div style={{ height: '100%'}}>
                {searchStuff.searchQuery.trim().length > 0 ? (
                     <>{searchStuff.searchQuery.trim().length > 0 ? <Searchables/> : ""}
                    <SearchResult/>
                     </>
                ) : (
                    <BrowsingCategory/>
                )}
            </div>
        </section>
    );
}

export default Search;
