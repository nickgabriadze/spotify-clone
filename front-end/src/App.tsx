import {useEffect, useState} from "react";
import {fetchTokenAsync, setToken} from "./store/features/spotiUserSlice";
import {useAppDispatch, useAppSelector} from "./store/hooks";
import appStyle from "./app.module.css";
import Navigation from "./components/navigation/navigation";
import Player from "./components/player/player";
import Main from "./components/main/Main.tsx";
import Library from "./components/library/Library.tsx";

export function App() {
    const access = useAppSelector((state) => state.spotiUserReducer.spotiToken);

    const dispatch = useAppDispatch();
    console.log(localStorage.getItem('access_token'))
    useEffect(() => {
        if (localStorage.getItem('access_token') === undefined) {
            dispatch(fetchTokenAsync());
        }
    }, []);


    window.addEventListener('localStorageChange', () => {
        dispatch(
            setToken({
                accessToken: String(sessionStorage.getItem("access_token"))
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


    if ((access.refresh_token === 'unavailable'
            &&
            access.refresh_token === 'unavailable')
        ||
        (
            (access.accessToken === 'pending') && (access.refresh_token === 'pending')
        )
    ) {
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
