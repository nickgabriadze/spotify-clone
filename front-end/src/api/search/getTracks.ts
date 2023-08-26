import axiosInstance from "../../axios";

export async function getTracks(apiUrl: string, accessToken: string) {
   
  return axiosInstance.get(apiUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export default getTracks;
