import axios from "axios";



export async function getRefreshedToken(refreshToken: string, CID: string, SID: string){

    return await axios.get("http://localhost:3001/refresh_token", {
        params: {
            "q": refreshToken,
            "cid": CID,
            "sid": SID
        }
    })
}


export default getRefreshedToken;