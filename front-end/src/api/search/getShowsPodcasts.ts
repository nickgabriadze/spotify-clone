import axiosInstance from "../../axios";
import {AxiosResponse} from "axios";
import {Shows} from "../../types/show.ts";
import {Episodes} from "../../types/episode.ts";

export async function getShowsPodcasts(accessToken: string, query: string): Promise<AxiosResponse<{
    shows: Shows,
    episodes: Episodes
}>> {
    const searching = query.split(" ").join("%20");

    return axiosInstance.get(
        `/search?q=${searching}&type=show%2Cepisode&limit=30`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );
}

export default getShowsPodcasts;
