import {useEffect, useState} from "react";
import {useAppSelector} from "../../../../../store/hooks";
import getShowsPodcasts from "../../../../../api/search/getShowsPodcasts";
import {Shows} from "../../../../../types/show";
import {Episodes} from "../../../../../types/episode";
import EpisodeCard from "../../../reuseables/episodeCard";
import podcastsShowsStyle from "./podcastsShows.module.css";
import ShowPodcastCard from "../../../reuseables/showPodcastCard.tsx";
import PlaylistCardSkeleton from "../../../../../skeletons/playlistCardSekeleton.tsx";
import EpisodeCardSkeleton from "../../../../../skeletons/episodeCardSkeleton.tsx";

export function PodcastsShows({podcastShowName}: {
    podcastShowName: string;
}) {
    const accessToken = useAppSelector(
        (state) => state.spotiUserReducer.spotiToken.accessToken
    );
    const [showsEpisodes, setShowsEpisodes] = useState<{
        shows: Shows;
        episodes: Episodes;
    }>();
    const [showsEpisodesLoading, setShowsEpisodesLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchEpisodes = async () => {
            setShowsEpisodesLoading(true)
            try {

                const req = await getShowsPodcasts(accessToken, podcastShowName);
                const data = req.data;

                setShowsEpisodes((prev) => {
                    return {
                        ...prev,
                        shows: data.shows,
                        episodes: data.episodes,
                    };
                });
            } catch (err) {
                console.log(err);
            } finally {
                setShowsEpisodesLoading(false)
            }
        };

        fetchEpisodes();
    }, [podcastShowName, accessToken]);


    return (
        <section style={{
            marginTop: '20px'
        }}>
            <div className={podcastsShowsStyle['podcasts-wrapper']}>
                <div style={{fontSize: '1.3rem', color: 'white', paddingLeft: '10px'}}>Podcasts & Shows</div>
                <div className={podcastsShowsStyle['podcasts-list']}>
                    {showsEpisodesLoading ?
                        Array.from({length: 5}).map((_, i) => <PlaylistCardSkeleton
                            key={i}/>) :
                        showsEpisodes?.shows.items.slice(0, 5).map((eachShow, i) => {
                            return <ShowPodcastCard eachShowPodcast={eachShow} key={i}/>
                        })
                    }
                </div>
            </div>
            <div className={podcastsShowsStyle["episodes-wrapper"]}>
                <div style={{fontSize: '1.3rem', color: 'white', paddingLeft: '10px'}}>Episodes</div>
                <div className={podcastsShowsStyle['episodes-list']}>

                    {
                        showsEpisodesLoading ?
                            Array.from({length: 30}).map((_, i) => <EpisodeCardSkeleton key={i} />) :
                        showsEpisodes?.episodes.items.map((eachEpisode, i) => (
                        <EpisodeCard eachEpisode={eachEpisode} key={i}/>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default PodcastsShows;
