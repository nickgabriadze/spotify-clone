import { Image } from "./album"

export interface Shows {
    href: string,
    items: Show[],
    limit: number,
    next: string,
    offset: number,
    previous: string | null,
    total: number
}

export interface Show {
    available_markets: string[],
    copyrights: [],
    description: string,
    explicit: boolean,
    external_urls: {
        spotify: string
    },
    href: string,
    html_description: string,
    id: string,
    images: Image[],
    is_externally_hosted: boolean,
    languages: string[],
    media_type: string,
    name: string,
    publisher: string,
    total_episodes: number,
    type: string,
    uri: string
}