import { useEffect } from "react";
import { fetchTokenAsync } from "./store/features/spotiUserSlice";
import { useAppDispatch } from "./store/hooks";


export function App() {
 
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTokenAsync())

   
  }, [dispatch])

  

  return <h1>Hello!</h1>;
}

export default App;
