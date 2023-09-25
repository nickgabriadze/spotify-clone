import axiosInstance from "../axios";
import {AxiosResponse} from "axios";
import {Categories} from "../types/categories.ts";

export async function getBrowsingCategories(accessToken: string): Promise<AxiosResponse<{ categories: Categories }>> {

    return axiosInstance.get("/browse/categories?limit=50", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
}

export default getBrowsingCategories;
