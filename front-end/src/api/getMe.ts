import axiosInstance from "../axios";

export async function getMe(accessToken: string) {



    return axiosInstance.get('/me', {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })

}

export default getMe;