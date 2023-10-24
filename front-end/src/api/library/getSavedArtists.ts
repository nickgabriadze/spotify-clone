import axiosInstance from "../../axios.ts";

export async function getSavedArtists(accessToken: string) {
    return await axiosInstance.get('/me/following?type=artist', {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default getSavedArtists;