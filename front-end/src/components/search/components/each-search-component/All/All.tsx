import {useEffect, useState} from "react";
import {useAppSelector} from "../../../../../store/hooks.ts";
import {searchAll} from "../../../../../api/search/searchAll.ts";
import {AllSearch} from "../../../../../types/allSearch.ts";
import TopResult from "./innerComponents/TopResult.tsx";
import allResultsStyle from "./allresults.module.css";
import Songs from "./innerComponents/Songs.tsx";
import ArtistCard from "../../../reuseables/artistCard.tsx";
import ArtistCardSkeleton from "../../../../../skeletons/artistCardSkeleton.tsx";
import AlbumCardSkeleton from "../../../../../skeletons/albumCardSkeleton.tsx";
import AlbumCard from "../../../reuseables/albumCard.tsx";
import PlaylistCard from "../../../reuseables/playListCard.tsx";
import PlaylistCardSkeleton from "../../../../../skeletons/playlistCardSekeleton.tsx";
import ShowPodcastCard from "../../../reuseables/showPodcastCard.tsx";
import {EpisodeWithShow} from "../../../../../types/episode.ts";
import getEpisodes from "../../../../../api/search/getEpisodes.ts";
import TopEpisodeCard from "../../../reuseables/topEpisodeCard.tsx";
import TopEpisodeCardSkeleton from "../../../../../skeletons/topEpisodeCardSkeleton.tsx";

export function AllResults({searchQuery}: { searchQuery: string }) {
    const spotiUserToken = useAppSelector((state) => state.spotiUserReducer.spotiToken.accessToken);
    const [allResultsData, setAllResultsData] = useState<AllSearch>();
    const [resultsLoading, setResultsLoading] = useState<boolean>(true);
    const [episodesData, setEpisodesData] = useState<EpisodeWithShow[]>([]);
    const [episodeDataLoading, setEpisodeDataLoading] = useState<boolean>(true)
    useEffect
    (() => {
        const fetchAll = async () => {
            setResultsLoading(true)
            try {
                const requestAll = await searchAll(searchQuery, spotiUserToken);
                const data = requestAll.data;
                setAllResultsData(data);
            } catch (e) {
                console.log(e)
            } finally {
                setResultsLoading(false)
            }
        }

        fetchAll()
    }, [spotiUserToken, searchQuery]);

    useEffect(() => {

        const fetchEpisodeDetails = async () => {
            try {
                setEpisodeDataLoading(true)
                const episodeIds = allResultsData?.episodes?.items?.map((each) => String(each.id)).join(",")
                const episodesData = await getEpisodes(spotiUserToken, String(episodeIds))
                const data = episodesData.data.episodes;
                setEpisodesData(data);

            } catch (e) {
                console.log(e)
            } finally {
                setEpisodeDataLoading(false)
            }
        }
        fetchEpisodeDetails()

    }, [spotiUserToken, searchQuery, resultsLoading]);


    return <div className={allResultsStyle['all-wrapper']}>
        <div className={allResultsStyle['first-row']}>
            <TopResult topSong={allResultsData?.tracks?.items[0]} accessToken={spotiUserToken}
                       resultsLoading={resultsLoading}/>
            <Songs firstFour={allResultsData?.tracks?.items?.slice(0, 4)} resultsLoading={resultsLoading}/>
        </div>
        {Number(allResultsData?.artists?.items?.length) > 0 &&
            <div className={allResultsStyle['top-artists-wrapper']}>
                <h2>Artists</h2>
                <div className={allResultsStyle['top-artists']}>
                    {resultsLoading ? Array.from({length: 5}).map((_, i) => <ArtistCardSkeleton
                        key={i}/>) : allResultsData?.artists.items.slice(0, 5).map((eachArtist, i) => <ArtistCard
                        eachArtist={eachArtist} key={i}/>)}
                </div>
            </div>}

        {Number(allResultsData?.albums.items.length) > 0 &&
            <div className={allResultsStyle['top-albums-wrapper']}>
                <h2>Albums</h2>
                <div className={allResultsStyle['top-albums']}>
                    {resultsLoading ? Array.from({length: 5}).map((_, i) => <AlbumCardSkeleton
                        key={i}/>) : allResultsData?.albums.items.slice(0, 5).map((eachAlbum, i) => <AlbumCard
                        eachAlbum={eachAlbum} key={i}/>)}
                </div>
            </div>
        }

        {Number(allResultsData?.playlists.items.length) > 0 &&
            <div className={allResultsStyle['top-playlists-wrapper']}>
                <h2>Playlists</h2>
                <div className={allResultsStyle['top-playlists']}>
                    {resultsLoading ? Array.from({length: 5}).map((_, i) => <PlaylistCardSkeleton
                        key={i}/>) : allResultsData?.playlists.items.slice(0, 5).map((eachPlaylist, i) => <PlaylistCard
                        eachPlaylist={eachPlaylist} key={i}/>)}
                </div>
            </div>
        }

        {Number(allResultsData?.shows.items.length) > 0 &&
            <div className={allResultsStyle['top-podcasts-wrapper']}>
                <h2>Podcasts</h2>
                <div className={allResultsStyle['top-podcasts']}>
                    {resultsLoading ? Array.from({length: 5}).map((_, i) => <PlaylistCardSkeleton
                        key={i}/>) : allResultsData?.shows.items.slice(0, 5).map((eachShowPodcast, i) =>
                        <ShowPodcastCard
                            eachShowPodcast={eachShowPodcast} key={i}/>)}
                </div>
            </div>}

        {
            Number(episodesData.length) > 0 &&
            <div className={allResultsStyle['top-episodes-wrapper']}>
                <h2>Episodes</h2>
                <div className={allResultsStyle['top-episodes']}>
                    {episodeDataLoading || resultsLoading ? Array.from({length: 5}).map((_, i) =>
                            <TopEpisodeCardSkeleton key={i}/>) :
                        episodesData.map((eachEpisode, i) => <TopEpisodeCard eachEpisode={eachEpisode}
                                                                             key={i}/>)
                    }
                </div>
            </div>
        }
    </div>
}


export default AllResults;
