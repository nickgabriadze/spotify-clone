import albumStyle from "./albumpage.module.css";
import {SimplifiedTrack} from "../../../../types/track.ts";
import {AlbumWithTracks} from "../../../../types/album.ts";
import {useEffect, useState} from "react";
import {useAppSelector} from "../../../../store/hooks.ts";
import getAlbum from "../../../../api/search/getAlbum.ts";
import getAlbumTracks from "../../../../api/home/album/getAlbumTracks.ts";
import millisecondsToHhMmSs from "../../../player/msConverter.ts";

export function AlbumPage({albumID}: { albumID: string }) {
    const [albumData, setAlbumData] = useState<{ album: AlbumWithTracks, albumTracks: SimplifiedTrack[] }>();
    const accessToken = useAppSelector(state => state.spotiUserReducer.spotiToken.accessToken);
    const [dataLoading, setDataLoading] = useState<boolean>(true);

    useEffect(() => {
        const getAlbumInformation = async () => {
            try {
                setDataLoading(true)
                const album = (await getAlbum(accessToken, albumID)).data;
                const tracks: SimplifiedTrack[] = (await getAlbumTracks(accessToken, albumID)).data.items;

                setAlbumData({
                    album: album,
                    albumTracks: tracks
                })
            } catch (err) {

            } finally {
                setDataLoading(false)
            }
        }

        getAlbumInformation()
    }, [accessToken]);


    if (!dataLoading) {

        return <section className={albumStyle['album-page-wrapper']}

        >
            <div className={albumStyle['album-main-info']}
            >
                <div className={albumStyle['album-picture']}>
                    <img alt="Album Image" draggable={false} src={albumData?.album.images[0]?.url}
                         width={albumData?.album.images[0]?.width}></img>
                </div>
                <div className={albumStyle['album-general-information']}>
                    <div>
                        <p>{albumData?.album.album_type.slice(0, 1).toUpperCase().concat(albumData?.album.album_type.slice(1,))}</p>
                        <h1>{albumData?.album.name}</h1></div>
                    <div className={albumStyle['artist-information']}>
                        <h4 className={albumStyle['artist-name-ry-nos']}>{albumData?.album.artists[0].name} • {new Date(String(albumData?.album.release_date)).getFullYear()} • {albumData?.album.total_tracks} song, </h4>
                        <p className={albumStyle['album-duration']}>{millisecondsToHhMmSs(Number(albumData?.album.tracks.items.map(e => e.duration_ms).reduce((a, b) => a + b, 0)), true)}</p>
                    </div>
                </div>
            </div>

            <div></div>
        </section>
    }
}

export default AlbumPage;