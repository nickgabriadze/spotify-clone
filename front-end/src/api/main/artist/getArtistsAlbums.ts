import axiosInstance from "../../../axios.ts";
import {Album} from "../../../types/album.ts";

export async function getArtistsAlbums(accessToken: string, artistID: string, includedGroups: string[]) {
    const dataArray = []
    try {
        for (const group of includedGroups) {
            const getAlbums = await axiosInstance.get(`/artists/${artistID}/albums?include_groups=${group}&limit=20`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            const albumData: {[key:string] : Album[]} = {[group] : getAlbums.data.items};
            if(getAlbums.data.items.length > 0){
                dataArray.push(albumData)
            }
        }
    } catch (err) {

    }

     return dataArray;
}

export default getArtistsAlbums;