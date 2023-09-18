import axios from "axios";



export async function getRefreshedToken(refreshToken: string){

    return await axios.get("http://localhost:3001/refresh_token", {
        params: {
            "q": refreshToken
        }
    })
}


export default getRefreshedToken;