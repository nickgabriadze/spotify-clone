import {Show} from "../../../types/show.ts";
import podcastsShowsStyle from "../components/each-search-component/PodcastsShows/podcastsShows.module.css";
import NoPlaylistImage from "../components/each-search-component/icons/no-playlist-pic.webp";


export function ShowPodcastCard({eachShowPodcast}: {eachShowPodcast:Show}) {
    console.log(eachShowPodcast)
    return (
        <div
            className={podcastsShowsStyle["showPodcast-card"]}
        >
            <div className={podcastsShowsStyle["showPodcast-img"]}
            >
                <img
                    alt={"Podcast/Show image"}
                    src={
                        eachShowPodcast.images[0]?.url
                            ? eachShowPodcast.images[0]?.url
                            : NoPlaylistImage
                    }
                    height={160}
                    width={160}
                ></img>
            </div>
            <div className={podcastsShowsStyle["showPodcast-details"]}>
                <a>
                    {eachShowPodcast.name.length > 15
                        ? eachShowPodcast.name.slice(0, 16).concat("...")
                        : eachShowPodcast.name}
                </a>
                <p>
                    By{" "}
                    {eachShowPodcast.publisher.length > 15
                        ? eachShowPodcast.publisher.slice(0, 16).concat("...")
                        : eachShowPodcast.publisher}
                </p>
            </div>
        </div>)

}

export default ShowPodcastCard;