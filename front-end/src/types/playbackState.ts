import {Device} from "./device.ts";
import {Track} from "./track.ts";
import {Episode} from "./episode.ts";
import {Disallows} from "./currentlyPlaying.ts";

export interface PlaybackState {
    device: Device,
    repeat_state: string,
    shuffle_state: boolean,
    context: null | {
        type: string,
        href: string,
        external_urls: {
            spotify: string
        },
        uri: string
    },
    timestamp: number,
    progress_ms: number,
    is_playing: boolean,
    item: Track | Episode,
    currently_playing_type: string,
    actions: {
      disallows: Disallows
    }
}