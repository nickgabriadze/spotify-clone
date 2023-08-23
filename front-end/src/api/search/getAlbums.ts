import axiosInstance from "../../axios"

export async function getAlbums(searchStr:string, accessToken: string){


    const query = searchStr.split(" ").join("%20");

    return axiosInstance.get(`/search?q=${query}&type=album&limit=30`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default getAlbums;