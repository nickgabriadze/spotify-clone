import axiosInstance from "../../axios.ts";
import {AxiosResponse} from "axios";
import {Artist} from "../../types/artist.ts";

export async function getRelatedArtists(accessToken: string, artistID: string):Promise<AxiosResponse<{ artists: Artist[] }>> {


    return await axiosInstance.get(`/artists/${artistID}/related-artists`, {
        headers: {Authorization: `Bearer ${accessToken}`}
    })

}

export default getRelatedArtists;