import {EpisodeWithShow} from "../../../types/episode.ts";
import allresultsStyle from "../../search/components/each-search-component/All/allresults.module.css";
import episodesStyle from "../components/each-search-component/PodcastsShows/podcastsShows.module.css";

export function TopEpisodeCard({eachEpisode}: { eachEpisode: EpisodeWithShow }) {
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
    ];
    const episodeDate: Date = new Date(String(eachEpisode?.release_date));

    const currentYear: number = new Date().getFullYear();
    const month: string = months[episodeDate.getMonth()]
    const date: number = episodeDate.getDate();

    const releasedThisYear: boolean = currentYear === episodeDate.getFullYear();


    return <div className={allresultsStyle['top-episode-wrapper']}>
        <div className={allresultsStyle['top-episode-image-wrapper']}>

            <div className={allresultsStyle['top-episode-image']}>
                <img  className={allresultsStyle['top-e-image-main']} alt={'top-episode-image'} src={eachEpisode?.images[0].url}></img>
                <img className={allresultsStyle['top-episode-show-image']} alt={'top-episode-show-image'}
                     src={eachEpisode?.show.images[0].url} width={40} height={40}></img>
            </div>

        </div>

        <div className={allresultsStyle['top-episode-inner-details']}>
            <div className={allresultsStyle['top-episode-name']}>
                <h4>{eachEpisode?.name.length > 18 ? eachEpisode?.name.slice(0, 18).concat('...') : eachEpisode?.name}</h4>
            </div>


            <div className={allresultsStyle['top-episode-explicit-or-details']}>

                {eachEpisode?.explicit ? <div className={episodesStyle['explicit']}>E</div> : ''}

                <p>{releasedThisYear ? `${month} ${date}` : `${month} ${episodeDate.getFullYear()}`} • {Math.floor(eachEpisode?.duration_ms / 60000)} min</p>

            </div>
        </div>
    </div>

}

export default TopEpisodeCard;