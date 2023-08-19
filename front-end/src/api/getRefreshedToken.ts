import axios from "axios";



export async function getRefreshedToken(refresToken: string){

    return await axios.get("http://localhost:3001/refresh_token", {
        params: {
            "q":refresToken
        }
    })
}


export default getRefreshedToken;