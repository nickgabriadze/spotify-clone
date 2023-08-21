import axiosInstance from "../axios";

export async function getDevices(accessToken: string) {


    return axiosInstance.get("/me/player/devices", {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}