import { useAppSelector } from "../../store/hooks";
import Genres from "./components/genres/genres";
import SearchBar from "./components/search-bar/searchBar";
import SearchResult from "./components/search-result/searchResult";
import Searchables from "./components/searchables/searchables";
import searchStyle from "./search.module.css";

export function Search({height}: {height: number}) {
  const searchStuff = useAppSelector((state) => state.navigationReducer);



  return (
    <section className={searchStyle["search-box"]}
    style={{height:`calc(${height}px - 101px)`}}
    >
      <SearchBar />
      {searchStuff.searchQuery.trim().length > 0 ? <Searchables /> : ""}
      <div className={searchStyle["search-related-stuff"]}>
        {searchStuff.searchQuery.trim().length > 0 ? (
          <SearchResult />
        ) : (
          <Genres />
        )}
      </div>
    </section>
  );
}

export default Search;
