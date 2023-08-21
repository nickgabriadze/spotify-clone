import searchBarStyle from "./searchBar.module.css";
import SearchUnfilledGrey from "../../../navigation/icons/search-unfilled-grey.svg";
import SearchUnfilled from "../../../navigation/icons/search-unfilled.svg";
import closeSearch from "../../../navigation/icons/close-search.svg";
import { useEffect, useState } from "react";
import Left from "./icons/left.svg";
import Right from "./icons/right.svg";
import Download from "./icons/download.svg";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  setSearchQuery,
  setTyping,
} from "../../../../store/features/navigationSlice";
import getMe from "../../../../api/getMe";
import { Me } from "../../../../types/me";
import SpotiError from "../../../Error";

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

  console.log(userData);

  

  return (
    <div className={searchBarStyle["search-bar"]}>
      <div className={searchBarStyle["search-with-nav"]}>
        <div className={searchBarStyle["left-right-nav"]}>
          <button>
            <img src={Left} height={32}></img>
          </button>
          <button style={{ marginLeft: "-3px" }}>
            <img src={Right} height={32}></img>
          </button>
        </div>

        <div
          className={searchBarStyle["search-bar-wrapper"]}
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
          <img src={Download} width={25} height={25}></img> Install App
        </a>
        {loading ? (
          <SpotiError />
        ) : (
          <img src={userData?.images[0].url} width={32} height={32}></img>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
