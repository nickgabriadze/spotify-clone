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
    libraryActions: string[],
    userControlActions: string[];
    pageNavigation: {
        pageHistory: {
            component: string, props?: any
        }[],
        currentPageIndex: number
    }
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
    libraryActions: [],
    userControlActions: [],
    pageNavigation: {
        pageHistory: [{
            component: "Home",
        }],
        currentPageIndex: 0
    }
};

const navigationSlice = createSlice({
    name: "Navigation Slice",
    initialState,
    reducers: {

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

        navigateToDirection: (state, action: { payload: "BACK" | "FORWARD" }) => {
            console.log(state.pageNavigation.currentPageIndex)
            if (action.payload === "BACK" && state.pageNavigation.currentPageIndex > 0) {
                return {
                    ...state,

                    pageNavigation: {
                        ...state.pageNavigation,
                        currentPageIndex: state.pageNavigation.currentPageIndex - 1

                    }
                }
            }
            if (action.payload === "FORWARD" && state.pageNavigation.currentPageIndex < state.pageNavigation.pageHistory.length - 1) {
                return {
                    ...state,

                    pageNavigation: {
                        ...state.pageNavigation,
                        currentPageIndex: state.pageNavigation.currentPageIndex + 1

                    }
                }
            }
        },

        addReactComponentToNavigation: (state, action: { payload: { componentName: string, props?: any } }) => {


            if (action.payload.componentName === state.pageNavigation.pageHistory[state.pageNavigation.currentPageIndex].component) {
                return;
            }

            if (action.payload.componentName === "Home") {
                return {
                    ...state,
                    pageNavigation: {
                        ...state.pageNavigation,
                        pageHistory: [{
                            component: "Home",
                            props: null
                        }],
                        currentPageIndex: 0

                    }
                }
            }

            return {
                ...state,
                pageNavigation: {
                    ...state.pageNavigation,
                    pageHistory: [...state.pageNavigation.pageHistory, {
                        component: action.payload.componentName,
                        props: action.payload.props
                    }],
                    currentPageIndex: state.pageNavigation.currentPageIndex + 1

                }
            }
        },

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
    addReactComponentToNavigation,
    navigateToDirection,
    addLibraryAction
} = navigationSlice.actions;
export default navigationSlice.reducer;
