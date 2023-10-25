import axiosInstance from "../../../axios.ts";

export async function getDiscography(accessToken: string, artistID: string) {


    return await axiosInstance.get(`/artists/${artistID}/albums?include_groups=album%2Csingle%2Cappears_on%2Ccompilation`,{
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default getDiscography;