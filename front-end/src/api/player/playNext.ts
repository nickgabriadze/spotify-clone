import axiosInstance from "../../axios";

export async function PlayNext(accessToken: string) {

    return axiosInstance.post('/me/player/next',{}, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default PlayNext