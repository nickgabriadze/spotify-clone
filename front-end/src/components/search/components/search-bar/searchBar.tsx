import searchBarStyle from "./searchBar.module.css";
import SearchUnfilledGrey from "../../../navigation/icons/search-unfilled-grey.svg";
import SearchUnfilled from "../../../navigation/icons/search-unfilled.svg";
import closeSearch from "../../../navigation/icons/close-search.svg";
import {useEffect, useState} from "react";

import {useNavigate, useParams} from "react-router-dom";


export function SearchBar() {
    const params = useParams();
    const destructured = ['all', 'albums', 'artists', 'playlists', 'songs', 'podcastsAndShows'].includes(Object.values(params).toString().split('/')[2]) ? Object.values(params).toString().split('/')[2] : 'all'
    const weAreSearchingFor = Object.values(params).toString().split('/')[1]
    const [userSearchingQ, setUserSearchingQ] = useState<string>(weAreSearchingFor || '');
    const [onElementFocus, setOnElementFocus] = useState<boolean>(false);
    const navigator = useNavigate();
    // const [err, setErr] = useState<string | unknown>();


    useEffect(() => {
        const timeOutToSetQuery = setTimeout(() => {

            if (userSearchingQ !== '') {
                navigator(`/search/${userSearchingQ === 'undefined' ? '' : userSearchingQ}/${destructured ? destructured : 'all'}`)
            } else {
                navigator('/search')
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
                            {userSearchingQ.length !== 0 &&
                                <img
                                    alt={'Delete/Close search icon'}
                                    src={closeSearch}
                                    onClick={() => {
                                        setUserSearchingQ('')
                                        navigator(`/search`)
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
