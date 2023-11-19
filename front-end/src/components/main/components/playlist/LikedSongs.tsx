import playlistPageStyle from "./playlistpage.module.css";
import albumStyle from "../album/albumpage.module.css";
import PlayResumeStreaming from "../../../../api/player/playResumeStreaming.ts";
import {setUserControlActions} from "../../../../store/features/navigationSlice.ts";
import PauseStreaming from "../../../../api/player/pauseStreaming.ts";
import Pause from "../../../search/components/each-search-component/Playlists/icons/pause.svg";
import Play from "../../../search/components/each-search-component/Playlists/icons/play.svg";
import Duration from "../../../search/components/each-search-component/icons/duration.svg";
import SongCardSkeleton from "../../../../skeletons/songCardSkeleton.tsx";
import {SongCard} from "../../../search/reuseables/songCard.tsx";
import LikedSongsCover from "../../../library/icons/saved-songs-icon.png"
import {useAppDispatch, useAppSelector} from "../../../../store/hooks.ts";
import {PlayListTrackObject} from "../../../../types/playlist.ts";
import {useEffect, useState} from "react";
import getSavedTracks from "../../../../api/library/getSavedTracks.ts";

export function LikedSongs({tracks}: { tracks: { added_at: string, track: PlayListTrackObject }[] }) {
    const me = useAppSelector(s => s.spotiUserReducer.userInformation);
    const dispatch = useAppDispatch();
    const [likedTracks, setLikedTracks] = useState<{ added_at: string, track: PlayListTrackObject }[]>(tracks);
    const libraryActions = useAppSelector(s => s.navigationReducer.libraryActions);
    const currentlyPlaying = useAppSelector(s => s.navigationReducer.currentlyPlayingSong);


    const accessToken = useAppSelector(s => s.spotiUserReducer.spotiToken.accessToken)

    useEffect(() => {

        const updateSavedTracks = async () => {
            const savedSongItems: {
                added_at: string,
                track: PlayListTrackObject
            }[] = (await getSavedTracks(accessToken)).data.items;

            setLikedTracks(savedSongItems)
        }

        updateSavedTracks();

    }, [accessToken, libraryActions.length]);


    useEffect(() => {
        if (!currentlyPlaying.isPlaying) {
            document.title = `Liked Songs`
        }
    }, [currentlyPlaying.isPlaying]);

    return <section className={playlistPageStyle['playlist-page-wrapper']}>
        <div className={playlistPageStyle['general-info-wrapper']}>
            <div className={playlistPageStyle['img-placement']}>
                <img title={'Liked Songs'} alt="Playlist image"
                     src={LikedSongsCover}></img>
            </div>
            <div className={playlistPageStyle['pl-info']}>
                <p className={playlistPageStyle['pl-type']}>{'Playlist'}</p>
                <h1 className={playlistPageStyle['pl-name']}>Liked Songs</h1>

                <div className={playlistPageStyle['owner-likes-total-dur']}>
                    <p>{String(me?.display_name)} • </p>

                    <p>{tracks.length} {Number(tracks.length) > 1 ? 'songs' : 'song'}</p>

                </div>
            </div>
        </div>
        <div className={albumStyle['play-save']}>
            <div>
                <button

                    className={albumStyle["album-hover-button"]}
                    onClick={async () => {
                        if (currentlyPlaying?.context?.uri === me?.uri.concat(':collection')) {
                            if (!currentlyPlaying.isPlaying) {
                                await PlayResumeStreaming(accessToken);
                                dispatch(
                                    setUserControlActions({
                                        userAction: "Play Playlist",
                                    })
                                );
                            } else {
                                await PauseStreaming(accessToken);
                                dispatch(
                                    setUserControlActions({
                                        userAction: "Pause Playlist",
                                    })
                                );
                            }
                        } else {
                            await PlayResumeStreaming(accessToken, String(me?.uri).concat(':collection'), undefined);
                            dispatch(
                                setUserControlActions({
                                    userAction: "Play Playlist",
                                })
                            );
                        }
                    }}
                >{currentlyPlaying?.context?.uri === me?.uri.concat(':collection') &&
                currentlyPlaying.isPlaying ? (
                    <div>
                        <img

                            alt={"Pause icon"} src={Pause} width={40} height={40}></img>
                    </div>
                ) : (
                    <div>
                        <img alt={"Play icon"} src={Play} width={60} height={60}></img>
                    </div>
                )}

                </button>
            </div>

        </div>

        <nav className={playlistPageStyle['numbering-title-duration']}>
            <div className={playlistPageStyle['i-title']}>
                <div>#</div>
                <div>Title</div>

            </div>

            <div className={playlistPageStyle['i-album']}>Album</div>

            <div className={playlistPageStyle['date_added_at']}>Date Added</div>

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


        <div>

            {likedTracks.map((plTrack, i) => {
                if (typeof plTrack == typeof SongCardSkeleton) {
                    return <SongCardSkeleton forPlaylist={true} key={i}/>;
                } else {
                    return <SongCard
                        playlistTrackAddedDate={plTrack.added_at}
                        forPlaylist={true}
                        eachTrack={typeof plTrack === "object" ? plTrack.track : undefined} n={i + 1} key={i}
                        accessToken={accessToken}/>
                }
            })}

        </div>

    </section>
}