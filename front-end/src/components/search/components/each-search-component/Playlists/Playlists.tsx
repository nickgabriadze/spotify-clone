import playlistsStyle from "./playlists.module.css";
import { useState, useEffect } from "react";
import { Playlists } from "../../../../../types/playlist";
import { useAppSelector } from "../../../../../store/hooks";
import { getPlaylists } from "../../../../../api/search/getPlaylists";

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
      } catch (_) {
        setPlaylistsError(true);
      } finally {
        setPlaylistsLoading(false);
      }
    };

    fetchPlaylists();
  }, [accessToken, playlistName]);

  return (
    <section className={playlistsStyle["playlists-grid"]}>
      {playlistsData?.items.map((eachPlaylist) => (
        <div key={eachPlaylist.id} className={playlistsStyle["playlist-card"]}>
          
            <div className={playlistsStyle["playlist-img"]}>
              <img
                src={eachPlaylist.images[0].url}
                height={160}
                width={160}
              ></img>
            </div>

            <div className={playlistsStyle["playlist-details"]}>
              <a>
                {eachPlaylist.name.length > 21
                  ? eachPlaylist.name.slice(0, 22).concat("...")
                  : eachPlaylist.name}
              </a>
              <p>By {eachPlaylist.owner.display_name}</p>
            </div>
          </div>
        
      ))}
    </section>
  );
}

export default PlaylistsRes;
