import {useEffect, useState} from "react";
import {useAppSelector} from "../../../../../store/hooks.ts";
import getRecentlyPlayed from "../../../../../api/home/getRecentlyPlayed.ts";
import {RecentlyPlayed} from "../../../../../types/recentlyPlayed.ts";
import homepageStyle from "../homepage.module.css";
import {ArtistCardApi} from "../../../../search/reuseables/artistCard.tsx";
import {AlbumCardApi} from "../../../../search/reuseables/albumCard.tsx";
import {PlaylistCardApi} from "../../../../search/reuseables/playListCard.tsx";


export function RecentlyPlayed() {
    const [recentlyPlayedData, setRecentlyPlayedData] = useState<string[]>();
    const accessToken = useAppSelector((state) => state.spotiUserReducer.spotiToken.accessToken);


    useEffect(() => {
        const fetchRecent = async () => {
            try {
                const data: RecentlyPlayed = (await getRecentlyPlayed(accessToken, 5)).data;

                const filteredData = [...data.items].filter(e => e.context).map((e) => e.context.href)
                const finalizedObjectAddresses = filteredData.filter((e, i) => filteredData.lastIndexOf(e) === i);
                setRecentlyPlayedData(finalizedObjectAddresses)


            } catch (err) {

            }
        }
        fetchRecent();
    }, [])


    return <section className={homepageStyle['recently-played-section']}>
        <h2>Recently played</h2>
        <div className={homepageStyle['recent-section']}>
            {recentlyPlayedData?.map((recent, i) => {
                const contextType = recent.split('/');
                const type = contextType[contextType.length - 2]
                const id = contextType[contextType?.length - 1]

                if (type === 'artists') {
                    return <ArtistCardApi artistID={id} key={i}/>
                } else if (type === 'albums') {
                    return <AlbumCardApi albumID={id} key={i}/>
                } else if (type === 'playlists') {
                    return <PlaylistCardApi playlistID={id}/>

                }

            })}
        </div>
    </section>


}

export default RecentlyPlayed;