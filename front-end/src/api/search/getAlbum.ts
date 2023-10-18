import {AxiosResponse} from "axios";
import {AlbumWithTracks} from "../../types/album.ts";
import axiosInstance from "../../axios.ts";

export async function getAlbum(accessToken: string, albumID: string):Promise<AxiosResponse<AlbumWithTracks>>{
    return axiosInstance.get(`/albums/${albumID}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default getAlbum;