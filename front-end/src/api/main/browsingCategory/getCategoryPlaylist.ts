import axiosInstance from "../../../axios.ts";

export async function getCategoryPlaylist(accessToken: string, ID: string) {


    return await axiosInstance.get(`/browse/categories/${ID}/playlists`, {
        headers:{
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default getCategoryPlaylist;