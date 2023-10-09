import homepageStyle from "./homepage.module.css";

import {useEffect} from "react";
import TopItems from "./components/TopItems.tsx";
import {RecentlyPlayed} from "./components/RecentlyPlayed.tsx";
import  {MoreLikeArtists} from "./components/MoreLike.tsx";

export function Home() {
    const time = new Date().getHours();
    const timeFrame = () => {
        if(time >= 0 && time <= 12){
            return "morning"
        }

        if(time > 12 && time <= 18){
            return "afternoon"
        }

        if(time > 18 && time <= 23){
            return "evening"
        }
    }


    useEffect(() => {})
    return <section className={homepageStyle['homepage-wrapper']}>
        <h1 className={homepageStyle['greeting-message']}>Good {timeFrame()}</h1>
        <TopItems />
        <RecentlyPlayed />
        <MoreLikeArtists />
    </section>
}

export default Home;