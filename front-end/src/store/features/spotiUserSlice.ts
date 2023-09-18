import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetchAccessToken from "../../api/getToken";
import getRefreshedToken from "../../api/getRefreshedToken";

interface TokenData {
  accessToken: string;
  token_type: "Bearer";
  refresh_token: string;
  expires_in: number;
}

export const fetchTokenAsync = createAsyncThunk(
  "spotify/token",
  async (): Promise<TokenData> => {
    const req = await fetchAccessToken();
    history.replaceState({}, document.title, window.location.pathname);
    return req.data;
  }
);

export const updateAccessTokenASync = createAsyncThunk(
  "spotifyAccessNew/token",
  async (): Promise<TokenData> => {
    const refreshToken = String(sessionStorage.getItem("refresh_token"));
    const requestAccessToken = await getRefreshedToken(refreshToken);
    sessionStorage.setItem("accessToken", requestAccessToken.data);

    return requestAccessToken.data;
  }
);

interface SpotiUser {
  spotiToken: {
    accessToken: string;
    token_type: "Bearer";
    expires_in: number;
    issued_at: number;
    refresh_token: string;
  };
}

const initialState: SpotiUser = {
  spotiToken: {
    accessToken: "",
    token_type: "Bearer",
    expires_in: 0,
    issued_at: 0,
    refresh_token: "",
  },
};

const spotiUserSlice = createSlice({
  name: "Spoti User Slice",
  initialState,
  reducers: {
    setToken: (
      state,
      action: {
        payload: { accessToken: string };
      }
    ) => {
      return {
        ...state,
        spotiToken: {
          ...state.spotiToken,
          accessToken: action.payload.accessToken,
        },
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      updateAccessTokenASync.fulfilled,
      (
        state,
        action: {
          payload: {
            accessToken: string;
          };
        }
      ) => {
        const currentTime = new Date().getTime() / 1000;
        sessionStorage.setItem("issued_at", currentTime.toString());

        return {
          ...state,
          spotiToken: {
            ...state.spotiToken,
            accessToken: action.payload?.accessToken,
          },
        };
      }
    );

    builder.addCase(
      updateAccessTokenASync.pending,
      (
        state,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _
      ) => {
        return {
          ...state,
          spotiToken: {
            ...state.spotiToken,
            accessToken: "pending",
          },
        };
      }
    );

    builder.addCase(
      updateAccessTokenASync.rejected,
      (
        state,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _
      ) => {
        return {
          ...state,
          spotiToken: {
            ...state.spotiToken,
            accessToken: "access revoked",
          },
        };
      }
    );

    builder.addCase(
      fetchTokenAsync.fulfilled,
      (
        state,
        action: {
          payload: TokenData;
        }
      ) => {
        const currentTime = new Date().getTime() / 1000;
        sessionStorage.setItem("issued_at", currentTime.toString());
        sessionStorage.setItem("refresh_token", action.payload?.refresh_token);

        return {
          ...state,
          spotiToken: {
            accessToken: action.payload?.accessToken,
            token_type: "Bearer",
            refresh_token: action.payload?.refresh_token,
            expires_in: 3600,
            issued_at: currentTime,
          },
        };
      }
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    builder.addCase(fetchTokenAsync.pending, (state, _) => {
      return {
        ...state,
        spotiToken: {
          accessToken: "pending",
          token_type: "Bearer",
          refresh_token: "pending",
          expires_in: 0,
          issued_at: 0,
        },
      };
    })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      builder.addCase(fetchTokenAsync.rejected, (state, _) => {
        return {
          ...state,
          spotiToken: {
            accessToken: "access revoked",
            token_type: "Bearer",
            refresh_token: "access revoked",
            expires_in: 0,
            issued_at: 0,
          },
        };
      });
  },
});

export const { setToken } = spotiUserSlice.actions;

export default spotiUserSlice.reducer;
