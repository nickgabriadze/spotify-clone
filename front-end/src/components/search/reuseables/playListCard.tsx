import { Playlist } from "../../../types/playlist";
import playlistsStyle from "../components/each-search-component/Playlists/playlists.module.css";
import NoPlaylistImage from "../components/each-search-component/icons/no-playlist-pic.webp";

export function PlaylistCard({eachPlaylist}: {eachPlaylist: Playlist}) {
    
    return (<div
      
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
      </div>)
}

export default PlaylistCard