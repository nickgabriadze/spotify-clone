import { useEffect, useState } from "react";
import { useAppSelector } from "../../../../store/hooks";
import genresStyle from "./genres.module.css";
import getGenres from "../../../../api/getGenres";
import GenreCard from "../../reuseables/genreCard";
import GenreCardSkeleton from "../../../../skeletons/genreCardSkeleton";

export function Genres() {
  const colors: {
    [key: string]: { name: string; hex: string };
  } = {
    "0": { name: "Muted Red", hex: "#A93226" },
    "1": { name: "Dusty Blue", hex: "#3498DB" },
    "2": { name: "Worn Yellow", hex: "#D4AC0D" },
    "3": { name: "Olive Green", hex: "#6E7E22" },
    "4": { name: "Rust Orange", hex: "#D35400" },
    "5": { name: "Dusky Purple", hex: "#6C3483" },
    "6": { name: "Muted Pink", hex: "#D98880" },
    "7": { name: "Dull Teal", hex: "#21618C" },
    "8": { name: "Faded Yellow", hex: "#E6B20B" },
    "9": { name: "Subdued Green", hex: "#4B6B23" },
    "10": { name: "Vintage Pink", hex: "#E59866" },
    "11": { name: "Soft Blue", hex: "#6DAEDB" },
    "12": { name: "Muted Orange", hex: "#E67E22" },
    "13": { name: "Lavender Grey", hex: "#7D3C98" },
    "14": { name: "Washed Teal", hex: "#1F618D" },
    "15": { name: "Antique Gold", hex: "#C39D0B" },
    "16": { name: "Dull Olive", hex: "#717D7E" },
    "17": { name: "Faded Magenta", hex: "#8E44AD" },
    "18": { name: "Worn Blue", hex: "#1F618D" },
    "19": { name: "Dusty Rose", hex: "#C39BD3" },
    "20": { name: "Ash Grey", hex: "#BDC3C7" },
    "21": { name: "Muted Coral", hex: "#CB4335" },
    "22": { name: "Moss Green", hex: "#678F46" },
    "23": { name: "Aged Pink", hex: "#BB8FCE" },
    "24": { name: "Weathered Blue", hex: "#1E8449" },
    "25": { name: "Faded Turquoise", hex: "#2E86C1" },
    "26": { name: "Warm Grey", hex: "#979A9A" },
    "27": { name: "Dusky Coral", hex: "#D2527F" },
    "28": { name: "Dull Sage", hex: "#7D8C8E" },
    "29": { name: "Washed Purple", hex: "#9B59B6" },
    "30": { name: "Worn Green", hex: "#1B4F72" },
    "31": { name: "Faded Peach", hex: "#EC7063" },
    "32": { name: "Foggy Blue", hex: "#AAB7B8" },
    "33": { name: "Dusty Salmon", hex: "#E26A6A" },
    "34": { name: "Subdued Teal", hex: "#257884" },
    "35": { name: "Worn Gold", hex: "#D4AC0D" },
    "36": { name: "Aged Olive", hex: "#738678" },
    "37": { name: "Faded Lavender", hex: "#9A7D0A" },
    "38": { name: "Dull Plum", hex: "#6C3483" },
    "39": { name: "Muted Aqua", hex: "#4B77BE" },
    "40": { name: "Washed Coral", hex: "#A5694F" },
    "41": { name: "Vintage Grey", hex: "#839192" },
    "42": { name: "Desaturated Pink", hex: "#EBAEAE" },
    "43": { name: "Faded Mint", hex: "#7DCEA0" },
    "44": { name: "Worn Coral", hex: "#E68FAC" },
    "45": { name: "Dusky Blue", hex: "#6A89CC" },
    "46": { name: "Aged Green", hex: "#566573" },
    "47": { name: "Washed Lavender", hex: "#AEA8D3" },
    "48": { name: "Muted Mustard", hex: "#ADA869" },
    "49": { name: "Soft Grey", hex: "#D5DBDB" },
  };

  const accessToken = useAppSelector(
    (state) => state.spotiUserReducer.spotiToken.accessToken
  );
  const [genresLoading, setGenresLoading] = useState<boolean>(true);
  const [genres, setGenres] = useState<string[]>(Array.from({ length: 50 }));
  const [genresError, setGenresError] = useState<string | unknown>("");
  useEffect(() => {
    const controller = new AbortController();

    const fetchGenres = async () => {
      try {
        const req = await getGenres(accessToken);

        const data = req.data;

        setGenres(data.genres);
      } catch (err) {
        setGenresError(err);
      } finally {
        setGenresLoading(false);
      }
    };
    fetchGenres();

    return () => controller.abort();
  }, [accessToken]);




  return (
    <section className={genresStyle["genres-wrapper"]}>
      <h1>Browse all</h1>
      <div className={genresStyle["genre-card-grid"]}>
        {genres.slice(0, 50).map((eachGenre, i) => {
          if ((genresLoading || genresError)) {
            return <GenreCardSkeleton key={i} />;
          } else {
            return (
              <GenreCard key={i} genre={eachGenre} colorHex={colors[i].hex} />
            );
          }
        })}
      </div>
    </section>
  );
}

export default Genres;
