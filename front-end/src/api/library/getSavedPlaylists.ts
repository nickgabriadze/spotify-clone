import axiosInstance from "../../axios.ts";
import {AxiosResponse} from "axios";
import {Playlists} from "../../types/playlist.ts";

export async function getSavedPlaylists(accessToken: string):Promise<AxiosResponse<Playlists>>{

    return axiosInstance.get('/me/playlists', {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default getSavedPlaylists;