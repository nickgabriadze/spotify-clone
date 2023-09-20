import axiosInstance from "../../axios"
import {AxiosResponse} from "axios";
import {Albums} from "../../types/album.ts";

export async function getAlbums(searchStr:string, accessToken: string):Promise<AxiosResponse<{ albums: Albums }>>{


    const query = searchStr.split(" ").join("%20");

    return axiosInstance.get(`/search?q=${query}&type=album&limit=30`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default getAlbums;