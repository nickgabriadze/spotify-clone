import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetchAccessToken from "../../api/getToken";

interface TokenData {
  access_token: string;
  token_type: "Bearer";
  expires_in: 3600;
}

export const fetchTokenAsync = createAsyncThunk(
  "spotify/token",
  async (): Promise<TokenData> => {
    const req = await fetchAccessToken();

    return req.data;
  }
);

interface SpotiUser {
  spotiToken: {
    access_token: string;
    token_type: "Bearer";
    expires_in: number;
  };
}

const initialState: SpotiUser = {
  spotiToken: {
    access_token: "",
    token_type: "Bearer",
    expires_in: 0,
  },
};

const spotiUserSlice = createSlice({
  name: "Spoti User Slice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchTokenAsync.fulfilled,
      (
        state,
        action: {
          payload: {
            access_token: string;
            token_type: "Bearer";
            expires_in: 3600;
          };
        }
      ) => {
        return {
          ...state,
          spotiToken: action.payload,
        };
      }
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    builder.addCase(fetchTokenAsync.pending, (state, _) => {
      return {
        ...state,
        spotiToken: {
            access_token: 'pending',
            token_type: "Bearer",
            expires_in: 0
          },
      };
    }),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      builder.addCase(fetchTokenAsync.rejected, (state, _) => {
        return {
          ...state,
          spotiToken: {
            access_token: 'access revoked',
            token_type: "Bearer",
            expires_in: 0
          },
        };
      });
  },
});

export default spotiUserSlice.reducer;
