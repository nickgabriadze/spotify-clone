import axiosInstance from "../axios";

export async function getGenres(accessToken: string) {
  return axiosInstance.get("/recommendations/available-genre-seeds", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export default getGenres;
