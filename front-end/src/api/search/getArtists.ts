import axiosInstance from "../../axios"
import {AxiosResponse} from "axios";
import {Artists} from "../../types/artist.ts";

export async function getArtists(searchStr:string, accessToken: string):Promise<AxiosResponse<Artists>>{


    const query = searchStr.split(" ").join("%20");

    return axiosInstance.get(`/search?q=${query}&type=artist&limit=30`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default getArtists;