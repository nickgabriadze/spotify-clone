import {Albums} from "./album.ts";
import {Artists} from "./artist.ts";
import {Episodes} from "./episode.ts";
import {Playlists} from "./playlist.ts";
import {Shows} from "./show.ts";
import {Tracks} from "./track.ts";

export interface AllSearch{
    albums: Albums,
    artists: Artists,
    episodes: Episodes,
    playlists: Playlists,
    shows: Shows,
    tracks: Tracks
}