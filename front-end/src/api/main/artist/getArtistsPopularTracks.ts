import axiosInstance from "../../../axios.ts";

export async function getArtistsPopularTracks(accessToken: string, artistID: string, countryID: string) {


    return await axiosInstance.get(`/artists/${artistID}/top-tracks?market=${countryID === undefined ? 'GE' : countryID }`, {
        headers:{
            Authorization:`Bearer ${accessToken}`
        }
    })
}

export default getArtistsPopularTracks;