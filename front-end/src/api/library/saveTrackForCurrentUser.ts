import axiosInstance from "../../axios.ts";

export async function saveTrackForCurrentUser(accessToken: string, trackID: string){

    return await axiosInstance.put(`/me/tracks?ids=${trackID}`, {}, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default saveTrackForCurrentUser