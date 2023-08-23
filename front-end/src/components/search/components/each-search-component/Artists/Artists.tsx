import getArtists from "../../../../../api/search/getArtists";
import ArtistCard from "../../../../../skeletons/artistCardSekeleton";
import { useAppSelector } from "../../../../../store/hooks";
import { Artists } from "../../../../../types/artist";
import SpotiError from "../../../../Error";
import artistsStyle from "./artists.module.css";
import { useState, useEffect } from "react";
import NoArtistImage from "../icons/no-artist-pic.webp";

export function ArtistsRes({ artistsName }: { artistsName: string }) {
  const [artistsData, setArtistsData] = useState<Artists>();
  const [artistsLoading, setArtistsLoading] = useState<boolean>(true);
  const [artistsError, setArtistsError] = useState<string | unknown>();
  const access = useAppSelector((state) => state.spotiUserReducer.spotiToken);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setArtistsLoading(true);
        const req = await getArtists(artistsName, access.accessToken);
        const data = req.data;
        setArtistsData(data.artists);
      } catch (err) {
        setArtistsError(err);
      } finally {
        setArtistsLoading(false);
      }
    };
    fetchArtists();
  }, [access.accessToken, artistsName]);

  if (artistsError) {
    return <SpotiError />;
  }

  return (
    <div className={artistsStyle["artists-wrapper"]}>
      {artistsLoading
        ? Array.from({ length: 30 }).map((_, i) => <ArtistCard key={i} />)
        : artistsData?.items?.map((each) => (
            <div
              key={each.id}
              className={artistsStyle["each-artist"]}
              style={{ color: "white" }}
            >
              <div className={artistsStyle["artist-img"]}>
                {each.images[0]?.url ? (
                  <img
                    draggable={false}
                    src={each.images[0]?.url}
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
                  {each.name.length > 21
                    ? each.name.slice(0, 22).concat("...")
                    : each.name}
                </a>
                <p>{each.type[0].toUpperCase().concat(each.type.slice(1))}</p>
              </div>
            </div>
          ))}
    </div>
  );
}

export default ArtistsRes;
