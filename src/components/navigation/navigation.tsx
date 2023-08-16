import { useState } from "react";
import HomeFilledSVG from "./icons/home-filled.svg";
import HomeUnfilledSVG from "./icons/home-unfilled.svg";
import SearchFilledSVG from "./icons/search-filled.svg";
import SearchUnfilledSVG from "./icons/search-unfilled.svg";
import navigationStyle from "./navigation.module.css";
import SearchUnfilledGreySVG from "./icons/search-unfilled-grey.svg";
import HomeUnfilledGreySVG from "./icons/home-unfilled-grey.svg";
import { useAppDispatch } from "../../store/hooks";
import { setNavTo } from "../../store/features/navigationSlice";

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
          src={
            nav
              ? HomeFilledSVG
              : navHover === "home"
              ? HomeUnfilledSVG
              : HomeUnfilledGreySVG
          }
          width={28}
          height={28}
        ></img>
        <h4 style={nav ? { color: "white" } : {}}>Home</h4>
      </div>

      <div
        className={navigationStyle["search-box"]}
        onClick={() =>{ setNav(false)
            dispatchNavigation(
                setNavTo({
                  navTo: "search",
                })
              );}}
        onMouseEnter={() => setNavHover("search")}
        onMouseLeave={() => setNavHover("none")}
      >
        <img
          src={
            !nav
              ? SearchFilledSVG
              : navHover === "search"
              ? SearchUnfilledSVG
              : SearchUnfilledGreySVG
          }
          width={28}
          height={28}
        ></img>
        <h4 style={!nav ? { color: "white" } : {}}>Search</h4>
      </div>
    </section>
  );
}

export default Navigation;
