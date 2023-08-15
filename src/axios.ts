import axios from 'axios';
import fetchAccessToken from './api/getToken';

const axiosInstance = axios.create({
  baseURL: 'https://api.spotify.com/v1', // Spotify API base URL
});

axiosInstance.interceptors.request.use(async (config) => {


  
  const requestAccessToken = await fetchAccessToken(); 
  const accessTokenData = requestAccessToken.data;
 
  config.headers.Authorization = `Bearer ${accessTokenData.access_token}`;
  return config;
});

export default axiosInstance;