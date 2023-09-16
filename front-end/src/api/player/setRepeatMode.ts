import axiosInstance from "../../axios.ts";

export async function setRepeatMode(accessToken: string, mode: 'track' | 'context' | 'off') {

    return await axiosInstance.put(`/me/player/repeat?state=${mode}`, {},
        {
            headers:
                {
                    Authorization: `Bearer ${accessToken}`
                }
        })
}

export default setRepeatMode;