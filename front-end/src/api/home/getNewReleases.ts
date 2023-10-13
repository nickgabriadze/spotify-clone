import axiosInstance from "../../axios.ts";

export async function getNewReleases(accessToken: string, countryCode: string | undefined) {


    return axiosInstance.get(`/browse/new-releases?country=${countryCode}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default getNewReleases;