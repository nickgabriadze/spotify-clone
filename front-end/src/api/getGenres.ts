import axiosInstance from "../axios";
import {AxiosResponse} from "axios";

export async function getGenres(accessToken: string): Promise<AxiosResponse<{ genres: string[] }>> {

    return axiosInstance.get("/recommendations/available-genre-seeds", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
}

export default getGenres;
