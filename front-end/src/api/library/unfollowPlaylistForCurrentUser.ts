import axiosInstance from "../../axios.ts";

export async function unfollowPlaylistForCurrentUser(accessToken: string, playlistID: string) {


    return await axiosInstance.delete(`/playlists/${playlistID}/followers`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default unfollowPlaylistForCurrentUser;