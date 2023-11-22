import searchBarStyle from "./searchBar.module.css";
import SearchUnfilledGrey from "../../../navigation/icons/search-unfilled-grey.svg";
import SearchUnfilled from "../../../navigation/icons/search-unfilled.svg";
import closeSearch from "../../../navigation/icons/close-search.svg";
import {useEffect, useState} from "react";

import {useAppDispatch, useAppSelector} from "../../../../store/hooks";
import {
    setSearchQuery,
} from "../../../../store/features/navigationSlice";
import {useNavigate, useParams} from "react-router-dom";


export function SearchBar() {
    const params = useParams();
    const destructured = Object.values(params).toString().split('/')[2] === 'undefined' ? 'all' : Object.values(params).toString().split('/')[2]
    const weAreSearchingFor = Object.values(params).toString().split('/')[1]
    const [userSearchingQ, setUserSearchingQ] = useState<string>(weAreSearchingFor);
    const searchStuff = useAppSelector((state) => state.navigationReducer);
    const dispatchSearch = useAppDispatch();
    const [onElementFocus, setOnElementFocus] = useState<boolean>(false);

    const navigator = useNavigate();
    // const [err, setErr] = useState<string | unknown>();

    useEffect(() => {
        const timeOutToSetQuery = setTimeout(() => {
            dispatchSearch(
                setSearchQuery({
                    searchQuery: userSearchingQ
                })
            )


            if (userSearchingQ !== '') {
                navigator(`/search/${userSearchingQ === 'undefined' ? '' : userSearchingQ}/${destructured}`)
            }

        }, 500)


        return () => clearTimeout(timeOutToSetQuery)
    }, [userSearchingQ]);

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
                                name="Search song field"
                                placeholder="What do you want to listen to?"
                                value={userSearchingQ}
                                onChange={(e) => {
                                    setUserSearchingQ(e.target.value)

                                }
                                }
                            ></input>
                            {searchStuff.searchQuery.length === 0 ? (
                                ""
                            ) : (
                                <img
                                    alt={'Delete/Close search icon'}
                                    src={closeSearch}
                                    onClick={() => {
                                        setUserSearchingQ('')
                                        navigator(`/search/`)
                                    }
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
