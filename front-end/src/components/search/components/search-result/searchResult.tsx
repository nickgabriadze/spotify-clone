import {ArtistsRes} from "../each-search-component/Artists/Artists";
import PlaylistsRes from "../each-search-component/Playlists/Playlists";
import AlbumsRes from "../each-search-component/Albums/Albums";
import SongsRes from "../each-search-component/Songs/Songs";
import PodcastsShows from "../each-search-component/PodcastsShows/podcastsShows";
import AllResults from "../each-search-component/All/All.tsx";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";

export function SearchResult() {
    const {query} = useParams();
    const params = useParams();
    const [searchingState, setSearchingState] = useState(query)
    const castedToString = String(searchingState)


    useEffect(() => {
        setSearchingState(query)

    }, [query]);

    if (params.type === 'artists') {
        document.title = `Search / Artists`
        return <ArtistsRes artistsName={castedToString}/>
    }

    if (params.type ===  'playlists') {
        document.title = `Search / Playlists`
        return <PlaylistsRes playlistName={castedToString}/>
    }

    if (params.type === "albums") {
        document.title = `Search / Albums`
        return <AlbumsRes albumName={castedToString}/>
    }

    if (params.type === 'songs') {
        document.title = `Search / Songs`
        return <SongsRes songName={castedToString}/>
    }

    if (params.type === 'podcastsAndShows') {
        document.title = `Search / Podcasts & Shows`
        return <PodcastsShows podcastShowName={castedToString}/>
    }
    /* For all things combined */
    return (
        <AllResults searchQuery={castedToString}/>
    );
}

export default SearchResult;
