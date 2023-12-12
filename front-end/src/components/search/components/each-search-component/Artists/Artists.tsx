import getArtists from "../../../../../api/search/getArtists";
import ArtistCardSkeleton from "../../../../../skeletons/artistCardSkeleton.tsx";
import { useAppSelector } from "../../../../../store/hooks";
import { Artists } from "../../../../../types/artist";
import SpotiError from "../../../../Errors/Error.tsx";
import ArtistCard from "../../../reuseables/artistCard";
import artistsStyle from "./artists.module.css";
import { useState, useEffect } from "react";


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
        const data = req.data.artists;

        setArtistsData(data);
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
        ? Array.from({ length: 30 }).map((_, i) => <ArtistCardSkeleton key={i} />)
        : artistsData?.items?.map((eachArtist) => (
            <ArtistCard key={eachArtist.id} eachArtist={eachArtist} fromSearch={true}/>
          ))}
    </div>
  );
}

export default ArtistsRes;
