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
import SearchError from "../../../../Errors/SearchError.tsx";

export function AllResults({searchQuery}: { searchQuery: string }) {
    const spotiUserToken = useAppSelector((state) => state.spotiUserReducer.spotiToken.accessToken);
    const [allResultsData, setAllResultsData] = useState<AllSearch>();
    const [resultsLoading, setResultsLoading] = useState<boolean>(true);
    const [episodesData, setEpisodesData] = useState<EpisodeWithShow[]>([]);
    const [episodeDataLoading, setEpisodeDataLoading] = useState<boolean>(true)
    const itemQuantity = useAppSelector(s => s.spotiUserReducer.numberOfItemsToBeShown)
    const [error, setError] = useState<boolean>(false);
    const [episodesError, setEpisodesError] = useState<boolean>(false);
    useEffect
    (() => {
        const fetchAll = async () => {
            setResultsLoading(true)
            try {
                const requestAll = await searchAll(searchQuery, spotiUserToken);
                const data = requestAll.data;
                setAllResultsData(data);
            } catch (e) {
                setError(true);
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
                setEpisodesError(true)
            } finally {
                setEpisodeDataLoading(false)
            }
        }
        fetchEpisodeDetails()

    }, [spotiUserToken, searchQuery, resultsLoading]);


    if(error){
        return <SearchError />
    }

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
                    {resultsLoading ? Array.from({length: itemQuantity}).map((_, i) => <ArtistCardSkeleton
                        key={i}/>) : allResultsData?.artists.items.slice(0, itemQuantity).map((eachArtist, i) => <ArtistCard
                        fromSearch={true}
                        eachArtist={eachArtist} key={i}/>)}
                </div>
            </div>}

        {Number(allResultsData?.albums.items.length) > 0 &&
            <div className={allResultsStyle['top-albums-wrapper']}>
                <h2>Albums</h2>
                <div className={allResultsStyle['top-albums']}>
                    {resultsLoading ? Array.from({length: itemQuantity}).map((_, i) => <AlbumCardSkeleton
                        key={i}/>) : allResultsData?.albums.items.slice(0, itemQuantity).map((eachAlbum, i) => <AlbumCard
                        fromSearch={true}
                        eachAlbum={eachAlbum} key={i}/>)}
                </div>
            </div>
        }

        {Number(allResultsData?.playlists.items.length) > 0 &&
            <div className={allResultsStyle['top-playlists-wrapper']}>
                <h2>Playlists</h2>
                <div className={allResultsStyle['top-playlists']}>
                    {resultsLoading ? Array.from({length: itemQuantity}).map((_, i) => <PlaylistCardSkeleton
                        key={i}/>) : allResultsData?.playlists.items.slice(0, itemQuantity).map((eachPlaylist, i) => <PlaylistCard
                        fromSearch={true}
                        eachPlaylist={eachPlaylist} key={i}/>)}
                </div>
            </div>
        }

        {Number(allResultsData?.shows.items.length) > 0 &&
            <div className={allResultsStyle['top-podcasts-wrapper']}>
                <h2>Podcasts</h2>
                <div className={allResultsStyle['top-podcasts']}>
                    {resultsLoading ? Array.from({length: itemQuantity}).map((_, i) => <PlaylistCardSkeleton
                        key={i}/>) : allResultsData?.shows.items.slice(0, itemQuantity).map((eachShowPodcast, i) =>
                        <ShowPodcastCard
                            eachShowPodcast={eachShowPodcast} key={i}/>)}
                </div>
            </div>}

        {
            Number(episodesData.length) > 0 && !episodesError &&
            <div className={allResultsStyle['top-episodes-wrapper']}>
                <h2>Episodes</h2>
                <div className={allResultsStyle['top-episodes']}>
                    {episodeDataLoading || resultsLoading ? Array.from({length: itemQuantity}).map((_, i) =>
                            <TopEpisodeCardSkeleton key={i}/>) :
                        episodesData.slice(0, itemQuantity).map((eachEpisode, i) => <TopEpisodeCard eachEpisode={eachEpisode}
                                                                                         key={i}/>)
                    }
                </div>
            </div>
        }
    </div>
}


export default AllResults;
