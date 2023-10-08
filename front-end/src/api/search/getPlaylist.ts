import {AxiosResponse} from "axios";
import {Playlist} from "../../types/playlist.ts";
import axiosInstance from "../../axios.ts";

export async function getPlayList(accessToken: string, playlistID: string):Promise<AxiosResponse<Playlist>>{

    return axiosInstance.get(`/playlists/${playlistID}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default getPlayList;