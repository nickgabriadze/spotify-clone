import {useEffect, useState} from "react";
import homepageStyle from "../homepage.module.css";
import {useAppSelector} from "../../../../../store/hooks.ts";
import getUsersTopItems from "../../../../../api/home/getUsersTopItems.ts";
import {Artist} from "../../../../../types/artist.ts";
import {Album} from "../../../../../types/album.ts";
import {Track} from "../../../../../types/track.ts";

export function TopItems() {
    const [topItemsData, setTopItemsData] = useState<(Album | Artist)[]>([]);
    const access = useAppSelector((state) => state.spotiUserReducer.spotiToken.accessToken);

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
    return <div className={homepageStyle['user-top-items-wrapper']}></div>
}

export default TopItems;