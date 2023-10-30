import {Image} from "./album"
import {Track} from "./track.ts";

export interface Playlists {
    href: string,
    items: Playlist[],
    limit: number,
    next: string | null,
    offset: number,
    previous: string | null,
    total: number
}


export interface FullPlayList extends Playlist {
    followers: {
      href: string | null,
      total: number
    },
    tracks: {
        href: string,
        limit: number,
        next: string | null,
        offset: number,
        previous: string | null,
        total: number,
        items: PlayListTrackObject[]
    }
}
export interface PlayListTrackObject extends Track{
    added_at: string,
    added_by: {
        external_urls: {
            spotify: string
        },
        followers: {
            href: string,
            total: number
        },
        href: string,
        id: string,
        type: "user",
        uri: string,
    },
    is_local: boolean,
    track: Track
}

export interface Playlist {
    collaborative: boolean,
    description: string,
    external_urls: {
        spotify: string
    },
    href: string,
    id: string,
    images: Image[],
    name: string,
    owner: {
        display_name: string,
        external_urls: {
            spotify: string
        },
        href: string,
        id: string,
        type: string,
        uri: string
    },
    primary_color: null | string,
    public: null | boolean,
    snapshot_id: string,
    tracks: {
        href: string,
        total: number
    }
    type: string,
    uri: string

}