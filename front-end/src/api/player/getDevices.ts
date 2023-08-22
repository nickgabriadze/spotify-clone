import axiosInstance from "../../axios";

export async function getDevices(accessToken: string) {


    return await axiosInstance.get("/me/player/devices", {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}