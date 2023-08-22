import axiosInstance from "../../axios";

export async function setPlaybackVolume(volume: number, accessToken: string) {


    return await axiosInstance.put(`/me/player/volume?volume_percent=${volume}`,{}, {
        headers:{
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default setPlaybackVolume;