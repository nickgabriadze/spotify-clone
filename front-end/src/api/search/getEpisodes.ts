import axiosInstance from "../../axios.ts";
import {Episodes} from "../../types/episode.ts";
import {AxiosResponse} from "axios";

export function getEpisodes(accessToken: string, episodeIds: string):Promise<AxiosResponse<Episodes>>{


    return axiosInstance.get(`/episodes?ids=${episodeIds}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default getEpisodes;