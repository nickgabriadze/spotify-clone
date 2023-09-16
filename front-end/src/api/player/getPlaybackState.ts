import axiosInstance from "../../axios.ts";

export async function getPlaybackState(accessToken: string) {


    return await axiosInstance.get('/me/player', {
        headers:{
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default getPlaybackState;