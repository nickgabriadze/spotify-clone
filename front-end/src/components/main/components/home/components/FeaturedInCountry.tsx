import {useAppSelector} from "../../../../../store/hooks.ts";
import {useEffect, useState} from "react";
import getFeaturedInCountry from "../../../../../api/main/home/getFeaturedInCountry.ts";
import {Playlist} from "../../../../../types/playlist.ts";
import homepageStyle from "../homepage.module.css";
import PlayListCard from "../../../../search/reuseables/playListCard.tsx";

export function FeaturedInCountry() {
    const userInfo = useAppSelector((state) => state.spotiUserReducer.userInformation)?.country;
    const [featuredData, setFeaturedData] = useState<{ message: string, playlists: Playlist[] }>({message: '', playlists: []})
    const accessToken = useAppSelector((state) => state.spotiUserReducer.spotiToken.accessToken);
    const numberOfItems = useAppSelector(s => s.spotiUserReducer.numberOfItemsToBeShown);

    useEffect(() => {
        const getFeaturedOnes = async () => {
            try {
                const featuredOnes = await getFeaturedInCountry(accessToken, userInfo);
                const data = featuredOnes.data;
                setFeaturedData({message: featuredOnes.data.message, playlists: data.playlists.items});
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
            <div className={homepageStyle['featured-grid']}
            >
                {featuredData.playlists?.slice(0,numberOfItems).map((eachPlaylist, i) => <PlayListCard key={i} eachPlaylist={eachPlaylist}/>)}
            </div>
        </section>
    }
}


export default FeaturedInCountry;