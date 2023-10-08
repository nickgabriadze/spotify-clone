import axiosInstance from "../../axios.ts";
import {AxiosResponse} from "axios";
import {Artist} from "../../types/artist.ts";

export async function getArtist(accessToken: string, artistID: string):Promise<AxiosResponse<Artist>>{


    return axiosInstance.get(`/artists/${artistID}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default getArtist;