import episodesStyle from "../components/each-search-component/PodcastsShows/podcastsShows.module.css";

import { Episode } from "../../../types/episode";

export function EpisodeCard({eachEpisode}: {eachEpisode:Episode}) {


    return <div className={episodesStyle['episode-card']}>

        <div className={episodesStyle['episode-img']}>
            <img src={eachEpisode?.images[0]?.url}></img>
        </div>

        <div className={episodesStyle['episode-desc']}></div>

    </div>   
}

export default EpisodeCard