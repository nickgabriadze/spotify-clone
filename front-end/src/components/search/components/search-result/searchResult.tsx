import { searchAll } from "../../../../api/searchAll";
import { useAppSelector } from "../../../../store/hooks";
import { useEffect, useState } from "react";
import { SpotiError } from "../../../Error";
import searchResultStyle from "./searchResult.module.css";


export function SearchResult() {
  const access = useAppSelector((state) => state.spotiUserReducer.spotiToken);
  const searchStuff = useAppSelector((state) => state.navigationReducer);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState<string | unknown>("");
  
  useEffect(() => {
    const controller = new AbortController();

    const fetchResults = async () => {
      try {
        setSearchLoading(true);
        const req = await searchAll(
          searchStuff.searchQuery,
          access.accessToken,
          searchStuff.searchOption
        );
        const data = req.data;
        setResults(data);
      } catch (err) {
        setError(err);
      } finally {
        setSearchLoading(false);
      }
    };

    fetchResults();

    return () => controller.abort();
  }, [searchStuff.searchQuery, access, searchStuff.searchOption]);

  if (error) {
    return <SpotiError />;
  }

  if (searchLoading) {
    return (
      <h1
        style={{
          color: "white",
        }}
      >
        Loading...
      </h1>
    );
  }

  console.log(results);
  return (
    <section className={searchResultStyle["searched-results-box"]}></section>
  );
}

export default SearchResult;
