import searchBarStyle from "./searchBar.module.css";
import SearchUnfilledGrey from "../../../navigation/icons/search-unfilled-grey.svg";
import SearchUnfilled from "../../../navigation/icons/search-unfilled.svg";
import closeSearch from "../../../navigation/icons/close-search.svg";
import {useEffect, useState} from "react";

import Download from "./icons/download.svg";
import {useAppDispatch, useAppSelector} from "../../../../store/hooks";
import {
    setSearchQuery,
    setTyping,
} from "../../../../store/features/navigationSlice";
import getMe from "../../../../api/getMe";
import {Me} from "../../../../types/me";
import Searchables from '../searchables/searchables.tsx';
import SpotiError from "../../../Error.tsx";

export function SearchBar() {
    const searchStuff = useAppSelector((state) => state.navigationReducer);
    const dispatchSearch = useAppDispatch();
    const [onElementFocus, setOnElementFocus] = useState<boolean>(false);
    const access = useAppSelector((state) => state.spotiUserReducer.spotiToken);
    const [userData, setUserData] = useState<Me>();
    const [loading, setLoading] = useState<boolean>(true);
    // const [err, setErr] = useState<string | unknown>();

    useEffect(() => {
        const fetchMyData = async () => {
            try {
                const req = await getMe(access.accessToken);
                const data = req.data;
                setUserData(data);
            } catch (err) {
                // setErr(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMyData();
    }, [access.accessToken]);


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


                    <div className={searchBarStyle["install-profile"]}>
                        <a href="https://www.spotify.com/us/download/windows/" target="_blank">
                            {" "}
                            <img alt={'Download icon'} src={Download} width={25} height={25}></img> Install App
                        </a>
                        {loading ? (
                            <SpotiError/>
                        ) : (
                            <img alt={'User picture'} src={userData?.images[0].url} width={32} height={32}></img>
                        )}
                    </div>
                </div>
                {searchStuff.searchQuery.trim().length > 0 ? <Searchables/> : ""}
            </div>

        </div>
    );
}

export default SearchBar;
