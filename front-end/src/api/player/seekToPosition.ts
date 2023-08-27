import axiosInstance from "../../axios"

export async function SeekToPosition(accessToken:string, position: number){


    return axiosInstance.put(`/me/player/seek?position_ms=${position}`,{},{
        headers:{
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default SeekToPosition