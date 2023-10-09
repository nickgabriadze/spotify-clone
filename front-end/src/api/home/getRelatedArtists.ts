import axiosInstance from "../../axios.ts";

export async function getArtistsRelatedArtists(accessToken: string, id: string){


    return axiosInstance.get(`/artists/${id}/related-artists`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}


export default getArtistsRelatedArtists;