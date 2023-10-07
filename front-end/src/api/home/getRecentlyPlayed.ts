import axiosInstance from "../../axios.ts";
import {AxiosResponse} from "axios";
import {RecentlyPlayed} from "../../types/recentlyPlayed.ts";

export async function getRecentlyPlayed(accessToken: string, limit: number):Promise<AxiosResponse<RecentlyPlayed>> {


    return await axiosInstance.get(`/me/player/recently-played?limit=${limit}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default getRecentlyPlayed;