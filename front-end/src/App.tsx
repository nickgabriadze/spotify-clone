import { useEffect, useState } from "react";
import { fetchTokenAsync, setToken } from "./store/features/spotiUserSlice";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import appStyle from "./app.module.css";
import Search from "./components/search/search";
import Navigation from "./components/navigation/navigation";
import Player from "./components/player/player";

export function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTokenAsync());
  }, [dispatch]);

  const accessTokenFromInternal = String(sessionStorage.getItem("accessToken"));
  useEffect(() => {
    dispatch(
      setToken({
        accessToken: accessTokenFromInternal,
      })
    );
  }, [accessTokenFromInternal, dispatch]);

  const homeOrSearch = useAppSelector((state) => state.navigationReducer.navTo);

  const access = useAppSelector((state) => state.spotiUserReducer.spotiToken);


  const [windowInnerHeight, setWindowInnerHeight] = useState<number>(window.innerHeight);

  useEffect(() => {
    
    const updateWindowDimensions = () => {
      const newHeight = window.innerHeight;
      setWindowInnerHeight(newHeight);
     
    };

    window.addEventListener("resize", updateWindowDimensions);

    return () => window.removeEventListener("resize", updateWindowDimensions) 

  }, []);

  if (access.refresh_token === "pending" || access.refresh_token === "") {
    return (
      <img
        className={appStyle["loading-anim"]}
        src={"/spotify_web.png"}
        width={100}
        height={100}
      ></img>
    );
  }else{

  

  return (
    <div className={appStyle["application-wrapper"]}>
      <div className={appStyle['nav']}>
        <Navigation />
      </div>
      <div className={appStyle['users-stuff']}></div>
      <div className={appStyle['search-home']}
      
      
      >{homeOrSearch === "search" ? <Search height={windowInnerHeight} /> : ""}</div>
      <div className={appStyle['player']}>
        <Player />
      </div>
    </div>
  );
  }
}

export default App;
