import { useEffect, useState } from "react";
import { useAppSelector } from "../../../../../store/hooks";
import getShowsPodcasts from "../../../../../api/search/getShowsPodcasts";
import { Shows } from "../../../../../types/show";
import { Episodes } from "../../../../../types/episode";
import EpisodeCard from "../../../reuseables/episodeCard";
import podcastsShowsStyle from "./podcastsShows.module.css";

export function PodcastsShows({
  podcastShowName,
}: {
  podcastShowName: string;
}) {
  const accessToken = useAppSelector(
    (state) => state.spotiUserReducer.spotiToken.accessToken
  );
  const [showsEpisodes, setShowsEpisodes] = useState<{
    shows: Shows;
    episodes: Episodes;
  }>();
  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const req = await getShowsPodcasts(accessToken, podcastShowName);
        const data = req.data;

        console.log(data);

        setShowsEpisodes((prev) => {
          return {
            ...prev,
            shows: data.shows,
            episodes: data.episodes,
          };
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchEpisodes();
  }, [podcastShowName, accessToken]);

  console.log(showsEpisodes?.episodes);

  return (
    <section>
      <div className={podcastsShowsStyle["episodes-wrapper"]}>
        <div style={{fontSize: '1.2rem', color: 'white'}}>Episodes</div>
        <div className={podcastsShowsStyle['episodes-list']}>
          {showsEpisodes?.episodes.items.map((eachEpisode, i) => (
            <EpisodeCard eachEpisode={eachEpisode} key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default PodcastsShows;
