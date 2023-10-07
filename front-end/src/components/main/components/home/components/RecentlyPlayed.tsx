import {useEffect, useState} from "react";
import {useAppSelector} from "../../../../../store/hooks.ts";
import getRecentlyPlayed from "../../../../../api/home/getRecentlyPlayed.ts";
import {RecentlyPlayed} from "../../../../../types/recentlyPlayed.ts";
import homepageStyle from "../homepage.module.css";
import ArtistCard from "../../../../search/reuseables/artistCard.tsx";
import Albums from "../../../../search/components/each-search-component/Albums/Albums.tsx";
import AlbumCard from "../../../../search/reuseables/albumCard.tsx";
import home from "../Home.tsx";

export function RecentlyPlayed(){
    const [recentlyPlayedData, setRecentlyPlayedData] = useState<RecentlyPlayed>();
    const accessToken = useAppSelector((state) => state.spotiUserReducer.spotiToken.accessToken);


    useEffect(() => {
        const fetchRecent = async () => {
            try {
                const data: RecentlyPlayed = (await getRecentlyPlayed(accessToken, 5)).data;
               setRecentlyPlayedData(data)
                console.log(data)
            } catch (err) {

            }
        }

        fetchRecent();
    }, [])
    console.log(recentlyPlayedData?.items[0].track.artists)
    return <section className={homepageStyle['recently-played-section']}>
        <h2>Recently played</h2>
        <div className={homepageStyle['recent-section']}>
            {recentlyPlayedData?.items.map((recent, i) => {
                if(recent.context.type === 'album') {
                    return <AlbumCard eachAlbum={recent.track.album} key={i}/>
                }else{
                    return <h3>...</h3>
                }
            })}
        </div>
    </section>



}

export default RecentlyPlayed;