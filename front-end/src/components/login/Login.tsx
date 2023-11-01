import {useState} from "react";
import {fetchTokenAsync} from "../../store/features/spotiUserSlice.ts";
import {useAppDispatch} from "../../store/hooks.ts";
import appStyle from "../../app.module.css"

export function LoginPage() {
    const dispatch = useAppDispatch();
    const [clientID, setClientID] = useState<string>('');
    const [clientSecretID, setClientSecretID] = useState<string>('')


    if (window.location.hash.includes("#")) {
        dispatch(fetchTokenAsync({}))

        return (

            <img
                className={appStyle["loading-anim"]}
                src={"/spotify_web.png"}
                width={100}
                height={100}
                alt={"Loading animation"}
            ></img>

        );
    }


    return <div><h1>hello, log in</h1>
        <input style={{color: 'white', border: '1px solid red'}}

               onChange={(e) => setClientID(e.target.value)}
        ></input> <input

            onChange={(e) => setClientSecretID(e.target.value)}
            style={{color: 'white', border: '1px solid red'}}></input>
        <button style={{color: 'white'}}
                onClick={async () =>
                    dispatch(fetchTokenAsync({
                        client_id: clientID,
                        client_secret_id: clientSecretID
                    }))
                }

        >Submit
        </button>
    </div>
}

export default LoginPage;