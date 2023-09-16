import axiosInstance from "../../axios.ts";

export async function toggleShuffleOnOff(accessToken: string, state: boolean){

    return await axiosInstance.put(`/me/player/shuffle?state=${state}`, {}, {
        headers:{
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default toggleShuffleOnOff;