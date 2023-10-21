import axiosInstance from "../../../axios.ts";


export async function getAlbumTracks(accessToken: string, ID: string){



    return await axiosInstance.get(`/albums/${ID}/tracks`, {
        headers:{
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default getAlbumTracks;