import axiosInstance from "../../../axios.ts";

export async function getArtistAlbums(accessToken: string, artistID: string){

    return axiosInstance.get(`/artists/${artistID}/albums?limit=5`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default getArtistAlbums;