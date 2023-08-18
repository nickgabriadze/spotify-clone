import { useEffect } from "react";
import { fetchTokenAsync } from "./store/features/spotiUserSlice";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import appStyle from "./app.module.css";
import Search from "./components/search/search";
import Navigation from "./components/navigation/navigation";
import axiosInstance from "./axios";

export function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchTokenAsync());
  }, [dispatch]);

  const homeOrSearch = useAppSelector((state) => state.navigationReducer.navTo);

  if (!window.location.hash.includes("#")) {
    axiosInstance
      .get("http://localhost:3001/authenticate")
      .then((res) => (window.location.href = res.data));
  } else {
    const text = window.location.hash
      .split("#")[1]
      .split("&")
      .map((each) => {
        const split = each.split("=");
       
        const key = split[0];
        const value = split[1];
        const obj =JSON.parse(`{"${key}":"${value}"}`)
       
        return obj
        
      });
    console.log(text);
  }

  return (
    <div className={appStyle["application-wrapper"]}>
      <Navigation />
      {homeOrSearch === "search" ? <Search /> : ""}
    </div>
  );
}

export default App;
