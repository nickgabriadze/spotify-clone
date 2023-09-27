import axiosInstance from "../../axios.ts";

export async function getTracksAudioFeatures(accessToken: string, trackID: string){
    return await axiosInstance.get(`/audio-features/${trackID}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default getTracksAudioFeatures;