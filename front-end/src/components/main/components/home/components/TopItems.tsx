import {useEffect, useState} from "react";
import homepageStyle from "../homepage.module.css";
import {useAppSelector} from "../../../../../store/hooks.ts";
import getUsersTopItems from "../../../../../api/home/getUsersTopItems.ts";
import {Artist} from "../../../../../types/artist.ts";
import {Album} from "../../../../../types/album.ts";
import {Track} from "../../../../../types/track.ts";
import PlayButton from "../../../../search/components/each-search-component/Playlists/icons/play.svg";

export function TopItems() {
    const [topItemsData, setTopItemsData] = useState<(Album | Artist)[]>([]);
    const access = useAppSelector((state) => state.spotiUserReducer.spotiToken.accessToken);
    const [hoveringOverTopItem, setHoveringOverTopItem] = useState<{ itemID: string }>({itemID: ""});

    useEffect(() => {
        const fetchTops = async () => {
            try {
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

            }
        }
        fetchTops();

    }, [access])


    return <div className={homepageStyle['user-top-items-wrapper']}>
        {topItemsData.map((eachTopItem, i) => <div key={i} className={homepageStyle['top-item']}
                                                   onMouseOver={() => setHoveringOverTopItem({itemID: eachTopItem.id})}
                                                   onMouseOut={() => setHoveringOverTopItem({itemID: ''})}
        >

            <div className={homepageStyle['album-picture']}>
                <img src={eachTopItem.images[0].url} alt={'Album Image'}></img>
            </div>

            <div className={homepageStyle['detail-play']}>
                <div className={homepageStyle['top-item-title']}>{eachTopItem.name}</div>
                {hoveringOverTopItem && hoveringOverTopItem.itemID === eachTopItem.id &&
                    <div className={homepageStyle['play-button']}>
                        <button><img alt={"Play"} draggable={false} src={PlayButton} height={50}></img></button>
                    </div>}
            </div>
        </div>)}
    </div>
}

export default TopItems;