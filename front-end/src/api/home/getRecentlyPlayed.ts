import axiosInstance from "../../axios.ts";
import {AxiosResponse} from "axios";
import {RecentlyPlayed} from "../../types/recentlyPlayed.ts";

export async function getRecentlyPlayed(accessToken: string):Promise<AxiosResponse<RecentlyPlayed>> {


    return await axiosInstance.get(`/me/player/recently-played`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default getRecentlyPlayed;