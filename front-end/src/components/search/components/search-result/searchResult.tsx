
import { useAppSelector } from "../../../../store/hooks";
import searchResultStyle from "./searchResult.module.css";
import { ArtistsRes } from "../each-search-component/Artists/Artists";
import PlaylistsRes from "../each-search-component/Playlists/Playlists";
import AlbumsRes from "../each-search-component/Albums/Albums";
import SongsRes from "../each-search-component/Songs/Songs";
import PodcastsShows from "../each-search-component/PodcastsShows/podcastsShows";

export function SearchResult() {

  const searchStuff = useAppSelector((state) => state.navigationReducer);
 



  if(searchStuff.searchOption === 'Artists'){
    return <ArtistsRes artistsName={searchStuff.searchQuery} />
  }

  if(searchStuff.searchOption === 'Playlists'){
    return <PlaylistsRes playlistName={searchStuff.searchQuery} />
  }

  if(searchStuff.searchOption === "Albums"){
    return <AlbumsRes albumName={searchStuff.searchQuery} />
  }

  if(searchStuff.searchOption === 'Songs'){
    return <SongsRes songName={searchStuff.searchQuery} />
  }

  if(searchStuff.searchOption === 'Podcasts & Shows'){
    return <PodcastsShows podcastShowName={searchStuff.searchQuery} />
  }


  /* For all things combined */
  return (
    <section className={searchResultStyle["searched-results-box"]}></section>
  );
}

export default SearchResult;
