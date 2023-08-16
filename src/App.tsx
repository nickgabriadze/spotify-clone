import { useEffect } from "react";
import { fetchTokenAsync } from "./store/features/spotiUserSlice";
import { useAppDispatch } from "./store/hooks";
// import Navigation from "./components/navigation/navigation";
// import axiosInstance from "./axios";
import Search from "./components/search/search";

export function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchTokenAsync());
  }, [dispatch]);

  


  return (
    <div>
      <Search />
    </div>
  );
}

export default App;
