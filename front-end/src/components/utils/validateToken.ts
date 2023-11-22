import getRefreshedToken from "../../api/getRefreshedToken.ts";

export async function validateToken(): Promise<string> {
    const currentTime = new Date().getTime() / 1000;
    const issued_at = Number(localStorage.getItem("issued_at"));

    if (currentTime - issued_at > 3600) {
        const fetchedAccessToken = (await getRefreshedToken(
            String(localStorage.getItem("refresh_token")),
            String(localStorage.getItem("CID")),
            String(localStorage.getItem("SID"))
        )).data;


        localStorage.setItem("issued_at", (new Date().getTime() / 1000).toString());

        localStorage.setItem("access_token", `${fetchedAccessToken}`);
        return fetchedAccessToken
    }else{
        return String(localStorage.getItem('access_token'));
    }
}

export default validateToken;