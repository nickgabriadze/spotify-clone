import axiosInstance from "../../axios.ts";

export async function removeAlbumForCurrentUser(accessToken: string, albumID: string) {


    return axiosInstance.delete(`/me/albums?ids=${albumID}`, {
        headers:{
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default removeAlbumForCurrentUser;