import { useEffect } from "react";
import { fetchTokenAsync } from "./store/features/spotiUserSlice";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import axiosInstance from "./axios";


export function App() {
 
  const dispatch = useAppDispatch();
  const access = useAppSelector((state) => state.spotiUserReducer.spotiToken).access_token

  useEffect(() => {
    dispatch(fetchTokenAsync())
  }, [dispatch])

  useEffect(() => {
   
    if (access !== '' && access !== 'pending') {
    axiosInstance.get(('/artists/22bE4uQ6baNwSHPVcDxLCe'), {
      headers:{
        Authorization: `Bearer ${access}`
      }
    }).then((res) => {
      console.log(res)
    })
  }

   
  }, [access])

  

  return <h1>Hello!</h1>;
}

export default App;
