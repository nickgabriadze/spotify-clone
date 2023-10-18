import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import fetchAccessToken from "../../api/getToken";
import {Me} from "../../types/me.ts";
import {Track} from "../../types/track.ts";
import {Album} from "../../types/album.ts";

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


interface SpotiUser {
    spotiToken: {
        accessToken: string;
        token_type: "Bearer";
        expires_in: number;
        issued_at: number;
        refresh_token: string;
    };
    userInformation: Me | null,
    userSaved:{
        userSavedSongIDs: string[],
          userSavedAlbumIDs: string[]
    }
}

const initialState: SpotiUser = {
    spotiToken: {
        accessToken: 'unavailable',
        token_type: "Bearer",
        expires_in: 3600,
        issued_at: 0,
        refresh_token: 'unavailable',
    },
    userInformation: null,
    userSaved: {
        userSavedSongIDs: [],
        userSavedAlbumIDs: []

    }
};

const spotiUserSlice = createSlice({
    name: "Spoti User Slice",
    initialState,
    reducers: {

        setUserInformation: (state, action: { payload: Me }) => {
            return {
                ...state,
                userInformation: action.payload
            }
        },
        setUserSavedAlbumIDs: (state, action:{payload: Album[]}) => {

            return {
                ...state,
                userSaved: {
                    ...state.userSaved,
                    userSavedAlbumIDs: action.payload.map(a => a.id)
                }
            }
        },
        setUsersSavedSongIDs: (state, action: { payload: Track[] }) => {
            return {
                ...state,
                userSaved: {
                    ...state.userSaved,
                    userSavedSongIDs: action.payload.map(t => t.id)
                }
            }
        },

        updateCredentials: (state, action: {
            payload: {
                access_token: string,
                issued_at: number,
                refresh_token: string
            }
        }) => {
            return {
                ...state,
                spotiToken: {
                    ...state.spotiToken,
                    accessToken: action.payload.access_token,
                    refresh_token: action.payload.refresh_token,
                    issued_at: action.payload.issued_at
                }
            }
        },
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
            fetchTokenAsync.fulfilled,
            (
                state,
                action: {
                    payload: TokenData;
                }
            ) => {

                const currentTime = new Date().getTime() / 1000;
                localStorage.setItem("issued_at", currentTime.toString());
                localStorage.setItem("refresh_token", action.payload?.refresh_token);
                localStorage.setItem("access_token", action.payload?.accessToken);

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

export const {setUserInformation, setToken, updateCredentials, setUsersSavedSongIDs, setUserSavedAlbumIDs} = spotiUserSlice.actions;

export default spotiUserSlice.reducer;
