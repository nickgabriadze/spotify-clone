import axios from "axios";


export const fetchAccessToken = async () => {
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
        const obj = JSON.parse(`{"${key}":"${value}"}`);

        return obj;
      }).reduce((acc, obj) => ({ ...acc, ...obj }), {});



     
    return Promise.resolve({data: access});
  }
  
};
export default fetchAccessToken;
