import albumsStyle from "./albums.module.css";
import { useState, useEffect } from "react";
import { useAppSelector } from "../../../../../store/hooks";
import getAlbums from "../../../../../api/search/getAlbums";
import { Albums } from "../../../../../types/album";
import AlbumCardSkeleton from "../../../../../skeletons/albumCardSkeleton";
import AlbumCard from "../../../reuseables/albumCard";

export function AlbumsRes({ albumName }: { albumName: string }) {
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
        console.error(err);
      } finally {
        setAlbumsLoading(false);
      }
    };

    fetchPlaylists();
  }, [accessToken, albumName]);

  return (
    <section className={albumsStyle["albums-grid"]}>
      {albumsLoading || albumsError
        ? Array.from({ length: 30 }).map((_, i) => (
            <AlbumCardSkeleton key={i} />
          ))
        : albumsData?.items.map((eachAlbum) => (
            <AlbumCard key={eachAlbum.id} eachAlbum={eachAlbum} />
          ))}
    </section>
  );
}

export default AlbumsRes;
