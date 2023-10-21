import axiosInstance from "../../../axios.ts";

export async function getFeaturedInCountry(accessToken: string, countryCode: string | undefined) {

    return axiosInstance.get(`/browse/featured-playlists?country=${countryCode}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default getFeaturedInCountry;