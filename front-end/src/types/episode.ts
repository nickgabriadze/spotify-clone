import { Image } from "./album"

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
    langauge: string,
    languages: string[],
    name: string,
    release_date: string,
    release_day_precision: string,
    resume_point: {
        fully_played: boolean,
        resiume_position_ms: number
    },
    type: string,
    uri: string
}