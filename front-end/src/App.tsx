import {useEffect, useState} from "react";
import {fetchTokenAsync, setToken} from "./store/features/spotiUserSlice";
import {useAppDispatch} from "./store/hooks";
import appStyle from "./app.module.css";
import Navigation from "./components/navigation/navigation";
import Player from "./components/player/player";
import Main from "./components/main/Main.tsx";
import Library from "./components/library/Library.tsx";

export function App() {
    const dispatch = useAppDispatch();

    useEffect(() => {
            if(!(sessionStorage.getItem('access_token'))) {
                dispatch(fetchTokenAsync());
            }

    }, []);


    window.addEventListener('sessionStorageChange', () => {
        dispatch(
            setToken({
                accessToken: String(sessionStorage.getItem("accessToken"))
            })
        );
    })


    const [windowInnerHeight, setWindowInnerHeight] = useState<number>(window.innerHeight - 120);

    useEffect(() => {

        const updateWindowDimensions = () => {
            const newHeight = window.innerHeight;
            setWindowInnerHeight(newHeight - 120);

        };

        window.addEventListener("resize", updateWindowDimensions);

        return () => window.removeEventListener("resize", updateWindowDimensions)

    }, []);


    if (!(sessionStorage.getItem('access_token') && sessionStorage.getItem('refresh_token'))) {

        return (

            <img
                className={appStyle["loading-anim"]}
                src={"/spotify_web.png"}
                width={100}
                height={100}
                alt={"Loading animation"}
            ></img>

        );
    } else {

        return (
            <div className={appStyle["application-wrapper"]}>
                <div className={appStyle['nav-lib-main-wrapper']}
                >
                    <div className={appStyle['nav-lib-wrapper']}
                         style={{height: windowInnerHeight}}
                    >
                        <Navigation/>
                        <Library divHeight={windowInnerHeight - 133}/>
                    </div>
                    <div className={appStyle['main']}><Main height={windowInnerHeight}/></div>
                </div>

                <Player/>

            </div>
        );
    }


}

export default App;
