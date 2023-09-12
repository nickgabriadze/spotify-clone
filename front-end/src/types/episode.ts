import { Image } from "./album"
import {Show} from "./show.ts";

export interface Episodes {
    href: string,
    items: Episode[],
    limit: number,
    next: string | null,
    offset: number,
    previous: string | null,
    total: number
}



export interface Episode {
    audio_preview_url: string,
    description: string,
    duration_ms: number,
    explicit: boolean,
    external_urls: {
        spotify: string
    },
    href: string,
    html_description: string,
    id: string,
    images: Image[],
    is_externally_hosted: boolean,
    is_playable: boolean,
    language: string,
    languages: string[],
    name: string,
    release_date: string,
    release_day_precision: string,
    resume_point: {
        fully_played: boolean,
        resume_position_ms: number
    },
    type: string,
    uri: string
}
export interface EpisodeWithShow extends Episode{
    show: Show
}