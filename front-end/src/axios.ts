import axios from "axios";
import getRefreshedToken from "./api/getRefreshedToken";

const axiosInstance = axios.create({
  baseURL: "https://api.spotify.com/v1", // Spotify API base URL
});

axiosInstance.interceptors.request.use(async (config) => {
  const currentTime = new Date().getTime() / 1000;

  const issued_at = Number(localStorage.getItem("issued_at"));

  if (currentTime - issued_at > 3600) {
    const fetchAccessToken = await getRefreshedToken(
      String(localStorage.getItem("refresh_token"))
    );

    localStorage.setItem("issued_at", (new Date().getTime() / 1000).toString());

    localStorage.setItem("access_token", `${fetchAccessToken.data}`);
    window.dispatchEvent(new Event('localStorageChange'));
    config.headers.Authorization = `Bearer ${fetchAccessToken.data}`;

    return config;
  } else {
    return config;
  }
});

export default axiosInstance;
