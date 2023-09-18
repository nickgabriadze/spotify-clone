
import axiosInstance from "../../axios";
import {AxiosResponse} from "axios";
import {Albums} from "../../types/album.ts";
import {Artists} from "../../types/artist.ts";
import {Playlists} from "../../types/playlist.ts";
import {Tracks} from "../../types/track.ts";
import {Shows} from "../../types/show.ts";
import {Episodes} from "../../types/episode.ts";

export async function searchAll(query:string, accessToken: string):Promise<AxiosResponse<{
    albums: Albums,
    artists: Artists,
    playlists: Playlists,
    tracks: Tracks,
    shows: Shows,
    episodes: Episodes
}>> {

    const searchStr = query.split(" ").join("%20");

    const allTypes= ["album", "artist", "playlist", "track", "show", "episode"].join("%2C")

    return axiosInstance.get(`/search?q=${searchStr}&type=${allTypes}&limit=5`, {
        headers:{
            Authorization: `Bearer ${accessToken}`
        }
    })
}

