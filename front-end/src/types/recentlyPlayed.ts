import {Track} from "./track.ts";

export interface RecentlyPlayed {
    href: string,
    limit: number,
    next: string | null,
    cursors: {
        after: string,
        before: string
    },
    total: number,
    items: {
        track: Track,
        played_at: string,
        context: {
            type: 'artist' | "playlist" | "album" | "show",
            href: string,
            external_urls: {
                spotify: string
            },
            uri: string
        }
    }[]

}