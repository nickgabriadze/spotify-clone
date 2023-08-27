import { createSlice } from "@reduxjs/toolkit";
import Navigation from "../../components/navigation/navigation";
import { CurrentlyPlaying } from "../../types/currentlyPlaying";

export type Option =
  | "All"
  | "Artists"
  | "Albums"
  | "Songs"
  | "Playlists"
  | "Podcasts & Shows";

interface Navigation {
  navTo: string;
  searchQuery: string;
  typing: boolean;
  searchOption: Option;
  currentlyPlayingSong: string
}

const initialState: Navigation = {
  navTo: "search",
  searchQuery: "",
  typing: false,
  searchOption: "Songs",
  currentlyPlayingSong: "None",
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
          navTo: string;
        };
      }
    ) => {
      return {
        ...state,
        navTo: action.payload.navTo,
      };
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
          currentlyPlayingSong: string;
        };
      }
    ) => {
      return {
        ...state,
        currentlyPlayingSong: action.payload.currentlyPlayingSong,
      };
    },
  },
});

export const { setNavTo, setSearchQuery, setTyping, setSearchOption, setCurrentlyPlayingSong } =
  navigationSlice.actions;
export default navigationSlice.reducer;
