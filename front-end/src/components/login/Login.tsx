import {useEffect, useState} from "react";
import {fetchTokenAsync, updateCredentials} from "../../store/features/spotiUserSlice.ts";
import {useAppDispatch, useAppSelector} from "../../store/hooks.ts";
import loginPageStyle from './login-page.module.css';
import SpotifyHeaderLogo from "./icons/spotify-logo.svg"
import {useNavigate} from "react-router-dom";
import validateToken from "../utils/validateToken.ts";

export function LoginPage() {
    const dispatch = useAppDispatch();
    const [clientID, setClientID] = useState<string>('');
    const [clientSecretID, setClientSecretID] = useState<string>('')
    const loggedIn = useAppSelector(s => s.spotiUserReducer.loggedIn);
    const navigate = useNavigate();
    document.title = "Spotify Login"

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

        }
    }, []);
    if (window.location.hash.includes('#')) {
        dispatch(fetchTokenAsync({}))
    }

    if(loggedIn){
        navigate('/')
    }



    return <div className={loginPageStyle['login-form-wrapper']}>

        <div className={loginPageStyle['header']}>
            <img height={70} src={SpotifyHeaderLogo} alt={'Spotify logo'}></img>
        </div>
        <h1>Log in to Spotify</h1>

        <form onSubmit={(e) => {
            e.preventDefault();
            dispatch(fetchTokenAsync({
                client_id: clientID,
                client_secret_id: clientSecretID
            }))

            localStorage.setItem('CID', `${clientID}`)
            localStorage.setItem('SID', `${clientSecretID}`)

        }}>
            <div>
                <label htmlFor="Client ID">Client ID</label>
                <input
                    required={true}
                    id={"Client ID"}
                    maxLength={255} type={'text'}
                    value={clientID}
                    autoComplete={'true'}
                    onChange={(e) => setClientID(e.target.value)}
                ></input>
            </div>

            <div>
                <label htmlFor="Client Secret ID">Client Secret ID</label>
                <input
                    id={"Client Secret ID"}
                    required={true}
                    autoComplete={'true'}
                    value={clientSecretID}
                    onChange={(e) => setClientSecretID(e.target.value)}
                    type={'password'}
                    maxLength={255}

                ></input>
            </div>


            <button type="submit">Log In</button>

        </form>
    </div>
}

export default LoginPage;