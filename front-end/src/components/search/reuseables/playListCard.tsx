import {useEffect, useState} from "react";
import { Playlist } from "../../../types/playlist";
import playlistsStyle from "../components/each-search-component/Playlists/playlists.module.css";
import NoPlaylistImage from "../components/each-search-component/icons/no-playlist-pic.webp";
import Play from "../components/each-search-component/Playlists/icons/play.svg";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import PlayResumeStreaming from "../../../api/player/playResumeStreaming";
import { setUserControlActions } from "../../../store/features/navigationSlice";
import getPlaylist from "../../../api/search/getPlaylist.ts";


export function PlaylistCardApi({playlistID} : {playlistID: string}){
  const [singlePlayList, setSinglePlaylist] = useState<Playlist | undefined>();
   const accessToken = useAppSelector(
    (state) => state.spotiUserReducer.spotiToken.accessToken
  );
  useEffect(() => {
    const getSinglePlaylist = async () => {
      try{
        const playlistData = (await getPlaylist(accessToken, playlistID)).data;
        setSinglePlaylist(playlistData)
      }catch(err){}
    }
    getSinglePlaylist()
  }, [accessToken, playlistID]);

  return <PlaylistCard eachPlaylist={singlePlayList}/>
}

export function PlaylistCard({ eachPlaylist }: { eachPlaylist: Playlist | undefined }) {
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
            eachPlaylist?.images[0]?.url
              ? eachPlaylist?.images[0]?.url
              : NoPlaylistImage
          }
          height={160}
          width={160}
        ></img>
      </div>
      {hoveringOver && (
        <button
          onClick={async () => {
            await PlayResumeStreaming(accessToken, eachPlaylist?.uri);
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
          {Number(eachPlaylist?.name?.length) > 15
            ? eachPlaylist?.name.slice(0, 16).concat("...")
            : eachPlaylist?.name}
        </a>
        <p>
          By{" "}
          {Number(eachPlaylist?.owner.display_name.length) > 15
            ? eachPlaylist?.owner.display_name.slice(0, 16).concat("...")
            : eachPlaylist?.owner.display_name}
        </p>
      </div>
    </div>
  );
}

export default PlaylistCard;
