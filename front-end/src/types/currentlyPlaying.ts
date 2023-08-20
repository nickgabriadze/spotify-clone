import { Album } from "./album"
import { Artist } from "./artist"

export interface CurrentlyPlaying {
    actions: {
        disallows: {
            resuming: boolean,
            toggling_repeat_context: boolean,
            toggling_repeat_track: boolean,
            toggling_shuffle: boolean
        }
    },
    context: null | {
        type: string,
        href: string,
        external_urls: {
            spotify: string
        },
        uri: string
    },
    currently_playing: string,
    is_playing: boolean,
    item: {
        album: Album,
        artists: Artist[],
        available_markets: string[],
        disc_number: number,
        duration_ms: number,
        explicit: boolean,
        external_ids: {isrc: string},
        external_urls:{
            spotify: string
        },
        href: string,
        id: string,
        is_local: boolean,
        name: string,
        popularity: number,
        preview_url: string,
        track_number: number,
        type: string,
        uri: string,
    },
    progress_ms: number,
    timestamp: number
}