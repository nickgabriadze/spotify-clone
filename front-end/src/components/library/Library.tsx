import libraryStyle from './library.module.css';
import LibrarySVG from "./icons/library.svg";
import {useAppSelector} from "../../store/hooks.ts";
import {useEffect, useRef, useState} from "react";
import {Album} from "../../types/album.ts";
import {Playlist} from "../../types/playlist.ts";
import getSavedAlbums from "../../api/library/getSavedAlbums.ts";
import getSavedPlaylists from "../../api/library/getSavedPlaylists.ts";
import LibraryItemSkeleton from "./libraryItemSkeleton.tsx";

export function Library({divHeight}: { divHeight: number }) {
    const accessToken = useAppSelector((state) => state.spotiUserReducer.spotiToken.accessToken);
    const [libData, setLibData] = useState<{
        albumItems: { added_at: string, album: Album }[],
        playlistItems: Playlist[]
    }>({
        albumItems: [],
        playlistItems: []
    })

    const [libraryLoading, setLibraryLoading] = useState<boolean>(true);


    const widthPref = useRef<HTMLParagraphElement>(null);
    const [pTagWidth, setPTagWidth] = useState<number>(150);

    useEffect(() => {

        const resize = () => {
            setPTagWidth(Number(widthPref?.current?.offsetWidth) - 90)

        }
        window.addEventListener('resize', resize);
        resize()

        return () => window.removeEventListener('resize', resize)
    }, [widthPref, pTagWidth]);

    useEffect(() => {
        const fetchPlaylistsAlbums = async () => {
            try {
                setLibraryLoading(true)
                const reqAlbums = await getSavedAlbums(accessToken);
                const albumsData = reqAlbums.data.items;
                const reqPlaylists = await getSavedPlaylists(accessToken);
                const playlistsData = reqPlaylists.data.items;

                setLibData({
                    albumItems: albumsData,
                    playlistItems: playlistsData
                })
            } catch {

            } finally {
                setLibraryLoading(false)
            }
        }

        fetchPlaylistsAlbums()
    }, [accessToken]);

    return <section className={libraryStyle['lib-wrapper']}

                    ref={widthPref}
    >
        <div className={libraryStyle['library-title']}>
            <img alt={"Library icon"} draggable={false} width={25} height={25} src={LibrarySVG}></img>
            <p>Your Library</p>
        </div>

        {/* Albums and saved playlists */}


        <div className={libraryStyle['library-stuff']}
             style={{height: divHeight}}
        >

            {libraryLoading ?
                Array.from({length: 3}).map((_, i) => <LibraryItemSkeleton key={i} />)
                :
                libData.albumItems.map(each => each.album).map((eachAlbum, i) =>
                <li
                    className={libraryStyle['listed-playlist-album']}
                    key={i}>
                    <img src={eachAlbum.images[0].url} width={50} height={50} alt={"Playlist Image"}></img>
                    <div className={libraryStyle['playlist-album-info']}>
                        <div className={libraryStyle['playlist-album-name']}><p
                            style={{width: pTagWidth}}>{eachAlbum.name}</p></div>
                        <div className={libraryStyle['type-owner']}>
                            <p style={{width: pTagWidth}}>{eachAlbum.type[0].toUpperCase().concat(eachAlbum.type.slice(1,))} • {eachAlbum.artists.map(each => each.name).join(', ')}</p>

                        </div>
                    </div>
                </li>
            )}

            {libraryLoading ?
                Array.from({length: 2}).map((_, i) => <LibraryItemSkeleton key={i} />)
                :
                libData.playlistItems.map((eachPlaylist, i) =>

                    <li
                        className={libraryStyle['listed-playlist-album']}
                        key={i}>
                        <img src={eachPlaylist.images[0].url} width={50} height={50} alt={"Playlist Image"}></img>
                        <div className={libraryStyle['playlist-album-info']}>
                            <div className={libraryStyle['playlist-album-name']}><p
                                style={{width: pTagWidth}}>{eachPlaylist.name}</p></div>
                            <div className={libraryStyle['type-owner']}>
                                <p style={{width: pTagWidth}}>{eachPlaylist.type[0].toUpperCase().concat(eachPlaylist.type.slice(1,))} • {eachPlaylist.owner.display_name}</p>

                            </div>
                        </div>
                    </li>)
            }
        </div>


    </section>
}

export default Library;