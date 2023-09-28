import {createSlice} from "@reduxjs/toolkit";
import Navigation from "../../components/navigation/navigation";

export type Option =
    | "All"
    | "Artists"
    | "Albums"
    | "Songs"
    | "Playlists"
    | "Podcasts & Shows";

export type NavTo = "Home" | "Queue" | "Search"

interface Navigation {
    navTo: NavTo;
    searchQuery: string;
    typing: boolean;
    searchOption: Option;
    queueEmpty: boolean
    currentlyPlayingSong: {
        artistID: string,
        songID: string,
        albumID: string,
        isPlaying: boolean | null
    };
    userControlActions: string[];
}

const initialState: Navigation = {
    navTo: "Home",
    searchQuery: "",
    typing: false,
    searchOption: "All",
    currentlyPlayingSong: {
        artistID: "None",
        songID: "None",
        albumID: "None",
        isPlaying: null
    },
    queueEmpty: false,
    userControlActions: [],
};

const navigationSlice = createSlice({
    name: "Navigation Slice",
    initialState,
    reducers: {
        setSearchOption: (
            state,
            action: {
                payload: {
                    option: Option;
                };
            }
        ) => {
            return {
                ...state,
                searchOption: action.payload.option,
            };
        },
        setNavTo: (
            state,
            action: {
                payload: {
                    navTo: NavTo;
                };
            }
        ) => {
            return {
                ...state,
                navTo: action.payload.navTo,
            };
        },
        setQueueEmpty: (state, action: { payload: { empty: boolean } }) => {
            return {
                ...state,
                queueEmpty: action.payload.empty
            }
        },
        setTyping: (
            state,
            action: {
                payload: {
                    typing: boolean;
                };
            }
        ) => {
            return {
                ...state,
                typing: action.payload.typing,
            };
        },

        setSearchQuery: (
            state,
            action: {
                payload: {
                    searchQuery: string;
                };
            }
        ) => {
            return {
                ...state,
                searchQuery: action.payload.searchQuery,
            };
        },

        setCurrentlyPlayingSong: (
            state,
            action: {
                payload: {
                    currentlyPlayingSong: {
                        artistID: string;
                        songID: string,
                        albumID: string,
                        isPlaying: boolean | null
                    };
                };
            }
        ) => {
            return {
                ...state,
                currentlyPlayingSong: action.payload.currentlyPlayingSong,
            };
        },

        setUserControlActions: (
            state,
            action: {
                payload: {
                    userAction: string | "Nullify";
                };
            }
        ) => {
            if (action.payload.userAction === "Nullify") {
                return {
                    ...state,
                    userControlActions: [],
                };
            } else {
                return {
                    ...state,
                    userControlActions: [
                        ...state.userControlActions,
                        action.payload.userAction,
                    ],
                };
            }
        },
    },
});

export const {
    setNavTo,
    setSearchQuery,
    setTyping,
    setSearchOption,
    setCurrentlyPlayingSong,
    setUserControlActions,
    setQueueEmpty
} = navigationSlice.actions;
export default navigationSlice.reducer;
