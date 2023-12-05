import {useState} from "react";
import HomeFilled from "./icons/home-filled.svg";
import HomeUnfilled from "./icons/home-unfilled.svg";
import SearchFilled from "./icons/search-filled.svg";
import SearchUnfilled from "./icons/search-unfilled.svg";
import navigationStyle from "./navigation.module.css";
import SearchUnfilledGrey from "./icons/search-unfilled-grey.svg";
import HomeUnfilledGrey from "./icons/home-unfilled-grey.svg";
import {useAppDispatch} from "../../store/hooks";
import {addReactComponentToNavigation} from "../../store/features/navigationSlice.ts";
import {Link, useParams} from "react-router-dom";


export function Navigation() {
    const navParams = useParams();
    const navParamsIncludeSearch = Object.values(navParams).toString().includes('search')
    const navParamsHome = Object.values(navParams).toString().length === 0
    const [navHover, setNavHover] = useState<string>("none");
    const dispatchNavigation = useAppDispatch();

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
                        navParamsHome
                            ? HomeFilled
                            : navHover === "Home"
                                ? HomeUnfilled
                                : HomeUnfilledGrey
                    }


                    alt={'Home icon'}></img>
                <h4 style={navParamsHome ? {color: "white"} : {}}>Home</h4>
            </div>
            </Link>

           <Link to={'/search/'}>
               <div
                  className={navigationStyle["search-box"]}

                  onMouseEnter={() => setNavHover("Search")}
                  onMouseLeave={() => setNavHover("none")}
            >
                <img
                    alt={'Search icon'}
                    className={navigationStyle['nav-img']}
                    src={
                       navParamsIncludeSearch
                            ? SearchFilled
                            : navHover === "Search"
                                ? SearchUnfilled
                                : SearchUnfilledGrey
                    }

                ></img>
                <h4 style={navParamsIncludeSearch ? {color: "white"} : {}}>Search</h4>
            </div>
               </Link>
        </section>
    );
}

export default Navigation;
