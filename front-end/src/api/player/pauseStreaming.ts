import axiosInstance from "../../axios"

export async function PauseStreaming(accessToken: string){
    return axiosInstance.put("/me/player/pause", {}, {
        headers:{
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default PauseStreaming