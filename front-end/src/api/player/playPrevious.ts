import axiosInstance from "../../axios";

export async function PlayPrevious(accessToken: string) {

    return axiosInstance.post('/me/player/previous',{}, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default PlayPrevious