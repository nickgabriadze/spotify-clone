import albumsStyle from "./albums.module.css"
import {useState, useEffect} from "react";
import { useAppSelector } from "../../../../../store/hooks";
import getAlbums from "../../../../../api/search/getAlbums";
import { Albums } from "../../../../../types/album";
import AlbumCard from "../../../../../skeletons/albumCardSkeleton";

export function AlbumsRes({albumName} : {albumName : string}) {

    const [albumsData, setAlbumsData] = useState<Albums>();
    const [albumsLoading, setAlbumsLoading] = useState<boolean>(true);
    const [albumsError, setAlbumsError] = useState<boolean>(false);
    const accessToken = useAppSelector(
      (state) => state.spotiUserReducer.spotiToken.accessToken
    );
  
    useEffect(() => {
      const fetchPlaylists = async () => {
        try {
          setAlbumsLoading(true);
          const req = await getAlbums(albumName, accessToken);
          const data = req.data;
  
          setAlbumsData(data.albums);
        } catch (err) {
          setAlbumsError(true);
          console.error(err)
        } finally {
          setAlbumsLoading(false);
        }
      };
  
      fetchPlaylists();
    }, [accessToken, albumName]);
  
    return (
      <section className={albumsStyle["albums-grid"]}>
        {(albumsLoading || albumsError)
          ? Array.from({ length: 30 }).map((_, i) => <AlbumCard key={i} />)
          : albumsData?.items.map((eachAlbum) => (
              <div
                key={eachAlbum.id}
                className={albumsStyle["album-card"]}
              >
                <div className={albumsStyle["album-img"]}>
                  <img
                    src={eachAlbum.images[0]?.url }
                    height={160}
                    width={160}
                  ></img>
                </div>
  
                <div className={albumsStyle["album-details"]}>
                  <a>
                    {eachAlbum.name.length > 15
                      ? eachAlbum.name.slice(0, 16).concat("...")
                      : eachAlbum.name}
                  </a>
                  <p>{String(eachAlbum.release_date).slice(0, 4)} • {eachAlbum.artists.map((each) => each.name).join(", ").length > 15 ? eachAlbum.artists.map((each) => each.name).join(", ").slice(0, 16).concat("...") : eachAlbum.artists.map((each) => each.name).join(', ')}</p>
                </div>
              </div>
            ))}
      </section>
    );
    
}

export default AlbumsRes