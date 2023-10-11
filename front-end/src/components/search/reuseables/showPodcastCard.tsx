import {Show} from "../../../types/show.ts";
import podcastsShowsStyle from "../components/each-search-component/PodcastsShows/podcastsShows.module.css";
import NoPodcastPic from "../components/each-search-component/icons/no-podcast-pic.svg"

export function ShowPodcastCard({eachShowPodcast}: { eachShowPodcast: Show }) {

    return (
        <div
            className={podcastsShowsStyle["showPodcast-card"]}
        >
            <div className={podcastsShowsStyle['showPodcast-inner-part']}>
            <div className={podcastsShowsStyle["showPodcast-img"]}
            >
                {eachShowPodcast.images[0]?.url ?
                    <img
                        alt={"Podcast/Show image"}
                        src={
                            eachShowPodcast.images[0]?.url
                        }

                    ></img>
                    :
                    <img
                        style={{
                            padding: '10px',
                            backgroundColor: '#302f2f',
                            borderRadius: '5px',
                        }}
                        alt={"Podcast/Show image"}
                        src={
                            NoPodcastPic
                        }

                    ></img>
                }
            </div>
            <div className={podcastsShowsStyle["showPodcast-details"]}>
                <a>
                    {eachShowPodcast.name.length > 15
                        ? eachShowPodcast.name.slice(0, 10).concat("...")
                        : eachShowPodcast.name}
                </a>
                <p>
                    By{" "}
                    {eachShowPodcast.publisher.length > 15
                        ? eachShowPodcast.publisher.slice(0, 15).concat("...")
                        : eachShowPodcast.publisher}
                </p>
            </div>
                </div>
        </div>)

}

export default ShowPodcastCard;