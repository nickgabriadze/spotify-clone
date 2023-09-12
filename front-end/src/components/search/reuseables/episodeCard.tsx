import episodesStyle from "../components/each-search-component/PodcastsShows/podcastsShows.module.css";

import {Episode} from "../../../types/episode";
import {millisecondsToHhMmSs} from "../../player/msConverter";

export function EpisodeCard({eachEpisode}: { eachEpisode: Episode }) {
    const months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ], episodeDate: Date = new Date(String(eachEpisode?.release_date)), currentYear: number = new Date().getFullYear(),
        month: string = months[episodeDate.getMonth()], date: number = episodeDate.getDate(),
        releasedThisYear: boolean = currentYear === episodeDate.getFullYear();


    return <div className={episodesStyle['episode-card']}>

        <div className={episodesStyle['episode-img']}>
            <img src={eachEpisode?.images[0]?.url}
            alt={"Episode image"}
            ></img>
        </div>

        <div className={episodesStyle['episode-desc']}>
            <div className={episodesStyle['episode-name']}>
                <h4>{eachEpisode?.name.length > 60 ? eachEpisode?.name.slice(0, 60).concat("...") : eachEpisode?.name}</h4>
            </div>
            <div className={episodesStyle['actual-desc']}>
                <p>{eachEpisode?.description.length > 150 ? eachEpisode?.description.slice(0, 150).concat("...") : eachEpisode?.description}</p>
            </div>
            <div className={episodesStyle['date-duration-details']}>
                {eachEpisode?.explicit ? <div className={episodesStyle['explicit']}>E</div> : ''}
                <p>{releasedThisYear ? `${month} ${date}` : `${month} ${episodeDate.getFullYear()}`} • {millisecondsToHhMmSs(Number(eachEpisode?.duration_ms), true)}</p>
            </div>
        </div>

    </div>
}

export default EpisodeCard