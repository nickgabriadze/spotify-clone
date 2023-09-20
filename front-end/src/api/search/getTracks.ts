import axiosInstance from "../../axios";
import {AxiosResponse} from "axios";
import {Tracks} from "../../types/track.ts";

export async function getTracks(apiUrl: string, accessToken: string):Promise<AxiosResponse<{tracks: Tracks}>> {

    return axiosInstance.get(apiUrl, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
}

export default getTracks;
