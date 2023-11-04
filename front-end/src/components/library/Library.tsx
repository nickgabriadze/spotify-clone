import libraryStyle from './library.module.css';
import LibrarySVG from "./icons/library.svg";
import {useAppDispatch, useAppSelector} from "../../store/hooks.ts";
import {useEffect, useRef, useState} from "react";
import {Album} from "../../types/album.ts";
import {Playlist} from "../../types/playlist.ts";
import getSavedAlbums from "../../api/library/getSavedAlbums.ts";
import getSavedPlaylists from "../../api/library/getSavedPlaylists.ts";
import LibraryItemSkeleton from "./libraryItemSkeleton.tsx";
import getSavedTracks from "../../api/library/getSavedTracks.ts";
import HeartIcon from "./icons/saved-songs-icon.png";
import {
    setUserSavedAlbumIDs,
    setUserSavedArtistIDs, setUserSavedPlaylistIDs,
    setUsersSavedSongIDs
} from "../../store/features/spotiUserSlice.ts";
import {Track} from "../../types/track.ts";
import {addReactComponentToNavigation} from "../../store/features/navigationSlice.ts";
import getSavedArtists from "../../api/library/getSavedArtists.ts";
import PlayResumeStreaming from "../../api/player/playResumeStreaming.ts";
import Active from "./icons/lib-active.svg";
import {Artist} from "../../types/artist.ts";

export function Library({divHeight}: { divHeight: number }) {
    const accessToken = useAppSelector((state) => state.spotiUserReducer.spotiToken.accessToken);
    const [libData, setLibData] = useState<{
        albumItems: { added_at: string, album: Album }[],
        playlistItems: Playlist[]
    }>({
        albumItems: [],
        playlistItems: []
    })
    const [filteringOptions, setFilteringOptions] = useState<{ type: string, chosen: boolean }[]>([])
    const me = useAppSelector(me => me.spotiUserReducer.userInformation);
    const [likedSongsAvailable, setLikedSongsAvailable] = useState<number>(0)
    const [libraryLoading, setLibraryLoading] = useState<boolean>(true);
    const libraryActions = useAppSelector(s => s.navigationReducer.libraryActions);
    const currentlyPlaying = useAppSelector(s => s.navigationReducer.currentlyPlayingSong);
    const [useSavedTracks, setUserSavedTracks] = useState<{
        added_at: string,
        track: Track
    }[]>([])
    const [savedArtists, setSavedArtists] = useState<Artist[]>([])
    const widthPref = useRef<HTMLParagraphElement>(null);
    const [pTagWidth, setPTagWidth] = useState<number>(150);


    const dispatch = useAppDispatch()
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


                const reqAlbums = await getSavedAlbums(accessToken);
                const albumsData = reqAlbums.data.items;
                const savedArtists = await getSavedArtists(accessToken);

                const reqPlaylists = await getSavedPlaylists(accessToken);
                const playlistsData = reqPlaylists.data.items;
                const savedSongItems: {
                    added_at: string,
                    track: Track
                }[] = (await getSavedTracks(accessToken)).data.items;

                dispatch(setUserSavedArtistIDs(savedArtists.data.artists.items))
                dispatch(setUserSavedPlaylistIDs(reqPlaylists.data.items))
                dispatch(setUsersSavedSongIDs(savedSongItems.map(e => e.track)))
                dispatch(setUserSavedAlbumIDs(albumsData.map(e => e.album)));
                const savedSongsAvailability = savedSongItems.length;
                setLikedSongsAvailable(savedSongsAvailability)
                setSavedArtists(savedArtists.data.artists.items)
                setUserSavedTracks(savedSongItems)
                setLibData({
                    albumItems: albumsData,
                    playlistItems: playlistsData
                })

                const filteringOptions = [];

                if (Number(albumsData.length) > 0) {
                    filteringOptions.push({type: 'Albums', chosen: false});
                }

                if (savedArtists.data.artists.items.length > 0) {
                    filteringOptions.push({type: 'Artists', chosen: false});
                }

                if (playlistsData.length > 0) {
                    filteringOptions.push({type: 'Playlists', chosen: false});
                }

                setFilteringOptions(filteringOptions);

            } catch (err) {

            } finally {
                setLibraryLoading(false)
            }
        }

        if (accessToken !== undefined && accessToken !== 'pending') {
            fetchPlaylistsAlbums()
        }
    }, [accessToken, libraryActions.length]);


    return <section className={libraryStyle['lib-wrapper']}

                    ref={widthPref}
    >
        <div className={libraryStyle['library-title']}>
            <img alt={"Library icon"} draggable={false} width={25} height={25} src={LibrarySVG}></img>
            <p>Your Library</p>
        </div>

        {!libraryLoading && <div className={libraryStyle['filtering-options']}>{filteringOptions.map(eachOption => <div
            key={eachOption.type}

            onClick={() => {
                const mappedNew = filteringOptions.map(e => {
                    if (e.type === eachOption.type) {
                        if (e.chosen) {
                            return {
                                ...e,
                                chosen: false
                            }
                        } else {
                            return {
                                ...e,
                                chosen: true
                            }
                        }
                    }
                    return {
                        ...e,
                        chosen: false
                    }

                })
                setFilteringOptions(mappedNew)
            }
            }
            style={{backgroundColor: eachOption.chosen ? 'white' : '#232323'}}
        >
            <button
                style={{color: eachOption.chosen ? 'black' : 'white'}}

            >{eachOption.type}</button>
        </div>)}</div>
        }


        {/* Albums and saved playlists */}


        <div className={libraryStyle['library-stuff']}
             style={{height: divHeight}}
        >
            {likedSongsAvailable > 0 && (!libraryLoading)
                && (filteringOptions.filter(e => e.chosen)[0]?.type === 'Playlists' || filteringOptions.every(e => {
                    if (!e.chosen) {
                        return true;
                    }
                })) &&
                <li
                    onDoubleClick={async () => {
                        await PlayResumeStreaming(accessToken, String(me?.uri).concat(':collection'), undefined)
                    }}
                    onClick={() => {
                        dispatch(addReactComponentToNavigation({
                            componentName: 'LikedSongs',
                            props: useSavedTracks
                        }))
                    }}
                    className={libraryStyle['listed-playlist-album']}
                >
                    <div className={libraryStyle['liked-songs-icon-wrapper']}>
                        <img src={HeartIcon} width={50} height={50} alt={"Playlist Image"}></img>
                    </div>
                    <div className={libraryStyle['playlist-album-info']}>
                        <div className={libraryStyle['main-info']}>
                            <div className={libraryStyle['playlist-album-name']}><p
                                style={{
                                    width: pTagWidth,
                                    color: currentlyPlaying?.context?.uri === me?.uri.concat(':collection') ? '#1ed760' : '#FFFFFF'
                                }}>Liked Songs</p></div>
                            <div className={libraryStyle['type-owner']}>
                                <p style={{width: pTagWidth}}>Playlist
                                    • {`${likedSongsAvailable} ${likedSongsAvailable > 1 ? 'songs' : 'song'}`}</p>

                            </div>

                        </div>
                        <div
                            className={libraryStyle['active-indicator']}>{currentlyPlaying?.context?.uri === me?.uri.concat(':collection') &&
                            <img alt={'Active Item'} src={Active}
                                 width={25} height={25}></img>}
                        </div>
                    </div>
                </li>
            }

            {(!libraryLoading) && (filteringOptions.filter(e => e.chosen)[0]?.type === 'Artists' || filteringOptions.every(e => {
                    if (!e.chosen) {
                        return true;
                    }
                })) &&

                savedArtists.map((eachArtist, i) => <li
                    className={libraryStyle['listed-playlist-album']}
                    onClick={() => {
                        dispatch(addReactComponentToNavigation({
                            componentName: 'Artist',
                            props: eachArtist?.id
                        }))
                    }}
                    onDoubleClick={async () => {
                        await PlayResumeStreaming(accessToken, eachArtist.uri, undefined)
                    }}
                    key={i}>
                    <img
                        style={{
                            borderRadius: '100%'
                        }}
                        src={eachArtist.images[0].url} width={50} height={50} alt={"Playlist Image"}></img>
                    <div className={libraryStyle['playlist-album-info']}>
                        <div className={libraryStyle['main-info']}>
                            <div className={libraryStyle['playlist-album-name']}><p
                                style={{
                                    width: currentlyPlaying?.context?.uri === eachArtist?.uri ? pTagWidth - 30 : pTagWidth,
                                    color: currentlyPlaying?.context?.uri === eachArtist?.uri ? '#1ed760' : '#FFFFFF'
                                }}>{eachArtist.name}</p></div>
                            <div className={libraryStyle['type-owner']}>
                                <p style={{width: pTagWidth}}>{eachArtist.type[0].toUpperCase().concat(eachArtist.type.slice(1,))}</p>

                            </div>
                        </div>
                        <div
                            className={libraryStyle['active-indicator']}>{currentlyPlaying?.context?.uri === eachArtist?.uri &&
                            <img alt={'Active Item'} src={Active}
                                 width={25} height={25}></img>}
                        </div>

                    </div>
                </li>)}

            {libraryLoading ?
                Array.from({length: 3}).map((_, i) => <LibraryItemSkeleton key={i}/>)
                :
                (!libraryLoading) && (filteringOptions.filter(e => e.chosen)[0]?.type === 'Albums' || filteringOptions.every(e => {
                    if (!e.chosen) {
                        return true;
                    }
                })) && libData.albumItems.map(each => each.album).map((eachAlbum, i) =>
                    <li
                        className={libraryStyle['listed-playlist-album']}
                        onClick={() => {
                            dispatch(addReactComponentToNavigation({
                                componentName: 'Album',
                                props: eachAlbum?.id
                            }))
                        }}
                        onDoubleClick={async () => {
                            await PlayResumeStreaming(accessToken, eachAlbum.uri, undefined)
                        }}
                        key={i}>
                        <img src={eachAlbum.images[0].url} width={50} height={50} alt={"Playlist Image"}></img>
                        <div className={libraryStyle['playlist-album-info']}>
                            <div className={libraryStyle['main-info']}>
                                <div className={libraryStyle['playlist-album-name']}><p
                                    style={{
                                        width: currentlyPlaying?.context?.uri === eachAlbum?.uri ? pTagWidth - 30 : pTagWidth,
                                        color: currentlyPlaying?.context?.uri === eachAlbum?.uri ? '#1ed760' : '#FFFFFF'
                                    }}>{eachAlbum.name}</p></div>
                                <div className={libraryStyle['type-owner']}>
                                    <p style={{width: pTagWidth}}>{eachAlbum.type[0].toUpperCase().concat(eachAlbum.type.slice(1,))} • {eachAlbum.artists.map(each => each.name).join(', ')}</p>

                                </div>
                            </div>
                            <div
                                className={libraryStyle['active-indicator']}>{currentlyPlaying?.context?.uri === eachAlbum?.uri &&
                                <img alt={'Active Item'} src={Active}
                                     width={25} height={25}></img>}
                            </div>

                        </div>
                    </li>
                )}

            {libraryLoading ?
                Array.from({length: 2}).map((_, i) => <LibraryItemSkeleton key={i}/>)
                :
                (!libraryLoading) && (filteringOptions.filter(e => e.chosen)[0]?.type === 'Playlists' || filteringOptions.every(e => {
                    if (!e.chosen) {
                        return true;
                    }
                })) && libData.playlistItems.map((eachPlaylist, i) =>

                    <li
                        className={libraryStyle['listed-playlist-album']}
                        onClick={() => {
                            dispatch(addReactComponentToNavigation({
                                componentName: 'Playlist',
                                props: eachPlaylist?.id
                            }))
                        }}
                        onDoubleClick={async () => {
                            await PlayResumeStreaming(accessToken, eachPlaylist.uri, undefined)
                        }} key={i}>
                        <img src={eachPlaylist.images[0].url} width={50} height={50} alt={"Playlist Image"}></img>
                        <div className={libraryStyle['playlist-album-info']}>
                            <div className={libraryStyle['main-info']}>
                                <div className={libraryStyle['playlist-album-name']}><p
                                    style={{
                                        width: currentlyPlaying?.context?.uri === eachPlaylist?.uri ? pTagWidth - 30 : pTagWidth,
                                        color: currentlyPlaying?.context?.uri === eachPlaylist?.uri ? '#1ed760' : '#FFFFFF'
                                    }}>{eachPlaylist.name}</p></div>
                                <div className={libraryStyle['type-owner']}>
                                    <p style={{width: pTagWidth}}>{eachPlaylist.type[0].toUpperCase().concat(eachPlaylist.type.slice(1,))} • {eachPlaylist.owner.display_name}</p>

                                </div>
                            </div>
                            <div
                                className={libraryStyle['active-indicator']}>{currentlyPlaying?.context?.uri === eachPlaylist.uri &&
                                <img alt={'Active Item'} src={Active}
                                     width={25} height={25}></img>}</div>
                        </div>
                    </li>)
            }
        </div>


    </section>
}

export default Library;