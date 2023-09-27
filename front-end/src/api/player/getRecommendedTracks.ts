import {TrackAudioFeatures} from "../../types/tracksFeatures.ts";
import axiosInstance from "../../axios.ts";
import {CurrentlyPlaying} from "../../types/currentlyPlaying.ts";
import getRelatedArtists from "../search/getRelatedArtists.ts";

export async function getRecommendedTracks(
    accessToken: string,
    currently_playing: CurrentlyPlaying | undefined,
    available_stats: TrackAudioFeatures,
) {
    console.log(currently_playing)
    const relatedArtists = await getRelatedArtists(accessToken, String(currently_playing?.item?.artists[0]?.id))
    const artistsIDs = relatedArtists.data.artists.map(each => each.id).slice(0, 5).join(',')


    const {acousticness, danceability, duration_ms, energy, instrumentalness, key, liveness, loudness, mode, speechiness, tempo, time_signature, valence} = available_stats;
    const queryString = `limit=${25}&seed_artists=${artistsIDs}&target_acousticness=${acousticness}&target_danceability=${danceability}&target_duration_ms=${duration_ms}&target_energy=${energy}&target_instrumentalness=${instrumentalness}&target_key=${key}&target_liveness=${liveness}&target_loudness=${loudness}&target_mode=${mode}&target_popularity=${Number(currently_playing?.item.popularity)}&target_speechiness=${speechiness}&target_tempo=${tempo}&target_time_signature=${time_signature}&target_valence=${valence}`


    return await axiosInstance.get(`/recommendations?${queryString}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })

}

export default getRecommendedTracks;