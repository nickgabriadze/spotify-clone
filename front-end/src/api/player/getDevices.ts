import axiosInstance from "../../axios";
import {AxiosResponse} from "axios";
import {Devices} from "../../types/device.ts";

export async function getDevices(accessToken: string): Promise<AxiosResponse<Devices>> {


    return await axiosInstance.get("/me/player/devices", {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}