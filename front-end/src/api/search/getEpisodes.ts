import axiosInstance from "../../axios.ts";

export function getEpisodes(accessToken: string, episodeIds: string){


    return axiosInstance.get(`/episodes?ids=${episodeIds}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default getEpisodes;