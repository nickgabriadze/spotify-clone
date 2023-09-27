import axiosInstance from "../../axios.ts";
import {Track} from "../../types/track.ts";


export async function addToQueueRecursive(accessToken: string, tracks: Track[]) {
    if (tracks.length !== 0) {
        const req = await addTracksToQueue(accessToken, tracks[0].uri)
        const success = req.status === 204;
        if (success) {
            return addToQueueRecursive(accessToken, tracks.slice(1,))
        } else {
            return
        }
    } else {
        return "All Done"
    }


}

export async function addTracksToQueue(accessToken: string, trackUri: string) {

    return await axiosInstance.post(`/me/player/queue?uri=${trackUri}`, {}, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default addTracksToQueue;