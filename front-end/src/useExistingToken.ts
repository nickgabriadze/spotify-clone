import {useEffect} from "react";
import validateToken from "./components/utils/validateToken.ts";
import {updateCredentials} from "./store/features/spotiUserSlice.ts";
import {useAppDispatch} from "./store/hooks.ts";
import {useNavigate} from "react-router-dom";

export function useExistingToken() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate()
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
            navigate('/welcome')
        }


    }, [navigate])
}