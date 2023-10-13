import {useAppSelector} from "../../../../../store/hooks.ts";
import {useEffect, useState} from "react";
import getFeaturedInCountry from "../../../../../api/home/getFeaturedInCountry.ts";
import {Playlist} from "../../../../../types/playlist.ts";
import homepageStyle from "../homepage.module.css";
import PlayListCard from "../../../../search/reuseables/playListCard.tsx";
import PlaylistCardSkeleton from "../../../../../skeletons/playlistCardSekeleton.tsx";

export function FeaturedInCountry() {
    const userInfo = useAppSelector((state) => state.spotiUserReducer.userInformation)?.country;
    const [featuredData, setFeaturedData] = useState<{ message: string, playlists: Playlist[] }>({message: '', playlists: []})
    const accessToken = useAppSelector((state) => state.spotiUserReducer.spotiToken.accessToken);

    useEffect(() => {
        const getFeaturedOnes = async () => {
            try {
                const featuredOnes = await getFeaturedInCountry(accessToken, userInfo);
                const data = featuredOnes.data;
                setFeaturedData({message: featuredOnes.data.message, playlists: data.playlists.items.slice(0, 5)});
            } catch (err) {
                console.log(err)
            }
        }

        if(userInfo !== undefined) {
            getFeaturedOnes();
        }
    }, [userInfo, accessToken, userInfo])


    if (featuredData.playlists?.length !== 0) {
        return <section className={homepageStyle['featured-wrapper']}>
            <h2>Editor's picks</h2>
            <div className={homepageStyle['featured-grid']}>
                {featuredData.playlists?.map((eachPlaylist, i) => <PlayListCard key={i} eachPlaylist={eachPlaylist}/>)}
            </div>
        </section>
    }else{
        return <section className={homepageStyle['featured-wrapper']}>
          <h2 className={homepageStyle['featured-message-skeleton']}>
          </h2>
            <div className={homepageStyle['featured-grid']}>
                {Array.from({length: 5}).map((_, i) => <PlaylistCardSkeleton key={i} />)}

            </div>
        </section>
    }
}


export default FeaturedInCountry;