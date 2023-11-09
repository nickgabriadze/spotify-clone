import homepageStyle from "./homepage.module.css";
import TopItems from "./components/TopItems.tsx";
import {RecentlyPlayed} from "./components/RecentlyPlayed.tsx";
import {MoreLikeArtists} from "./components/MoreLike.tsx";
import FeaturedInCountry from "./components/FeaturedInCountry.tsx";
import NewReleases from "./components/NewReleases.tsx";
import {useAppSelector} from "../../../../store/hooks.ts";
import {useEffect} from "react";

export function Home() {
    const currentlyPlaying = useAppSelector(s => s.navigationReducer.currentlyPlayingSong.isPlaying)
    const time = new Date().getHours();
    const accessToken = useAppSelector(a => a.spotiUserReducer.spotiToken.accessToken)
    const timeFrame = () => {
        if (time >= 0 && time <= 12) {
            return "morning"
        }

        if (time > 12 && time <= 18) {
            return "afternoon"
        }

        if (time > 18 && time <= 23) {
            return "evening"
        }
    }


    useEffect(() => {
        if (!currentlyPlaying) {
            document.title = "Home"
        }
    }, [currentlyPlaying]);
    return <section className={homepageStyle['homepage-wrapper']}>
        <h1 className={homepageStyle['greeting-message']}>Good {timeFrame()}</h1>
        {localStorage.getItem('access_token') !== undefined && accessToken !== 'pending' && <TopItems/>}
        <FeaturedInCountry/>
        <RecentlyPlayed/>
        <NewReleases/>
        <MoreLikeArtists/>
    </section>
}

export default Home;