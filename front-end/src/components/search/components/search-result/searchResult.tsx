import {useAppSelector} from "../../../../store/hooks";
import {ArtistsRes} from "../each-search-component/Artists/Artists";
import PlaylistsRes from "../each-search-component/Playlists/Playlists";
import AlbumsRes from "../each-search-component/Albums/Albums";
import SongsRes from "../each-search-component/Songs/Songs";
import PodcastsShows from "../each-search-component/PodcastsShows/podcastsShows";
import AllResults from "../each-search-component/All/All.tsx";

export function SearchResult() {

    const searchStuff = useAppSelector((state) => state.navigationReducer);




    if (searchStuff.searchOption === 'Artists') {
        document.title = `Search / Artists`
        return <ArtistsRes artistsName={searchStuff.searchQuery}/>
    }

    if (searchStuff.searchOption === 'Playlists') {
        document.title = `Search / Playlists`
        return <PlaylistsRes playlistName={searchStuff.searchQuery}/>
    }

    if (searchStuff.searchOption === "Albums") {
        document.title = `Search / Albums`
        return <AlbumsRes albumName={searchStuff.searchQuery}/>
    }

    if (searchStuff.searchOption === 'Songs') {
        document.title = `Search / Songs`
        return <SongsRes songName={searchStuff.searchQuery}/>
    }

    if (searchStuff.searchOption === 'Podcasts & Shows') {
        document.title = `Search / Podcasts & Shows`
        return <PodcastsShows podcastShowName={searchStuff.searchQuery}/>
    }

    /* For all things combined */
    return (

        <AllResults searchQuery={searchStuff.searchQuery}/>
    );
}

export default SearchResult;
