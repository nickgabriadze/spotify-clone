import axiosInstance from "../../axios.ts";

export async function getSavedAlbums(accessToken: string){

    return axiosInstance.get('/me/albums', {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default getSavedAlbums;