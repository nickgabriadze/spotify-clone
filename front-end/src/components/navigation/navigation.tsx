import {useState} from "react";
import HomeFilled from "./icons/home-filled.svg";
import HomeUnfilled from "./icons/home-unfilled.svg";
import SearchFilled from "./icons/search-filled.svg";
import SearchUnfilled from "./icons/search-unfilled.svg";
import navigationStyle from "./navigation.module.css";
import SearchUnfilledGrey from "./icons/search-unfilled-grey.svg";
import HomeUnfilledGrey from "./icons/home-unfilled-grey.svg";
import {useAppDispatch, useAppSelector} from "../../store/hooks";
import {addReactComponentToNavigation} from "../../store/features/navigationSlice.ts";
import {Link} from "react-router-dom";


export function Navigation() {

    const [navHover, setNavHover] = useState<string>("none");
    const dispatchNavigation = useAppDispatch();
    const pageNav = useAppSelector(state => state.navigationReducer.pageNavigation)
    const currentPage = pageNav.pageHistory[pageNav.currentPageIndex].component
    return (

        <section className={navigationStyle["nav-box"]}>
            <Link to={'/'}><div
                className={navigationStyle["home-box"]}
                onMouseEnter={() => setNavHover("Home")}
                onMouseLeave={() => setNavHover("none")}
                onClick={() => {
                       dispatchNavigation(addReactComponentToNavigation({componentName: "Home", props: null}))

                }}
            >
                <img
                    className={navigationStyle['nav-img']}
                    src={
                        currentPage === 'Home'
                            ? HomeFilled
                            : navHover === "Home"
                                ? HomeUnfilled
                                : HomeUnfilledGrey
                    }


                    alt={'Home icon'}></img>
                <h4 style={currentPage === 'Home' ? {color: "white"} : {}}>Home</h4>
            </div>
            </Link>

           <Link to={'/search'}>
               <div
                  className={navigationStyle["search-box"]}
                  onClick={() => {
                       dispatchNavigation(addReactComponentToNavigation({componentName: "Search", props: null}))

                  }}
                  onMouseEnter={() => setNavHover("Search")}
                  onMouseLeave={() => setNavHover("none")}
            >
                <img
                    alt={'Search icon'}
                    className={navigationStyle['nav-img']}
                    src={
                        currentPage === 'Search'
                            ? SearchFilled
                            : navHover === "Search"
                                ? SearchUnfilled
                                : SearchUnfilledGrey
                    }

                ></img>
                <h4 style={currentPage === 'Search'? {color: "white"} : {}}>Search</h4>
            </div>
               </Link>
        </section>
    );
}

export default Navigation;
