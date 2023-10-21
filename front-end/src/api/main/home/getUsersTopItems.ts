import axiosInstance from "../../../axios.ts";

export async function getUsersTopItems(accessToken: string, type: 'artists' | 'tracks', time_range: 'short_term' | 'medium_term' | 'long_term', limit: number) {


    return await axiosInstance.get(`/me/top/${type}?time_range=${time_range}&limit=${limit}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default getUsersTopItems;