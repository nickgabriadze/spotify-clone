import { useState } from "react";
import { Album } from "../../../types/album";
import albumsStyle from "../components/each-search-component/Albums/albums.module.css";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import Play from "../components/each-search-component/Playlists/icons/play.svg";
import PlayResumeStreaming from "../../../api/player/playResumeStreaming";
import { setUserControlActions } from "../../../store/features/navigationSlice";

export function AlbumCard({ eachAlbum }: { eachAlbum: Album }) {
  const [hoveringOver, setHoveringOver] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.spotiUserReducer.spotiToken.accessToken);

  return (
    <div className={albumsStyle["album-card"]}
    onMouseOver={() => setHoveringOver(true)}
    onMouseOut={() => setHoveringOver(false)}>
      <div className={albumsStyle["album-img"]}>
        <img src={eachAlbum.images[0]?.url} height={160} width={160}></img>
      </div>

      {hoveringOver && (
        <button 
        onClick={async () => {await PlayResumeStreaming(accessToken, eachAlbum.uri);
        dispatch(setUserControlActions({
          userAction: 'Play Album'
        }))
        }}
        className={albumsStyle["album-hover-button"]}>
          <img src={Play} width={20} height={20}></img>
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
