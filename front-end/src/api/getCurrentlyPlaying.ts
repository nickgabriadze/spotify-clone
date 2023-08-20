import axiosInstance from "../axios";

export async function getCurrentlyPlaying(accessToken: string) {


    return await axiosInstance.get('/me/player/currently-playing', {
        headers:{
            Authorization: `Bearer ${accessToken}`
        }
    })
}