import {
  Option,
  setSearchOption,
} from "../../../../store/features/navigationSlice";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import searchAblesStyle from "./searchAbles.module.css";

export function Searchables() {
  const searchOptions: Option[] = [
    "All",
    "Artists",
    "Albums",
    "Songs",
    "Playlists",
    "Podcasts & Shows",
  ];
  const searchStuff = useAppSelector((state) => state.navigationReducer);
  const searchDispatch = useAppDispatch();
  
  return (
    <div className={searchAblesStyle["search-options"]}>
      {searchOptions.map((option, i) => (
        <div
        onClick={() => {
          searchDispatch(
            setSearchOption({
              option: option,
            })
          );
        }}
          style={
            searchStuff.searchOption === option
              ? { backgroundColor: "white" }
              : {}
          }
          key={i}
          className={searchAblesStyle["each-option"]}
        >
          <p
            style={
              searchStuff.searchOption === option ? { color: "black" } : {}
            }
          
          >
            {option}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Searchables;
