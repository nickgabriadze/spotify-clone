import searchBarStyle from "./searchBar.module.css";
import SearchUnfilledGrey from "../../../navigation/icons/search-unfilled-grey.svg";
import SearchUnfilled from "../../../navigation/icons/search-unfilled.svg";
import closeSearch from "../../../navigation/icons/close-search.svg";
import {useState} from "react";

import {useAppDispatch, useAppSelector} from "../../../../store/hooks";
import {
    setSearchQuery,
    setTyping,
} from "../../../../store/features/navigationSlice";


export function SearchBar() {
    const searchStuff = useAppSelector((state) => state.navigationReducer);
    const dispatchSearch = useAppDispatch();
    const [onElementFocus, setOnElementFocus] = useState<boolean>(false);

    // const [err, setErr] = useState<string | unknown>();


    return (
        <div className={searchBarStyle["search-bar"]}>
            <div className={searchBarStyle["search-with-nav"]}>
                <div className={searchBarStyle['navigation-with-search']}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            marginLeft: '-6px'
                        }}
                    >
                        <div className={searchBarStyle["search-bar-wrapper"]}
                             style={
                                 onElementFocus
                                     ? {
                                         boxShadow: `0 0 0 1px #fff`,
                                     }
                                     : {}
                             }
                             onFocus={() => {
                                 setOnElementFocus(true);
                             }}
                             onBlur={() => {
                                 setOnElementFocus(false);
                             }}
                        >
                            <img
                                alt={'Search icon'}
                                src={onElementFocus ? SearchUnfilled : SearchUnfilledGrey}
                                width={24}
                                height={24}
                            ></img>
                            <input
                                autoComplete={"off"}
                                onKeyDown={() => {
                                    if (searchStuff.typing === false) {
                                        dispatchSearch(
                                            setTyping({
                                                typing: true,
                                            })
                                        );
                                    }
                                }}
                                onKeyUp={() => {
                                    if (searchStuff.typing) {
                                        dispatchSearch(
                                            setTyping({
                                                typing: false,
                                            })
                                        );
                                    }
                                }}
                                name="Search song field"
                                placeholder="What do you want to listen to?"
                                value={searchStuff.searchQuery}
                                onChange={(e) =>
                                    dispatchSearch(
                                        setSearchQuery({
                                            searchQuery: e.target.value,
                                        })
                                    )
                                }
                            ></input>
                            {searchStuff.searchQuery.length === 0 ? (
                                ""
                            ) : (
                                <img
                                    alt={'Delete/Close search icon'}
                                    src={closeSearch}
                                    onClick={() =>
                                        dispatchSearch(
                                            setSearchQuery({
                                                searchQuery: "",
                                            })
                                        )
                                    }
                                    width={24}
                                    height={24}
                                ></img>
                            )}
                        </div>
                    </div>


                </div>

            </div>

        </div>
    );
}

export default SearchBar;
