import axiosInstance from "../../axios.ts";
import {AxiosResponse} from "axios";
import {PlaybackState} from "../../types/playbackState.ts";

export async function getPlaybackState(accessToken: string): Promise<AxiosResponse<PlaybackState>> {


    return await axiosInstance.get('/me/player', {
        headers:{
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default getPlaybackState;