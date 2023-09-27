export interface TrackAudioFeatures {
    "acousticness": number, // 0 - 1
    "analysis_url": string,
    "danceability": number, // 0 - 1
    "duration_ms": number,
    "energy": number, // 0 - 1
    "id": string,
    "instrumentalness": number, // 0 - 1 ,
    "key": number, // -1 - 11
    "liveness": number, // 0 - 0.8 (>0.8 live),
    "loudness": number, // -60 - 0,
    "mode": number, // Major - 1, Minor - 0
    "speechiness": number, // 0 - 1 (> 0.66 spoken, 0.33 < music and speech < 0.66, < 0.33 likely to be only music
    "tempo": number,
    "time_signature": number,//max 11
    "track_href": string,
    "type": "audio_features",
    "uri": string,
    "valence": number, // 0 - 1
}