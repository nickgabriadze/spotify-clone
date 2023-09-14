import axiosInstance from "../../axios.ts";

export async function switchActiveDevice(accessToken: string, deviceID: string, state: boolean) {


    return axiosInstance.put('/me/player', {
        device_ids: [deviceID],
        play: state
    }, {

        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default switchActiveDevice;