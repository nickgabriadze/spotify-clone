import {useAppDispatch, useAppSelector} from "../../store/hooks";
import BrowsingCategory from "./components/browsing-categories/BrowsingCategory.tsx";
import SearchResult from "./components/search-result/searchResult";
import {useEffect} from "react";
import {setSearchOption} from "../../store/features/navigationSlice.ts";


export function Search() {
    const searchStuff = useAppSelector((state) => state.navigationReducer);
    const appDispatch = useAppDispatch();
    const currentlyPlaying = useAppSelector(s => s.navigationReducer.currentlyPlayingSong);

    useEffect(() => {
        if (searchStuff.searchQuery.trim().length === 0) {
            appDispatch(setSearchOption({
                option: 'All'
            }))
        }
    }, [searchStuff.searchQuery.trim().length]);

    useEffect(() => {
        if(!currentlyPlaying.isPlaying){
             document.title = 'Search & Explore'
        }
    }, [currentlyPlaying.isPlaying]);
    return (
        <section style={{height: '100%', width: '100%'}}>
            <div style={{ height: '100%', width: '100%'}}>
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
