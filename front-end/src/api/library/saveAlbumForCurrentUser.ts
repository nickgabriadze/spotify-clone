import axiosInstance from "../../axios.ts";

export async function saveAlbumForCurrentUser(accessToken: string, albumID: string) {


    return axiosInstance.put(`/me/albums?ids=${albumID}`, {}, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default saveAlbumForCurrentUser;