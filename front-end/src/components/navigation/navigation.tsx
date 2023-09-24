import {useState} from "react";
import HomeFilled from "./icons/home-filled.svg";
import HomeUnfilled from "./icons/home-unfilled.svg";
import SearchFilled from "./icons/search-filled.svg";
import SearchUnfilled from "./icons/search-unfilled.svg";
import navigationStyle from "./navigation.module.css";
import SearchUnfilledGrey from "./icons/search-unfilled-grey.svg";
import HomeUnfilledGrey from "./icons/home-unfilled-grey.svg";
import {useAppDispatch} from "../../store/hooks";
import {setNavTo} from "../../store/features/navigationSlice";


export function Navigation() {
    //Home - True, Search - False
    const [nav, setNav] = useState<boolean>(true);
    const [navHover, setNavHover] = useState<string>("none");
    const dispatchNavigation = useAppDispatch();


    return (
        <section className={navigationStyle["nav-box"]}>
            <div
                className={navigationStyle["home-box"]}
                onMouseEnter={() => setNavHover("home")}
                onMouseLeave={() => setNavHover("none")}
                onClick={() => {
                    setNav(true);
                    dispatchNavigation(
                        setNavTo({
                            navTo: "home",
                        })
                    );
                }}
            >
                <img
                    className={navigationStyle['nav-img']}
                    src={
                        nav
                            ? HomeFilled
                            : navHover === "home"
                                ? HomeUnfilled
                                : HomeUnfilledGrey
                    }


                    alt={'Home icon'}></img>
                <h4 style={nav ? {color: "white"} : {}}>Home</h4>
            </div>

            <div
                  className={navigationStyle["search-box"]}
                  onClick={() => {
                      setNav(false)
                      dispatchNavigation(
                          setNavTo({
                              navTo: "search",
                          })
                      );
                  }}
                  onMouseEnter={() => setNavHover("search")}
                  onMouseLeave={() => setNavHover("none")}
            >
                <img
                    alt={'Search icon'}
                    className={navigationStyle['nav-img']}
                    src={
                        !nav
                            ? SearchFilled
                            : navHover === "search"
                                ? SearchUnfilled
                                : SearchUnfilledGrey
                    }

                ></img>
                <h4 style={!nav ? {color: "white"} : {}}>Search</h4>
            </div>
        </section>
    );
}

export default Navigation;
