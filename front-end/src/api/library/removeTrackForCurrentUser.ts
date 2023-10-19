import axiosInstance from "../../axios.ts";

export async function removeTrackForCurrentUser(accessToken: string, trackID: string){

    return await axiosInstance.delete(`/me/tracks?ids=${trackID}`,  {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default removeTrackForCurrentUser;