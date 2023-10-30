import axiosInstance from "../../axios.ts";

export async function followPlaylistForCurrentUser(accessToken: string, playlistID: string) {


    return await axiosInstance.put(`/playlists/${playlistID}/followers`, {}, {
        headers:{
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default followPlaylistForCurrentUser;