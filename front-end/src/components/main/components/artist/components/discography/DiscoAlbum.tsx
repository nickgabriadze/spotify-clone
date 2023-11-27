import {Album} from "../../../../../../types/album.ts";
import {Track} from "../../../../../../types/track.ts";
import {useEffect, useState} from "react";
import {useAppSelector} from "../../../../../../store/hooks.ts";
import getAlbumTracks from "../../../../../../api/main/album/getAlbumTracks.ts";
import {SongCard} from "../../../../../search/reuseables/songCard.tsx";

export function DiscoAlbum({album}: { album: Album }) {
    const [albumTracks, setAlbumTracks] = useState<Track[]>([]);
    const accessToken = useAppSelector(s => s.spotiUserReducer.spotiToken.accessToken);
    const [tracksLoading, setTracksLoading] = useState<boolean>(true);
    useEffect(() => {
        const fetchTracks = async () => {
            try {
                setTracksLoading(true)
                const tracks = (await getAlbumTracks(accessToken, album?.id)).data.items;
                console.log(tracks)
                setAlbumTracks(tracks)
            } catch (_) {
            } finally {
                setTracksLoading(false)

            }
        }

        fetchTracks()
    }, [accessToken, album.id]);

    if (tracksLoading) {
        return
    }

    return <section>
        <div>
            {/* album details will go here*/}
        </div>
        <div>{albumTracks.map((t, i) => <SongCard eachTrack={t} n={i + 1} accessToken={accessToken}
                                                  forAlbum={true}/>)}</div>
    </section>
}