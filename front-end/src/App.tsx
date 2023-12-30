import {useEffect, useState} from "react";
import {setToken, setWindowFullScreen} from "./store/features/spotiUserSlice";
import {useAppDispatch, useAppSelector} from "./store/hooks";
import appStyle from "./app.module.css";
import Navigation from "./components/navigation/navigation";
import Player from "./components/player/player";
import Main from "./components/main/Main.tsx";
import Library from "./components/library/Library.tsx";
import FullScreen from "./components/full-screen/FullScreen.tsx";
import {useExistingToken} from "./useExistingToken.ts";


export function App() {
    const loggedIn = useAppSelector((state) => state.spotiUserReducer.loggedIn);
    const userControlActions = useAppSelector(s => s.navigationReducer.userControlActions);
    useExistingToken()
    const dispatch = useAppDispatch();

    useEffect(() => {
        const handleLocalStorageChange = () => {


            dispatch(
                setToken({
                    accessToken: String(localStorage.getItem("access_token"))
                })
            );
        }


        window.addEventListener('localStorageChange', handleLocalStorageChange);

        return () => window.removeEventListener('localStorageChange', handleLocalStorageChange);
    }, []);


    useEffect(() => {
        if (userControlActions[userControlActions.length - 1] === "USER_LOGOUT") {
            localStorage.clear();

        }
    }, [userControlActions.length]);

    const [windowInnerHeight, setWindowInnerHeight] = useState<number>(window.innerHeight - 120);
    const currentlyPlaying = useAppSelector(s => s.navigationReducer.currentSongData);
    useEffect(() => {

        const updateWindowDimensions = () => {
            const newHeight = window.innerHeight;
            setWindowInnerHeight(newHeight - 120);


            if (window.innerHeight === screen.height) {
                dispatch(setWindowFullScreen(true))
            } else {
                dispatch(setWindowFullScreen(false))
            }
        };

        window.addEventListener("resize", updateWindowDimensions);

        return () => window.removeEventListener("resize", updateWindowDimensions)

    }, []);




    if (loggedIn) {

        {

            return (
                <>
                    <FullScreen currentlyPlayingSong={currentlyPlaying}/>
                    <div className={appStyle["application-wrapper"]}
                    >

                        <div className={appStyle['nav-lib-main-wrapper']}

                        >
                            <div className={appStyle['nav-lib-wrapper']}
                                 style={{height: windowInnerHeight}}

                            >
                                <Navigation/>
                                <Library divHeight={windowInnerHeight - 193}/>
                            </div>
                            <div className={appStyle['main']}
                            ><Main height={windowInnerHeight}/></div>
                        </div>

                        <Player/>

                    </div>
                </>
            );
        }

    }

}

export default App;
