import axiosInstance from "../../axios";

export async function setPlayerPosition(pos:number, accessToken: string) {


    return axiosInstance.put(`/me/player/seek?position_ms=${pos}`, {}, {
        headers:{
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default setPlayerPosition