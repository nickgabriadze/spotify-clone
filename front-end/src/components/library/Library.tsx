import libraryStyle from './library.module.css';
import LibrarySVG from "./icons/library.svg";
import {useAppSelector} from "../../store/hooks.ts";
import {useEffect, useState} from "react";
import {Album} from "../../types/album.ts";
import {Playlist} from "../../types/playlist.ts";
import getSavedAlbums from "../../api/library/getSavedAlbums.ts";
import getSavedPlaylists from "../../api/library/getSavedPlaylists.ts";

export function Library() {
    const accessToken = useAppSelector((state) => state.spotiUserReducer.spotiToken.accessToken);
    const [libData, setLibData] = useState<(Album | Playlist)[]>([])
    useEffect(() => {
        const fetchPlaylistsAlbums = async () => {
            try{
                 const reqAlbums = await getSavedAlbums(accessToken);
                 const albumsData = reqAlbums.data.items;
                 const reqPlaylists = await getSavedPlaylists(accessToken);
                 const playlistsData = reqPlaylists.data.items;

                setLibData([...albumsData, ...playlistsData])
            }catch{

            }finally {

            }
        }

        fetchPlaylistsAlbums()
    }, [accessToken]);



    return <section className={libraryStyle['lib-wrapper']}>
        <div className={libraryStyle['library-title']}>
            <img alt={"Library icon"} draggable={false} width={25} height={25} src={LibrarySVG}></img>
            <p>Your Library</p>
        </div>
    </section>
}

export default Library;