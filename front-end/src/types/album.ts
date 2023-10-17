import { Artist } from "./artist"
import {Tracks} from "./track.ts";

export interface Albums {
    href: string,   
    items: Album[]
    limit: number,
    next: null | string,
    offset: number,
    previous: null | string,
    total: number
}

export interface AlbumWithTracks extends  Album {
    tracks: Tracks
}

export interface Album {
    album_type: string,
    artists: Artist[]
    available_markets:string[],
    external_urls: {
        spotify: string
    },
    href: string,
    id: string,
    images: Image[],
    name: string,
    release_date: number,
    release_date_precision: string,
    total_tracks: number,
    type: string
    uri: string
}

export interface Image {
    height: number,
    url: string,
    width:number
}
