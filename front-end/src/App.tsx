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

        }else{
             navigate("/welcome")
        }
    }, []);

    if (loggedIn) {


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

export default App;
