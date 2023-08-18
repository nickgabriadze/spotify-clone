import { useEffect } from "react";
import { fetchTokenAsync } from "./store/features/spotiUserSlice";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import appStyle from "./app.module.css";
import Search from "./components/search/search";
import Navigation from "./components/navigation/navigation";



export function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchTokenAsync());
  }, [dispatch]);

  const homeOrSearch = useAppSelector((state) => state.navigationReducer.navTo);


  return (
    <div className={appStyle['application-wrapper']}>
      <Navigation />
      {homeOrSearch==='search'?  <Search />: ''}
      
    </div>
  );
}

export default App;
