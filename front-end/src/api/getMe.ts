import axiosInstance from "../axios";
import {AxiosResponse} from "axios";
import {Me} from "../types/me.ts";

export async function getMe(accessToken: string):Promise<AxiosResponse<Me>> {



    return axiosInstance.get('/me', {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })

}

export default getMe;