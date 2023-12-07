import {useEffect, useState} from "react";
import homepageStyle from "../homepage.module.css";
import {useAppDispatch, useAppSelector} from "../../../../../store/hooks.ts";
import getUsersTopItems from "../../../../../api/main/home/getUsersTopItems.ts";
import {Artist} from "../../../../../types/artist.ts";
import {Album} from "../../../../../types/album.ts";
import {Track} from "../../../../../types/track.ts";
import PlayResumeStreaming from "../../../../../api/player/playResumeStreaming.ts";
import {setUserControlActions} from "../../../../../store/features/navigationSlice.ts";
import PauseStreaming from "../../../../../api/player/pauseStreaming.ts";
import Pause from "../../../../search/components/each-search-component/Playlists/icons/pause.svg";
import Play from "../../../../search/components/each-search-component/Playlists/icons/play.svg";
import UsersTopItemSkeleton from "../../../../../skeletons/usersTopItemSkeleton.tsx";
import {Link} from "react-router-dom";

export function TopItems() {
    const [topItemsData, setTopItemsData] = useState<(Album | Artist)[]>([]);
    const access = useAppSelector((state) => state.spotiUserReducer.spotiToken.accessToken);
    const [hoveringOverTopItem, setHoveringOverTopItem] = useState<{ itemID: string }>({itemID: ""});
    const currentlyPlaying = useAppSelector((state) => state.navigationReducer.currentlyPlayingSong);
    const [dataLoading, setDataLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchTops = async () => {

            try {
                setDataLoading(true)
                const getTopArtists: Artist[] = (await getUsersTopItems(access, 'artists', 'medium_term', 3)).data.items;
                const getTopTracks: Track[] = (await getUsersTopItems(access, 'tracks', "medium_term", 3)).data.items;
                const tracksMappedToAlbums = getTopTracks.map(eachTopTrack => eachTopTrack.album);

                setTopItemsData([
                    tracksMappedToAlbums[2],
                    tracksMappedToAlbums[1],
                    getTopArtists[2],
                    tracksMappedToAlbums[0],
                    getTopArtists[1],
                    getTopArtists[0]
                ]);

            } catch (err) {

            } finally {
                setDataLoading(false)
            }
        }
        if (localStorage.getItem('access_token')) {

            fetchTops()
        }


    }, [access])
    const dispatch = useAppDispatch();

    return <div className={homepageStyle['user-top-items-wrapper']}>
        {dataLoading ?
            Array.from({length: 6}).map((_, i) => <UsersTopItemSkeleton key={i}/>)
            :
            topItemsData.map((eachTopItem, i) => <div key={i} className={homepageStyle['top-item']}
                                                      onMouseOver={() => setHoveringOverTopItem({itemID: eachTopItem?.id})}
                                                      onMouseOut={() => setHoveringOverTopItem({itemID: ''})}

            >


                    <Link to={`/${eachTopItem.type}/${eachTopItem.id}`}><div className={homepageStyle['album-picture']}

                    ><img src={eachTopItem?.images[0].url} alt={'Album Image'}></img>
                    </div>
                    </Link>




                <div className={homepageStyle['detail-play']}>
                     <Link to={`/${eachTopItem.type}/${eachTopItem.id}`
                }><div className={homepageStyle['top-item-title']}

                    >{eachTopItem?.name}</div>
                     </Link>
                    {hoveringOverTopItem && hoveringOverTopItem.itemID === eachTopItem?.id &&
                        <div className={homepageStyle['play-button']}>
                            <button
                                onClick={async () => {

                                    if (!(currentlyPlaying.albumID === String(eachTopItem?.id) || currentlyPlaying.artistID === String(eachTopItem?.id))) {
                                        await PlayResumeStreaming(access, eachTopItem.uri, undefined);
                                        dispatch(
                                            setUserControlActions({
                                                userAction: "Play Track",
                                            })
                                        );
                                    } else if (currentlyPlaying.isPlaying && (currentlyPlaying.albumID === String(eachTopItem?.id) || currentlyPlaying.artistID === String(eachTopItem?.id))) {

                                        await PauseStreaming(access);
                                        dispatch(
                                            setUserControlActions({
                                                userAction: "Pause Track",
                                            })
                                        );
                                    } else if (!(currentlyPlaying.isPlaying) && (currentlyPlaying.albumID === String(eachTopItem?.id) || currentlyPlaying.artistID === String(eachTopItem?.id))) {

                                        await PlayResumeStreaming(access);

                                        dispatch(
                                            setUserControlActions({
                                                userAction: "Resume Track",
                                            })
                                        );
                                    }
                                }}
                            >{(currentlyPlaying.albumID === String(eachTopItem?.id) || currentlyPlaying.artistID === String(eachTopItem?.id)) && currentlyPlaying.isPlaying === true ?
                                <div><img src={Pause} width={30} height={30} alt={'Pause Button Image'}></img></div>
                                :
                                <div><img src={Play} width={50} height={50} alt={'Play Button Image'}></img></div>
                            }
                            </button>


                        </div>}
                </div>
            </div>)}
    </div>
}

export default TopItems;