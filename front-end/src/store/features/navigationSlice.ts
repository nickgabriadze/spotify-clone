import {createSlice} from "@reduxjs/toolkit";
import {CurrentlyPlaying} from "../../types/currentlyPlaying.ts";

interface Navigation {
    queueEmpty: boolean
    currentlyPlayingSong: {
        artistID: string,
        songID: string,
        albumID: string,
        isPlaying: boolean | null,
        context: {
            type: string,
            href: string,
            external_urls: {
                spotify: string
            },
            uri: string
        } | null
    };
    libraryActions: string[],
    currentSongData: CurrentlyPlaying | null,
    userControlActions: string[];
    somethingIsFullScreen: boolean,
    navigationError: boolean,
    navigationHistory: string[]
}

const initialState: Navigation = {
    currentlyPlayingSong: {
        artistID: "None",
        songID: "None",
        albumID: "None",
        isPlaying: null,
        context: {
            type: 'None',
            href: 'None',
            external_urls: {
                spotify: 'None'
            },
            uri: 'None'
        }
    },

    queueEmpty: false,
    libraryActions: [],
    userControlActions: [],
    currentSongData: null,
    somethingIsFullScreen: false,
    navigationError: false,
    navigationHistory: []
};

const navigationSlice = createSlice({
    name: "Navigation Slice",
    initialState,
    reducers:
        {
            setNavigationHistory:(state, action:{payload: string[]}) => {
              return {
                  ...state,
                  navigationHistory: action.payload
              }
            },
            setNavigationError: (state, action:{payload: boolean}) => {
                return {
                    ...state,
                    navigationError: action.payload
                }
            },

            setCurrentSongData: (state, action:{
                payload: CurrentlyPlaying
            }) => {

                return {
                    ...state,
                    currentSongData: action.payload
                }
            },
            addLibraryAction: (state, action: { payload: string }) => {
                if (state.libraryActions.length > 50) {
                    return {
                        ...state,
                        libraryActions: [action.payload]
                    }
                } else {
                    return {
                        ...state,
                        libraryActions: [...state.libraryActions, action.payload]
                    }
                }
            },


            setQueueEmpty: (state, action: { payload: { empty: boolean } }) => {
                return {
                    ...state,
                    queueEmpty: action.payload.empty
                }
            },


            setCurrentlyPlayingSong: (
                state,
                action: {
                    payload: {
                        currentlyPlayingSong: {
                            artistID: string;
                            songID: string,
                            albumID: string,
                            isPlaying: boolean | null,
                            context: {
                                type: string,
                                href: string,
                                external_urls: {
                                    spotify: string
                                },
                                uri: string
                            } | null
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
    setCurrentlyPlayingSong,
    setUserControlActions,
    addLibraryAction,
    setCurrentSongData,
    setNavigationError,
    setNavigationHistory
} = navigationSlice.actions;
export default navigationSlice.reducer;
