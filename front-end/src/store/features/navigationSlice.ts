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
    },
    somethingIsFullScreen: boolean
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
    },
    somethingIsFullScreen: false
};

const navigationSlice = createSlice({
    name: "Navigation Slice",
    initialState,
    reducers: {
        setSomethingIsFullScreen: (state, action: {payload: boolean}) => {
            return {
                ...state,
                somethingIsFullScreen: action.payload
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

        navigateToDirection: (state, action: { payload: "BACK" | "FORWARD", causedByError?: boolean }) => {



            if (action.payload === "BACK" && state.pageNavigation.currentPageIndex > 0) {
                if(action.causedByError){
                        return {
                    ...state,

                    pageNavigation: {
                        ...state.pageNavigation,
                        pageHistory: [...state.pageNavigation.pageHistory.slice(0, -1)],
                        currentPageIndex: state.pageNavigation.currentPageIndex - 1

                    }
                }
                }
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

            if( action.payload.componentName === 'Queue' &&
                state.pageNavigation.pageHistory[state.pageNavigation.pageHistory.length - 1].component === 'Queue'){

                return {
                    ...state,
                    pageNavigation: {
                        ...state.pageNavigation,
                        currentPageIndex: state.pageNavigation.pageHistory.length - 1
                    }
                }
            }

            if( action.payload.componentName === 'Search' &&
                state.pageNavigation.pageHistory[state.pageNavigation.pageHistory.length - 1].component === 'Search'){

                return {
                    ...state,
                    pageNavigation: {
                        ...state.pageNavigation,
                        currentPageIndex: state.pageNavigation.pageHistory.length - 1
                    }
                }
            }

            if(state.pageNavigation.pageHistory[state.pageNavigation.pageHistory.length - 1].props &&
                action.payload.props &&
                state.pageNavigation.pageHistory[state.pageNavigation.pageHistory.length - 1].props === action.payload.props){

                return {
                    ...state,
                    pageNavigation: {
                        ...state.pageNavigation,
                        currentPageIndex: state.pageNavigation.pageHistory.length - 1
                    }
                }
            }


            if(state.pageNavigation.pageHistory[state.pageNavigation.pageHistory.length - 1].props &&
              action.payload.props
            && state.pageNavigation.pageHistory[state.pageNavigation.pageHistory.length - 1].props === action.payload.props
                &&
                state.pageNavigation.currentPageIndex === state.pageNavigation.pageHistory.length - 1
            ){
                return;
            }



            return {
                ...state,
                pageNavigation: {
                    ...state.pageNavigation,
                    pageHistory: [...state.pageNavigation.pageHistory, {
                        component: action.payload.componentName,
                        props: action.payload.props
                    }],
                    currentPageIndex: state.pageNavigation.pageHistory.length

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
    setSearchQuery,
    setTyping,
    setSearchOption,
    setCurrentlyPlayingSong,
    setUserControlActions,
    addReactComponentToNavigation,
    navigateToDirection,
    addLibraryAction,
    setSomethingIsFullScreen
} = navigationSlice.actions;
export default navigationSlice.reducer;
