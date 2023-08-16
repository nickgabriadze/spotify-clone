import { useEffect } from "react";
import { fetchTokenAsync } from "./store/features/spotiUserSlice";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import Navigation from "./components/navigation/navigation";

export function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTokenAsync());
  }, [dispatch]);

  const select = useAppSelector((state) => state.navigationReducer.navTo)

  console.log(select)

  return (
    <div>
      <Navigation />
    </div>
  );
}

export default App;
