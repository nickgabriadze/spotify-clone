import { useEffect, useState } from "react";
import { useAppSelector } from "../../store/hooks";
import Genres from "./components/genres/genres";
import SearchBar from "./components/search-bar/searchBar";
import SearchResult from "./components/search-result/searchResult";
import Searchables from "./components/searchables/searchables";
import searchStyle from "./search.module.css";

export function Search() {
  const searchStuff = useAppSelector((state) => state.navigationReducer);

  const [windowInnerHeight, setWindowInnerHeight] = useState<number>(window.innerHeight);

  useEffect(() => {
    
    const updateWindowDimensions = () => {
      const newHeight = window.innerHeight;
      setWindowInnerHeight(newHeight);
     
    };

    window.addEventListener("resize", updateWindowDimensions);

    return () => window.removeEventListener("resize", updateWindowDimensions) 

  }, []);

  return (
    <section className={searchStyle["search-box"]}
    style={{height:`calc(${windowInnerHeight}px - 100px)`}}
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
