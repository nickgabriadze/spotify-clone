import express, { query } from "express";
import cors from "cors";
import dotenv from "dotenv";
import queryString from "query-string";
import { v4 } from "uuid";
import axios from "axios";

dotenv.config();

const CLIENT_ID: string = process.env.VITE_SPOTIFY_CLIENT_ID
  ? process.env.VITE_SPOTIFY_CLIENT_ID
  : "";
const CLIENT_SECRET: string = process.env.VITE_SPOTIFY_CLIENT_SECRET
  ? process.env.VITE_SPOTIFY_CLIENT_SECRET
  : "";
const redirect_uri = "http://localhost:3001/callback";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/authenticate", (req, res) => {
  const scope =
    "ugc-image-upload user-read-playback-state user-modify-playback-state user-read-currently-playing app-remote-control streaming playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-follow-modify user-follow-read user-read-playback-position user-top-read user-read-recently-played user-library-modify user-library-read user-read-email user-read-private";
  const state = v4();
  res.send(
    "https://accounts.spotify.com/authorize?" +
      queryString.stringify({
        response_type: "code",
        client_id: CLIENT_ID,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  );
});

app.get("/callback", async (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;

  if (state === null) {
    res.redirect(
      "/#" +
        queryString.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    try {
      const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        null,
        {
          params: {
            code: code,
            redirect_uri: redirect_uri,
            grant_type: "authorization_code",
          },
          headers: {
            Authorization:
              "Basic " +
              Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
          },
        }
      );

      const acccess = response.data;

      res.redirect(
        "http://localhost:5173/#" +
          queryString.stringify({
            accessToken: acccess.access_token,
            token_type: "Bearer",
            expires_in: 3600,
            refresh_token: acccess.refresh_token,
          })
      );
    } catch (error) {
      // Handle errors appropriately
      res.status(500).send("Error occurred");
    }
  }
});

app.get("/refresh_token", async (req, res) => {
  const refresh_token = req.query.q;
  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
    },
    method: "POST",
    json: true,
    data: queryString.stringify({
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    }),
  };

  

  axios(authOptions)
    .then((result) => {
      res.send(result.data.access_token);
    })
    .catch((err) => res.send(err));
});

app.listen(3001, () => {
  console.log("Running on port 3001");
});
