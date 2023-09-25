import {Track} from "./track.ts";
import {Episode} from "./episode.ts";

export interface QueueType {
    currently_playing:  Track,
    queue: Track[] | Episode[]
}