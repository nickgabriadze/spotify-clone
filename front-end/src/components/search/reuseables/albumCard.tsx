import { useState } from "react";
import { Album } from "../../../types/album";
import albumsStyle from "../components/each-search-component/Albums/albums.module.css";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import Play from "../components/each-search-component/Playlists/icons/play.svg";
import PlayResumeStreaming from "../../../api/player/playResumeStreaming";
import { setUserControlActions } from "../../../store/features/navigationSlice";
import Pause from "../components/each-search-component/Playlists/icons/pause.svg";
import PauseStreaming from "../../../api/player/pauseStreaming";

export function AlbumCard({ eachAlbum }: { eachAlbum: Album }) {
  const [hoveringOver, setHoveringOver] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.spotiUserReducer.spotiToken.accessToken);
  const currentlyPlaying = useAppSelector((state) => state.navigationReducer.currentlyPlayingSong);
  return (
    <div className={albumsStyle["album-card"]}
    onMouseOver={() => setHoveringOver(true)}
    onMouseOut={() => setHoveringOver(false)}>
      <div className={albumsStyle["album-img"]}>
        <img src={eachAlbum.images[0]?.url} height={160} width={160}></img>
      </div>

      {hoveringOver && (
        <button 
      
        className={albumsStyle["album-hover-button"]}
        onClick={async () => {
          if (currentlyPlaying.albumID === eachAlbum.id) {
            if (!currentlyPlaying.isPlaying) {
              await PlayResumeStreaming(accessToken);
              dispatch(
                setUserControlActions({
                  userAction: "Play Album",
                })
              );
            } else {
              await PauseStreaming(accessToken);
              dispatch(
                setUserControlActions({
                  userAction: "Pause Album",
                })
              );
            }
          } else {
            await PlayResumeStreaming(accessToken, eachAlbum.uri);
            dispatch(
              setUserControlActions({
                userAction: "Play Album",
              })
            );
          }
        }}
        >
        {currentlyPlaying.albumID === eachAlbum.id &&
          currentlyPlaying.isPlaying ? (
           <div>
            <img src={Pause} width={30} height={30}></img>
            </div>
          ) : (
            <div>
            <img src={Play} width={50} height={50}></img>
            </div>
          )}
        </button>
      )}
      <div className={albumsStyle["album-details"]}>
        <a>
          {eachAlbum.name.length > 15
            ? eachAlbum.name.slice(0, 16).concat("...")
            : eachAlbum.name}
        </a>
        <p>
          {String(eachAlbum.release_date).slice(0, 4)} •{" "}
          {eachAlbum.artists.map((each) => each.name).join(", ").length > 20
            ? eachAlbum.artists
                .map((each) => each.name)
                .join(", ")
                .slice(0, 21)
                .concat("...")
            : eachAlbum.artists.map((each) => each.name).join(", ")}
        </p>
      </div>
    </div>
  );
}

export default AlbumCard;
