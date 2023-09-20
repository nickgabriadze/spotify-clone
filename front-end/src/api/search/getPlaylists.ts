import axiosInstance from "../../axios";
import {AxiosResponse} from "axios";
import {Playlists} from "../../types/playlist.ts";

export async function getPlaylists(searchStr: string, accessToken: string):Promise<AxiosResponse<{ playlists: Playlists }>> {

    const query = searchStr.split(" ").join("%20");

    return axiosInstance.get(`/search?q=${query}&type=playlist&limit=30`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}