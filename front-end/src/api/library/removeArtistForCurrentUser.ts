import axiosInstance from "../../axios.ts";

export async function removeArtistForCurrentUser(accessToken: string, artistID: string) {


    return axiosInstance.delete(`/me/following?type=artist&ids=${artistID}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default removeArtistForCurrentUser;