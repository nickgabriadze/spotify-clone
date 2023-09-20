import axiosInstance from "../../axios.ts";
import {EpisodeWithShow} from "../../types/episode.ts";
import {AxiosResponse} from "axios";

export function getEpisodes(accessToken: string, episodeIds: string):Promise<AxiosResponse<{episodes: EpisodeWithShow[] }>>{


    return axiosInstance.get(`/episodes?ids=${episodeIds}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default getEpisodes;