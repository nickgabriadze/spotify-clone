import axios from "axios";
import getRefreshedToken from "./api/getRefreshedToken";

const axiosInstance = axios.create({
  baseURL: "https://api.spotify.com/v1", // Spotify API base URL
});

axiosInstance.interceptors.request.use(async (config) => {
  const currentTime = new Date().getTime() / 1000;

  const issued_at = Number(sessionStorage.getItem("issued_at"));

  if (currentTime - issued_at > 3600) {
    const fetchAccessToken = await getRefreshedToken(
      String(sessionStorage.getItem("refresh_token"))
    );

    sessionStorage.setItem("issued_at", (new Date().getTime() / 1000).toString());
    sessionStorage.setItem("accessToken", `${fetchAccessToken.data}`);
    window.dispatchEvent(new Event('sessionStorageChange'));
    config.headers.Authorization = `Bearer ${fetchAccessToken.data}`;

    return config;
  } else {
    return config;
  }
});

export default axiosInstance;
