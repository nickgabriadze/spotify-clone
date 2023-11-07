import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {Me} from "../../types/me.ts";
import {Track} from "../../types/track.ts";
import {Album} from "../../types/album.ts";
import {Artist} from "../../types/artist.ts";
import {Playlist} from "../../types/playlist.ts";
import axios from "axios";

interface TokenData {
    accessToken: string;
    token_type: "Bearer";
    refresh_token: string;
    expires_in: number;

}

export const fetchTokenAsync = createAsyncThunk(
    "spotify/token",
    async (info: {
        client_id?: string,
        client_secret_id?: string
    }): Promise<TokenData> => {

        if (!window.location.hash.includes("#")) {
            return axios.get(`http://localhost:3001/authenticate?client_id=${info.client_id}&client_secret_id=${info.client_secret_id}`,)
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
                }).reduce((acc, obj) => ({...acc, ...obj}), {});

            history.replaceState({}, document.title, window.location.pathname)
            return access
        }


    });


interface SpotiUser {
    spotiToken: {
        accessToken: string;
        token_type: "Bearer";
        expires_in: number;
        issued_at: number;
        refresh_token: string;
    };
    userInformation: Me | null,
    userSaved: {
        userSavedSongIDs: string[],
        userSavedAlbumIDs: string[],
        userSavedArtistIDs: string[],
        userSavedPlaylistIDs: string[]
    },
    whatsInViewForPlay: {
        pageName: string,
        pageItemName: string
    },
    mainRef: HTMLElement | null
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
        userSavedAlbumIDs: [],
        userSavedArtistIDs: [],
        userSavedPlaylistIDs: []
    },
    whatsInViewForPlay: {
        pageName: 'None',
        pageItemName: 'None'
    },
    mainRef: null
};

const spotiUserSlice = createSlice({
    name: "Spoti User Slice",
    initialState,
    reducers: {
        setMainRef: (state, action: {payload: HTMLElement}) => {
          return {
              ...state,
              mainRef: action.payload
          }
        },
        setWhatsInView: (state, action: { payload: {
            pageName: string,
                pageItemName: string
            } }) => {

            return {
                ...state,
                whatsInViewForPlay: {
                    pageName: action.payload.pageName,
                    pageItemName: action.payload.pageItemName
                }
            }
        }
        ,
        setUserSavedPlaylistIDs: (state, action: { payload: Playlist[] }) => {

            return {
                ...state,
                userSaved: {
                    ...state.userSaved,
                    userSavedPlaylistIDs: action.payload.map(a => a.id)
                }
            }
        },

        setUserSavedArtistIDs: (state, action: { payload: Artist[] }) => {

            return {
                ...state,
                userSaved: {
                    ...state.userSaved,
                    userSavedArtistIDs: action.payload.map(a => a.id)
                }
            }
        },
        setUserInformation: (state, action: { payload: Me }) => {
            return {
                ...state,
                userInformation: action.payload
            }
        },
        setUserSavedAlbumIDs: (state, action: { payload: Album[] }) => {

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

export const {
    setUserInformation,
    setToken,
    updateCredentials,
    setUserSavedArtistIDs,
    setUsersSavedSongIDs,
    setUserSavedAlbumIDs,
    setUserSavedPlaylistIDs,
    setMainRef,
    setWhatsInView
} = spotiUserSlice.actions;

export default spotiUserSlice.reducer;
