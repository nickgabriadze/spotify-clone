import axios from "axios";
import fetchAccessToken from "./api/getToken";

const axiosInstance = axios.create({
  baseURL: "https://api.spotify.com/v1", // Spotify API base URL
});

axiosInstance.interceptors.request.use(async (config) => {
  const currentTime = new Date().getTime() / 1000;

  const issued_at = Number(sessionStorage.getItem("issued_at"));

  if (currentTime - issued_at > 3600) {
    const requestAccessToken = await fetchAccessToken();
    const accessTokenData = requestAccessToken.data;

    config.headers.Authorization = `Bearer ${accessTokenData.access_token}`;
    return config;
  } else {
    return config;
  }
});

export default axiosInstance;
