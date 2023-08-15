
import axios from "axios";
import queryString from "query-string";

export const fetchAccessToken = async () => {
  return await axios.post(
    "https://accounts.spotify.com/api/token",
    queryString.stringify({
      grant_type: "client_credentials",
      client_id: `${import.meta.env.VITE_SPOTIFY_CLIENT_ID}`,
      client_secret: `${import.meta.env.VITE_SPOTIFY_CLIENT_SECRET}`,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};
export default fetchAccessToken;
