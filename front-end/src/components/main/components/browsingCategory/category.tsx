import categoryStyle from './category.module.css'
import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../../store/hooks.ts";
import getCategoryPlaylist from "../../../../api/main/browsingCategory/getCategoryPlaylist.ts";
import {Playlists} from "../../../../types/playlist.ts";
import PlaylistCard from "../../../search/reuseables/playListCard.tsx";
import {navigateToDirection} from "../../../../store/features/navigationSlice.ts";
import {useParams} from "react-router-dom";

export function CategoryPage() {
    const {genreID} = useParams();
    const [playlistsData, setPlaylistsData] = useState<Playlists>();
    const accessToken = useAppSelector(s => s.spotiUserReducer.spotiToken.accessToken);
    const dispatch = useAppDispatch();
    useEffect(() => {
        const getCategoryPlaylists = async () => {
            try {
                const myCategory = await getCategoryPlaylist(accessToken, String(genreID));
                const data = myCategory.data.playlists;
                setPlaylistsData(data)

            } catch (err:any) {
                  if(err.response.status){
                      dispatch(navigateToDirection("BACK"))
                  }
            } finally {


            }
        }

        getCategoryPlaylists();
    }, [accessToken, String(genreID)]);



    document.title = `Explore}`
    return <section
        className={categoryStyle['category-wrapper']}

    >
        <h1>Explore</h1>

        <div className={categoryStyle['category-playlists-wrapper']}>{playlistsData && playlistsData?.items.map((eachPlaylist, i) => <PlaylistCard playlistDescription={true} eachPlaylist={eachPlaylist}
                                                                                   key={i}/>)}</div></section>
}

export default CategoryPage;