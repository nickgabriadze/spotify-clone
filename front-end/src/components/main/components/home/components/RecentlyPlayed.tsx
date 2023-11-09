import {useEffect, useState} from "react";
import {useAppSelector} from "../../../../../store/hooks.ts";
import getRecentlyPlayed from "../../../../../api/main/home/getRecentlyPlayed.ts";
import {RecentlyPlayed} from "../../../../../types/recentlyPlayed.ts";
import homepageStyle from "../homepage.module.css";
import {ArtistCardApi} from "../../../../search/reuseables/artistCard.tsx";
import {AlbumCardApi} from "../../../../search/reuseables/albumCard.tsx";
import {PlaylistCardApi} from "../../../../search/reuseables/playListCard.tsx";
import AlbumCardSkeleton from "../../../../../skeletons/albumCardSkeleton.tsx";


export function RecentlyPlayed() {
    const [recentlyPlayedData, setRecentlyPlayedData] = useState<string[]>();
    const accessToken = useAppSelector((state) => state.spotiUserReducer.spotiToken.accessToken);
    const [recentlyLoading, setRecentlyLoading] = useState<boolean>(true);
    const numberOfItems = useAppSelector(s => s.spotiUserReducer.numberOfItemsToBeShown);

    useEffect(() => {
        const fetchRecent = async () => {
            try {
                setRecentlyLoading(true)
                const data: RecentlyPlayed = (await getRecentlyPlayed(accessToken)).data;
                const filteredData = [...data.items].filter(e => e.context !== null).map((e) => e.context.href)
                const finalizedObjectAddresses = filteredData.filter((e, i) => filteredData.lastIndexOf(e) === i);
                setRecentlyPlayedData(finalizedObjectAddresses)


            } catch (err) {

            } finally {
                setRecentlyLoading(false)
            }
        }
        fetchRecent();
    }, [])

    if (recentlyPlayedData?.length === 0) {
        return;
    }

    if (!recentlyLoading) {

        return <section className={homepageStyle['recently-played-section']}>
            <h2>Recently played</h2>
            <div className={homepageStyle['recent-section']}>
                {recentlyPlayedData?.slice(0,numberOfItems).map((recent, i) => {
                    const contextType = recent.split('/');
                    const type = contextType[contextType.length - 2]
                    const id = contextType[contextType?.length - 1]

                    if (type === 'artists') {
                        return <ArtistCardApi artistID={id} key={i}/>
                    } else if (type === 'albums') {
                        return <AlbumCardApi albumID={id} key={i}/>
                    } else if (type === 'playlists') {
                        return <PlaylistCardApi  key={i} playlistID={id}/>

                    }

                })}
            </div>
        </section>
    } else {
        return <section className={homepageStyle['recently-played-section']}>
            <h2 className={homepageStyle['recent-section-title-skeleton']}></h2>
            <div className={homepageStyle['recent-section']}>
                {Array.from({length: numberOfItems}).map((_, i) =>
                    <AlbumCardSkeleton key={i}/>
                )}
            </div>
        </section>
    }

}

export default RecentlyPlayed;