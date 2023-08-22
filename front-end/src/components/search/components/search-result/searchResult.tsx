import { searchAll } from "../../../../api/search/searchAll";
import { useAppSelector } from "../../../../store/hooks";
import { useEffect, useState } from "react";
import { SpotiError } from "../../../Error";
import searchResultStyle from "./searchResult.module.css";
import { ArtistsRes } from "../each-search-component/Artists/Artists";

export function SearchResult() {

  const searchStuff = useAppSelector((state) => state.navigationReducer);
 

 



  if(searchStuff.searchOption === 'Artists'){
    return <ArtistsRes artistsName={searchStuff.searchQuery} />
  }

  return (
    <section className={searchResultStyle["searched-results-box"]}></section>
  );
}

export default SearchResult;
