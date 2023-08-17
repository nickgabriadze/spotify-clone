import Genres from "./components/genres/genres"
import SearchBar from "./components/search-bar/searchBar"
import searchStyle from "./search.module.css"

export function Search(){


    return <section className={searchStyle['search-box']}>
        <SearchBar />
        <Genres />
    </section>
}

export default Search