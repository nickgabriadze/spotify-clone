import axiosInstance from "../../axios.ts";
import {AxiosResponse} from "axios";
import {Album} from "../../types/album.ts";

export async function getSavedAlbums(accessToken: string): Promise<AxiosResponse<
    {
        href: string,
        items: { added_at: string, album: Album }[],
        limit: number,
        next: null | string,
        offset: number,
        previous: null | string,
        total: number;
    }>>{

    return await axiosInstance.get('/me/albums', {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default getSavedAlbums;