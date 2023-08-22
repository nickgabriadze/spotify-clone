
import axiosInstance from "../../axios";

export async function searchAll(query:string, accessToken: string) {

    const searchStr = query.split(" ").join("%20");

    const allTypes= ["album", "artist", "playlist", "track", "show", "episode", "audiobook"].join("%2C")

    return axiosInstance.get(`/search?q=${searchStr}&type=${allTypes}&limit=30`, {
        headers:{
            Authorization: `Bearer ${accessToken}`
        }
    })
}

