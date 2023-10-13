import axiosInstance from "../../axios.ts";

export async function getSavedTracks(accessToken: string) {

    return await axiosInstance.get('/me/tracks', {
        headers:{
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default getSavedTracks;