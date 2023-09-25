import axiosInstance from "../../axios.ts";
import {AxiosResponse} from "axios";
import {QueueType} from "../../types/queue.ts";
export async function getSongQueue(accessToken: string):Promise<AxiosResponse<QueueType>> {

    return await axiosInstance.get('/me/player/queue',  {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default getSongQueue;
