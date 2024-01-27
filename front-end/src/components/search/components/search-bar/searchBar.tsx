import searchBarStyle from "./searchBar.module.css";
import SearchUnfilledGrey from "../../../navigation/icons/search-unfilled-grey.svg";
import SearchUnfilled from "../../../navigation/icons/search-unfilled.svg";
import closeSearch from "../../../navigation/icons/close-search.svg";
import {useEffect, useState} from "react";

import {useLocation, useNavigate, useParams} from "react-router-dom";
import useProperNavigationState from "../../../utils/useProperNavigationState.ts";


export function SearchBar() {
    const params = useParams();
    const weAreSearchingFor = Object.values(params).toString().split('/')[1]
    const [userSearchingQ, setUserSearchingQ] = useState<string>(weAreSearchingFor === undefined ? '' : String(weAreSearchingFor));
    const [onElementFocus, setOnElementFocus] = useState<boolean>(false);
    const navigator = useNavigate();
    // const [err, setErr] = useState<string | unknown>();
    const [focused, setFocused] = useState<boolean>(false);
    const loc = useLocation();
    useEffect(() => {
        setUserSearchingQ(weAreSearchingFor === undefined ? '' : String(weAreSearchingFor))


    }, [loc.state?.previousPaths?.length]);

    useEffect(() => {
        const timeOutToSetQuery = setTimeout(() => {
                if (userSearchingQ !== '') {
                    const destructured = ['all', 'albums', 'artists', 'playlists', 'songs', 'podcastsAndShows'].includes(Object.values(params).toString().split('/')[2]) ? Object.values(params).toString().split('/')[2] : 'all'
                    if (loc.state !== null) {
                        if (userSearchingQ + "-" + destructured !== loc.state.previousPaths[loc.state.previousPaths.length - 1].split('#')[2] &&
                            loc.state?.type !== "search_res_searchable"
                        ) {
                            navigator(`/search/${userSearchingQ}/${destructured}`, {state: useProperNavigationState(loc, 'search_res', false, userSearchingQ + "-" + destructured)})
                        }
                    } else {
                        navigator(`/search/${userSearchingQ}/${destructured}`, {state: useProperNavigationState(loc, 'search_res', false, userSearchingQ + "-" + destructured)})
                    }
                }
                if (userSearchingQ.length === 0 && focused && loc.pathname !== '/search') {
                    navigator('/search')
                }

            }
            ,
            500
        )
        return () => clearTimeout(timeOutToSetQuery)
    }, [userSearchingQ, focused, Object.values(params).toString()]);


    return (
        <div className={searchBarStyle["search-bar"]}>
            <div className={searchBarStyle["search-with-nav"]}>
                <div className={searchBarStyle['navigation-with-search']}>
                    <div
                        style={{
                            width: '100%',
                            maxWidth: '350px',
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
                                onChange={(e) =>
                                    setUserSearchingQ(e.target.value)
                                }
                                onFocus={() => {
                                    if (!focused) {
                                        setFocused(true)
                                    }
                                }}
                                onBlur={() => {
                                    if (focused) {
                                        setFocused(false)
                                    }
                                }}
                            ></input>
                            {userSearchingQ.length !== 0 &&
                                <img
                                    alt={'Delete/Close search icon'}
                                    src={closeSearch}
                                    onClick={() => {
                                        setUserSearchingQ('')
                                        navigator(`/search`, {state: useProperNavigationState(loc, 'search_res', false, 'empty_search')})
                                    }
                                    }
                                    width={24}
                                    height={24}
                                ></img>

                            }
                        </div>
                    </div>


                </div>

            </div>


        </div>
    );
}

export default SearchBar;
