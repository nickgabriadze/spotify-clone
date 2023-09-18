import axiosInstance from "../../axios";
import {AxiosResponse} from "axios";
import {CurrentlyPlaying} from "../../types/currentlyPlaying.ts";

export async function getCurrentlyPlaying(accessToken: string):Promise<AxiosResponse<CurrentlyPlaying>> {


    return await axiosInstance.get('/me/player/currently-playing', {
        headers:{
            Authorization: `Bearer ${accessToken}`
        }
    })
}