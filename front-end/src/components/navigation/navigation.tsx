import {useState} from "react";
import HomeFilled from "./icons/home-filled.svg";
import HomeUnfilled from "./icons/home-unfilled.svg";
import SearchFilled from "./icons/search-filled.svg";
import SearchUnfilled from "./icons/search-unfilled.svg";
import navigationStyle from "./navigation.module.css";
import SearchUnfilledGrey from "./icons/search-unfilled-grey.svg";
import HomeUnfilledGrey from "./icons/home-unfilled-grey.svg";
import {useAppDispatch, useAppSelector} from "../../store/hooks";
import {setNavTo} from "../../store/features/navigationSlice";
import {addReactComponentToNavigation} from "../../store/features/navigationSlice.ts";


export function Navigation() {

    const [navHover, setNavHover] = useState<string>("none");
    const dispatchNavigation = useAppDispatch();
    const navigateTo = useAppSelector((state) => state.navigationReducer.navTo);


    return (
        <section className={navigationStyle["nav-box"]}>
            <div
                className={navigationStyle["home-box"]}
                onMouseEnter={() => setNavHover("Home")}
                onMouseLeave={() => setNavHover("none")}
                onClick={() => {
                    dispatchNavigation(addReactComponentToNavigation("Home"))

                    dispatchNavigation(
                        setNavTo({
                            navTo: "Home",
                        })
                    );
                }}
            >
                <img
                    className={navigationStyle['nav-img']}
                    src={
                        navigateTo === 'Home'
                            ? HomeFilled
                            : navHover === "Home"
                                ? HomeUnfilled
                                : HomeUnfilledGrey
                    }


                    alt={'Home icon'}></img>
                <h4 style={navigateTo === 'Home' ? {color: "white"} : {}}>Home</h4>
            </div>

            <div
                  className={navigationStyle["search-box"]}
                  onClick={() => {
                       dispatchNavigation(addReactComponentToNavigation("Search"))
                      dispatchNavigation(
                          setNavTo({
                              navTo: "Search",
                          })
                      );
                  }}
                  onMouseEnter={() => setNavHover("Search")}
                  onMouseLeave={() => setNavHover("none")}
            >
                <img
                    alt={'Search icon'}
                    className={navigationStyle['nav-img']}
                    src={
                        navigateTo === 'Search'
                            ? SearchFilled
                            : navHover === "Search"
                                ? SearchUnfilled
                                : SearchUnfilledGrey
                    }

                ></img>
                <h4 style={navigateTo === 'Search'? {color: "white"} : {}}>Search</h4>
            </div>
        </section>
    );
}

export default Navigation;
