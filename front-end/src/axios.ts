import axios from "axios";
import { updateAccessTokenASync } from "./store/features/spotiUserSlice";
import { SpotiStore } from "./store/store";

const axiosInstance = axios.create({
  baseURL: "https://api.spotify.com/v1", // Spotify API base URL
});

axiosInstance.interceptors.request.use(async (config) => {
  const currentTime = new Date().getTime() / 1000;

  const issued_at = Number(sessionStorage.getItem("issued_at"));

  if (currentTime - issued_at > 3600) {
    SpotiStore.dispatch(updateAccessTokenASync());

    const accessToken = sessionStorage.getItem("accessToken");

    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  } else {
    return config;
  }
});

export default axiosInstance;
