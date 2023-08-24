import playlistsStyle from "./playlists.module.css";
import { useState, useEffect } from "react";
import { Playlists } from "../../../../../types/playlist";
import { useAppSelector } from "../../../../../store/hooks";
import { getPlaylists } from "../../../../../api/search/getPlaylists";
import PlaylistCardSkeleton  from "../../../../../skeletons/playlistCardSekeleton";
import PlaylistCard from "../../../reuseables/playListCard";

export function PlaylistsRes({ playlistName }: { playlistName: string }) {
  const [playlistsData, setPlaylistsData] = useState<Playlists>();
  const [playlistsLoading, setPlaylistsLoading] = useState<boolean>(true);
  const [playlistsError, setPlaylistsError] = useState<boolean>(false);
  const accessToken = useAppSelector(
    (state) => state.spotiUserReducer.spotiToken.accessToken
  );

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setPlaylistsLoading(true);
        const req = await getPlaylists(playlistName, accessToken);
        const data = req.data;

        setPlaylistsData(data.playlists);
      } catch (err) {
        setPlaylistsError(true);
        console.error(err)
      } finally {
        setPlaylistsLoading(false);
      }
    };

    fetchPlaylists();
  }, [accessToken, playlistName]);

  return (
    <section className={playlistsStyle["playlists-grid"]}>
      {playlistsLoading || playlistsError
        ? Array.from({ length: 30 }).map((_, i) => <PlaylistCardSkeleton key={i} />)
        : playlistsData?.items.map((eachPlaylist) => (
          <PlaylistCard key={eachPlaylist.id} eachPlaylist={eachPlaylist}/>
          ))}
    </section>
  );
}

export default PlaylistsRes;
