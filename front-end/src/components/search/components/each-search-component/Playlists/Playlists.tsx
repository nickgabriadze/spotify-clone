import playlistsStyle from "./playlists.module.css";
import { useState, useEffect } from "react";
import { Playlists } from "../../../../../types/playlist";
import { useAppSelector } from "../../../../../store/hooks";
import { getPlaylists } from "../../../../../api/search/getPlaylists";
import { PlaylistCard } from "../../../../../skeletons/playlistCardSekeleton";
import NoPlaylistImage from "../icons/no-playlist-pic.webp";

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
        ? Array.from({ length: 30 }).map((_, i) => <PlaylistCard key={i} />)
        : playlistsData?.items.map((eachPlaylist) => (
            <div
              key={eachPlaylist.id}
              className={playlistsStyle["playlist-card"]}
            >
              <div className={playlistsStyle["playlist-img"]}>
                <img
                  src={eachPlaylist.images[0]?.url ? eachPlaylist.images[0]?.url : NoPlaylistImage }
                  height={160}
                  width={160}
                ></img>
              </div>

              <div className={playlistsStyle["playlist-details"]}>
                <a>
                  {eachPlaylist.name.length > 15
                    ? eachPlaylist.name.slice(0, 16).concat("...")
                    : eachPlaylist.name}
                </a>
                <p>By {eachPlaylist.owner.display_name.length > 15 ? eachPlaylist.owner.display_name.slice(0, 16).concat("...") : eachPlaylist.owner.display_name}</p>
              </div>
            </div>
          ))}
    </section>
  );
}

export default PlaylistsRes;
