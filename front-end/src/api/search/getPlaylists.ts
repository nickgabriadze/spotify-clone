import axiosInstance from "../../axios";

export async function getPlaylists(searchStr: string, accessToken: string) {

    const query = searchStr.split(" ").join("%20");

    return axiosInstance.get(`/search?q=${query}&type=playlist&limit=30`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}