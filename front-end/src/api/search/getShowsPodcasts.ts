import axiosInstance from "../../axios";
export async function getShowsPodcasts(accessToken: string, query: string) {
  const searching = query.split(" ").join("%20");

  return axiosInstance.get(
    `/search?q=${searching}&type=show%2Cepisode&limit=30`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export default getShowsPodcasts;
