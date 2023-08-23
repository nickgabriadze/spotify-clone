
import { useAppSelector } from "../../../../store/hooks";
import searchResultStyle from "./searchResult.module.css";
import { ArtistsRes } from "../each-search-component/Artists/Artists";
import PlaylistsRes from "../each-search-component/Playlists/Playlists";
import AlbumsRes from "../each-search-component/Albums/Albums";

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

  return (
    <section className={searchResultStyle["searched-results-box"]}></section>
  );
}

export default SearchResult;
