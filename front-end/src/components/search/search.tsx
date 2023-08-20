import { useAppSelector } from "../../store/hooks";
import Genres from "./components/genres/genres";
import SearchBar from "./components/search-bar/searchBar";
import SearchResult from "./components/search-result/searchResult";
import searchStyle from "./search.module.css";

export function Search() {
  const searchStuff = useAppSelector(
    (state) => state.navigationReducer
  );

  return (
    <section className={searchStyle["search-box"]}>
      <SearchBar />
      {searchStuff.searchQuery.trim().length > 0? <SearchResult /> : <Genres />}
    </section>
  );
}

export default Search;
