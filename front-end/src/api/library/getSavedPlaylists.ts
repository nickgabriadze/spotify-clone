import axiosInstance from "../../axios.ts";

export async function getSavedPlaylists(accessToken: string){

    return axiosInstance.get('/me/playlists', {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default getSavedPlaylists;