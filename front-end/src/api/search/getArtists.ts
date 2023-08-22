import axiosInstance from "../../axios"

export async function getArtists(searchStr:string, accessToken: string){


    const query = searchStr.split(" ").join("%20");

    return axiosInstance.get(`/search?q=${query}&type=artist&limit=30`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default getArtists;