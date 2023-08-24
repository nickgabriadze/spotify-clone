import artistsStyle from "../components/each-search-component/Artists/artists.module.css";
import { Artist } from "../../../types/artist";
import NoArtistImage from "../components/each-search-component/icons/no-artist-pic.webp";

export function ArtistCard({ eachArtist }: { eachArtist: Artist }) {
  return (
    <div
      className={artistsStyle["each-artist"]}
      style={{ color: "white" }}
    >
      <div className={artistsStyle["artist-img"]}>
        {eachArtist.images[0]?.url ? (
          <img
            draggable={false}
            src={eachArtist.images[0]?.url}
            width={150}
            height={150}
          ></img>
        ) : (
          <img
            className={artistsStyle["no-artist-img"]}
            draggable={false}
            src={NoArtistImage}
            width={150}
            height={150}
          ></img>
        )}
      </div>

      <div className={artistsStyle["artist-info"]}>
        <a>
          {eachArtist.name.length > 21
            ? eachArtist.name.slice(0, 22).concat("...")
            : eachArtist.name}
        </a>
        <p>
          {eachArtist.type[0].toUpperCase().concat(eachArtist.type.slice(1))}
        </p>
      </div>
    </div>
  );
}

export default ArtistCard;
