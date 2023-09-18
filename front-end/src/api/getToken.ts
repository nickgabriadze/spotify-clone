import axios, {AxiosResponse} from "axios";


export const fetchAccessToken = async (): Promise<AxiosResponse<any> | Awaited<{data: {
        accessToken: string,
        expires_in: string,
        refresh_token: string,
        token_type: "Bearer"
    }}>> => {
  if (!window.location.hash.includes("#")) {
    return axios
      .get("http://localhost:3001/authenticate")
      .then((res) => (window.location.href = res.data));
  } else {
    const access = window && window.location.hash
      .split("#")[1]
      .split("&")
      .map((each) => {
        const split = each.split("=");
        const key = split[0];
        const value = split[1];
          return JSON.parse(`{"${key}":"${value}"}`);
      }).reduce((acc, obj) => ({ ...acc, ...obj }), {});



    return Promise.resolve({data: access});
  }
  
};
export default fetchAccessToken;
