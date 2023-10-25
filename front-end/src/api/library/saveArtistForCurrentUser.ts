import axiosInstance from "../../axios.ts";

export async function saveArtistForCurrentUser(accessToken: string, artistID: string) {


    return axiosInstance.put(`/me/following?type=artist&ids=${artistID}`, {}, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default saveArtistForCurrentUser;