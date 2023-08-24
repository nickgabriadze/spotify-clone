import { Album } from "../../../types/album";
import albumsStyle from "../components/each-search-component/Albums/albums.module.css";
export function AlbumCard({ eachAlbum }: { eachAlbum: Album }) {
  return (
    <div className={albumsStyle["album-card"]}>
      <div className={albumsStyle["album-img"]}>
        <img src={eachAlbum.images[0]?.url} height={160} width={160}></img>
      </div>

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
