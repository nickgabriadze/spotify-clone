
import axiosInstance from "../axios";

export async function searchAll(query:string, accessToken: string, searchOption: string) {

    const searchStr = query.split(" ").join("%20");
    const types:{
        [key:string] : string
    } = {
        "albums": "album",
        "artists": "artist",
        "playlists": "playlist",
        "songs": "track",
        "podcasts & shows": "show%2Cepisode"
    }
    const allTypes= ["album", "artist", "playlist", "track", "show", "episode", "audiobook"].join("%2C")

    return axiosInstance.get(`/search?q=${searchStr}&type=${searchOption === "All" ? allTypes : types[searchOption.toLowerCase().toString()]}&limit=10`, {
        headers:{
            Authorization: `Bearer ${accessToken}`
        }
    })
}

