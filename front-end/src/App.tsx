import {useEffect, useState} from "react";
import {setToken, updateCredentials} from "./store/features/spotiUserSlice";
import {useAppDispatch, useAppSelector} from "./store/hooks";
import appStyle from "./app.module.css";
import Navigation from "./components/navigation/navigation";
import Player from "./components/player/player";
import Main from "./components/main/Main.tsx";
import Library from "./components/library/Library.tsx";
import validateToken from "./components/utils/validateToken.ts";
import {useNavigate} from "react-router-dom";
import FullScreen from "./components/full-screen/FullScreen.tsx";


export function App() {
    const loggedIn = useAppSelector((state) => state.spotiUserReducer.loggedIn);
    const userControlActions = useAppSelector(s => s.navigationReducer.userControlActions);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    window.addEventListener('localStorageChange', () => {

        dispatch(
            setToken({
                accessToken: String(localStorage.getItem("access_token"))
            })
        );
    })


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

        };

        window.addEventListener("resize", updateWindowDimensions);

        return () => window.removeEventListener("resize", updateWindowDimensions)

    }, []);


    useEffect(() => {
        if (localStorage.getItem('access_token')
            &&
            localStorage.getItem('refresh_token')
        ) {
            const updateAccessToken = async () => {

                const newToken = await validateToken();

                dispatch(updateCredentials({
                        access_token: newToken,
                        refresh_token: String(localStorage.getItem('refresh_token')),
                        issued_at: Number(localStorage.getItem('issued_at'))
                    }
                ))
            }

            updateAccessToken();

        } else {
            navigate("/welcome")
        }
    }, []);

    const [fullScreen, setFullScreen] = useState<boolean>(false);

    useEffect(() => {
        const handleFullScreen = () => {
            console.log('we are in full screen')
            if (window.innerHeight === screen.height) {
                setFullScreen(true)
            } else {
                setFullScreen(false)
            }
        }
        window.addEventListener('resize', handleFullScreen);

        return () => window.removeEventListener('resize', handleFullScreen);
    }, []);


    if (loggedIn) {

        if (fullScreen) {
            return <FullScreen currentlyPlayingSong={currentlyPlaying}/>
        } else {

            return (
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
            );
        }

    }

}

export default App;
