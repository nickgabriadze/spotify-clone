import { useState } from "react";
import { Playlist } from "../../../types/playlist";
import playlistsStyle from "../components/each-search-component/Playlists/playlists.module.css";
import NoPlaylistImage from "../components/each-search-component/icons/no-playlist-pic.webp";
import Play from "../components/each-search-component/Playlists/icons/play.svg";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import PlayResumeStreaming from "../../../api/player/playResumeStreaming";
import { setUserControlActions } from "../../../store/features/navigationSlice";

export function PlaylistCard({ eachPlaylist }: { eachPlaylist: Playlist }) {
  const [hoveringOver, setHoveringOver] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(
    (state) => state.spotiUserReducer.spotiToken.accessToken
  );
   
  return (
    <div
      className={playlistsStyle["playlist-card"]}
      onMouseOver={() => setHoveringOver(true)}
      onMouseOut={() => setHoveringOver(false)}
    >
      <div className={playlistsStyle["playlist-img"]}
      >
        <img
            alt={'Playlist image'}
          src={
            eachPlaylist.images[0]?.url
              ? eachPlaylist.images[0]?.url
              : NoPlaylistImage
          }
          height={160}
          width={160}
        ></img>
      </div>
      {hoveringOver && (
        <button
          onClick={async () => {
            await PlayResumeStreaming(accessToken, eachPlaylist.uri);
            dispatch(
              setUserControlActions({
                userAction: "Play Playlist",
              })
            );
          }}
          className={playlistsStyle["playlist-hover-button"]}
        >
          <img alt={"Play image"} src={Play} width={20} height={20}></img>
        </button>
      )}
      <div className={playlistsStyle["playlist-details"]}>
        <a>
          {eachPlaylist.name.length > 15
            ? eachPlaylist.name.slice(0, 16).concat("...")
            : eachPlaylist.name}
        </a>
        <p>
          By{" "}
          {eachPlaylist.owner.display_name.length > 15
            ? eachPlaylist.owner.display_name.slice(0, 16).concat("...")
            : eachPlaylist.owner.display_name}
        </p>
      </div>
    </div>
  );
}

export default PlaylistCard;
