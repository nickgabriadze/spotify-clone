import axiosInstance from "../axios";

export function getGenres(accessToken: string) {
  return axiosInstance.get("/recommendations/available-genre-seeds", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export default getGenres;
