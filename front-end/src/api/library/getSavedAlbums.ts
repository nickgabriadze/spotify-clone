import axiosInstance from "../../axios.ts";
import {AxiosResponse} from "axios";
import {Albums} from "../../types/album.ts";

export async function getSavedAlbums(accessToken: string): Promise<AxiosResponse<Albums>>{

    return axiosInstance.get('/me/albums', {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default getSavedAlbums;