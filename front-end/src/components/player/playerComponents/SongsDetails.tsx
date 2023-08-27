import { CurrentlyPlaying } from "../../../types/currentlyPlaying"
import playerStyle from "../player.module.css"
import Heart from "../icons/heart.svg";

export function SongDetails({currentlyPlaying}: {currentlyPlaying: CurrentlyPlaying | undefined}){

return (  <div className={playerStyle["currently-playing-info"]}>
<div className={playerStyle["currently-playing-info-album-img"]}>
  <img
    alt="Album picture"
    draggable={false}
    src={currentlyPlaying?.item?.album?.images[0]?.url}
    height={70}
    width={60}
  ></img>
</div>
<div className={playerStyle["song-info"]}>
  <a className={playerStyle["song-name"]}>
    {currentlyPlaying?.item?.name}
  </a>
  <div>
    {currentlyPlaying?.item?.artists.map((each, i) => (
      <a key={each.id} className={playerStyle["artists-name"]}>
        {each.name}
        {i === currentlyPlaying.item.artists.length - 1 ? "" : ", "}
      </a>
    ))}
  </div>
</div>
<img src={Heart} width={20} height={18} alt="heart icon"></img>
</div>)

}

export default SongDetails