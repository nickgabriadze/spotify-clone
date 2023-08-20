import { Image } from "./album"

export interface Artists{
    href: string,
    items: Artist[],
    limit: number,
    next: null | string,
    offset: number,
    previous: null | string,
    total: number
}

export interface Artist {
    external_urls: {
        spotify: string
    },
    followers: {
        href: null | string, total: number
    },
    genres: string[],
    href: string,
    id: string,
    images: Image[],
    name: string,
    popularity: number,
    type: string,
    uri: string

}