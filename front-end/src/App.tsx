import { useEffect } from "react";
import { fetchTokenAsync, setToken } from "./store/features/spotiUserSlice";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import appStyle from "./app.module.css";
import Search from "./components/search/search";
import Navigation from "./components/navigation/navigation";


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

  if (access.refresh_token === "pending" || access.refresh_token === "") {
    
    return (
      <img
        className={appStyle["loading-anim"]}
        src={"/spotify_web.png"}
        width={100}
        height={100}
      ></img>
    );
  }

  return (
    <div className={appStyle["application-wrapper"]}>
      <Navigation />
      {homeOrSearch === "search" ? <Search /> : ""}
    </div>
  );
}

export default App;
