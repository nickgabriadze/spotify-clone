import libraryStyle from './library.module.css';
import LibrarySVG from "./icons/library.svg";
import {useAppSelector} from "../../store/hooks.ts";
import {useEffect, useRef, useState} from "react";
import {Album} from "../../types/album.ts";
import {Playlist} from "../../types/playlist.ts";
import getSavedAlbums from "../../api/library/getSavedAlbums.ts";
import getSavedPlaylists from "../../api/library/getSavedPlaylists.ts";

export function Library() {
    const accessToken = useAppSelector((state) => state.spotiUserReducer.spotiToken.accessToken);
    const [libData, setLibData] = useState<{albumItems: Album[], playlistItems: Playlist[]}>({
        albumItems: [],
        playlistItems: []
    })

    const [pTagWidth, setPTagWidth] = useState<number>(150);



    const widthPref = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const resize = () => {
            setPTagWidth(Number(widthPref?.current?.offsetWidth))
        }
        window.addEventListener('resize', resize);

        return () => window.removeEventListener('resize', resize)

    }, [widthPref]);

    useEffect(() => {
        const fetchPlaylistsAlbums = async () => {
            try{
                 const reqAlbums = await getSavedAlbums(accessToken);
                 const albumsData = reqAlbums.data.items;
                 const reqPlaylists = await getSavedPlaylists(accessToken);
                 const playlistsData = reqPlaylists.data.items;

                setLibData({
                    albumItems: albumsData,
                    playlistItems: playlistsData
                })
            }catch{

            }finally {

            }
        }

        fetchPlaylistsAlbums()
    }, [accessToken]);

    console.log(pTagWidth-100)

    return <section className={libraryStyle['lib-wrapper']}
    ref={widthPref}
    >
        <div className={libraryStyle['library-title']}>
            <img alt={"Library icon"} draggable={false} width={25} height={25} src={LibrarySVG}></img>
            <p>Your Library</p>
        </div>

        {/* Albums and saved playlists */}
        <div className={libraryStyle['library-stuff']}>

            {
                libData.playlistItems.map((eachPlaylist,i) => <div
                    className={libraryStyle['listed-playlist-album']}
                    key={i}>
                    <img src={eachPlaylist.images[0].url} width={50} height={50} alt={"Playlist Image"}></img>
                    <div className={libraryStyle['playlist-album-info']}>
                        <div className={libraryStyle['playlist-album-name']}><p style={{width: pTagWidth - 100}}>{eachPlaylist.name}</p></div>
                        <div className={libraryStyle['type-owner']}>
                            <p>{eachPlaylist.type[0].toUpperCase().concat(eachPlaylist.type.slice(1, ))}</p>
                            •
                            <p>{eachPlaylist.owner.display_name}</p>
                        </div>
                    </div>
                </div>)
            }
        </div>
    </section>
}

export default Library;