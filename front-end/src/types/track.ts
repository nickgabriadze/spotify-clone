import { Album } from "./album";
import {Artist, SimplifiedArtist} from "./artist";

export interface Tracks {
  href: string;
  items: Track[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
}

export interface SimplifiedTrack {
  artists: SimplifiedArtist[],
  available_markets: string[],
  disc_number: number,
  duration_ms: number,
  explicit: boolean,
  external_urls:{
    spotify: string
  },
  href: string,
  id: string,
  is_playable: boolean,
  restrictions:{
    reason: 'market' | 'product' | 'explicit'
  },
  name: string,
  preview_url: string | null,
  track_number: number,
  type: string,
  uri: string,
  is_local: boolean
}

export interface Track {
  album: Album;
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: {
    isrc: string;
  };
  external_urls: {
    spotify: string
  };
  href: string,
  id: string,
  is_local?: boolean,
  name: string,
  popularity: number,
  preview_url: string,
  track_number: number,
  type: string,
  uri: string
}
