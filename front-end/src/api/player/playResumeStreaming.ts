import axiosInstance from "../../axios"
import {getDevices} from "./getDevices.ts";

export async function PlayResumeStreaming(accessToken: string, context_uri?: string, track_uris?: string[]) {

   /*
   * basically, this small function makes sure that if there is no active device found for streaming
   * the smartphone device will be checked for availability, and it will be chosen automatically
   * otherwise, nothing will happen
   */

    const getActiveDeviceID = async () => {
        const devices = await getDevices(accessToken);

        const activeDevice = devices.data.devices.filter((each) => each.is_active)
        if(activeDevice.length === 1) {
            return activeDevice[0].id;
        }else{
            const smartphoneDevice = devices.data.devices.filter((each) => each.type === "Smartphone")[0]
            if(smartphoneDevice){
                return smartphoneDevice.id
            }else{
                return 'Nothing found'
            }
        }

    }


    if (context_uri) {
        const ID = await getActiveDeviceID();
        return axiosInstance.put(`/me/player/play?device_id=${ID}`, {
            context_uri: context_uri
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": 'application/json'
            }
        })
    }
    if (track_uris) {
        const ID = await getActiveDeviceID();

        return axiosInstance.put(`/me/player/play?device_id=${ID}`, {
            uris: track_uris
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": 'application/json'
            }
        })
    }


    return axiosInstance.put("/me/player/play", {},
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })


}

export default PlayResumeStreaming