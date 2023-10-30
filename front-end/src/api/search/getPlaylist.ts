
import axiosInstance from "../../axios.ts";

export async function getPlayList(accessToken: string, playlistID: string){

    return axiosInstance.get(`/playlists/${playlistID}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default getPlayList;