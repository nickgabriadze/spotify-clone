import {Album} from "../../../../../../types/album.ts";
import {Track} from "../../../../../../types/track.ts";
import {useEffect, useState} from "react";
import {useAppSelector} from "../../../../../../store/hooks.ts";
import getAlbumTracks from "../../../../../../api/main/album/getAlbumTracks.ts";
import {SongCard} from "../../../../../search/reuseables/songCard.tsx";
import discographyStyle from './discography.module.css';
import {Link} from "react-router-dom";
import PlayButtonIcon from "./../../../../../player/icons/play.svg"
import HeartIcon from "./../../../../../player/icons/heart.svg"
import albumStyle from './../../../album/albumpage.module.css'
import HeartFilledIcon from './../../../../../player/icons/liked-indicator-heart.svg'
import Duration from "../../../../../search/components/each-search-component/icons/duration.svg";
import playResumeStreaming from "../../../../../../api/player/playResumeStreaming.ts";

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

    return <section className={discographyStyle['disco-album-wrapper']}>
        <div className={discographyStyle['disco-album-info']}>
            <div className={discographyStyle['disco-album-image']}>
                <img src={album?.images[0]?.url} alt={"Album image"}></img>
            </div>
            <div className={discographyStyle['disco-meta']}>
                <div className={discographyStyle['disco-meta-heading']}>
                    <Link to={`/album/${album.id}`}><h1>{album.name}</h1></Link>
                    <p>{album.album_type[0].toUpperCase().concat(album.album_type.slice(1,))} • {new Date(album.release_date).getFullYear()} • {albumTracks.length} {albumTracks.length > 1 ? 'songs' : 'song'}</p>
                </div>

                <div className={discographyStyle['disco-meta-buttons']}>
                    <button onClick={async() => await playResumeStreaming(accessToken, album.uri, undefined)}><img alt={"Play icon"} className={discographyStyle['disco-button-play']} src={PlayButtonIcon}
                                 width={38} height={38}></img></button>
                    <img alt={"Save icon"} src={HeartIcon} width={28} height={28}></img>
                </div>
            </div>
        </div>
        <div className={discographyStyle['disco-tracks-wrapper']}>
            <nav className={discographyStyle['numbering-title-duration']}>
                <div className={discographyStyle['i-title']}>
                    <p>#</p>
                    <p>Title</p>

                </div>

                <div>
                    <img
                        src={Duration}
                        draggable={false}
                        width={20}
                        height={20}
                        alt="Duration"
                        style={{marginBottom: "-5px"}}
                    ></img>
                </div>
            </nav>
            <div>{albumTracks.map((t, i) => <SongCard eachTrack={t} n={i + 1} accessToken={accessToken}
                                                      forAlbum={true}/>)}</div>
        </div>
    </section>
}