import {Track} from "./track.ts";

export interface QueueType {
    currently_playing:  Track,
    queue: Track[]
}