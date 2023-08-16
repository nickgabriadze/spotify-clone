import SearchBar from "./components/search-bar/searchBar"
import searchStyle from "./search.module.css"

export function Search(){


    return <section className={searchStyle['search-box']}>
        <SearchBar />
    </section>
}

export default Search