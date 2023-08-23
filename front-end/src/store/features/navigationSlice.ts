import { createSlice } from "@reduxjs/toolkit";
import Navigation from "../../components/navigation/navigation";

export type Option =  | "All"
| "Artists"
| "Albums"
| "Songs"
| "Playlists"
| "Podcasts & Shows";

interface Navigation {
  navTo: string;
  searchQuery: string;
  typing: boolean;
  searchOption:Option
}

const initialState: Navigation = {
  navTo: "search",
  searchQuery: "",
  typing: false,
  searchOption: "Albums",
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
        searchOption: action.payload.option
      }

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
  },
});

export const { setNavTo, setSearchQuery, setTyping, setSearchOption } = navigationSlice.actions;
export default navigationSlice.reducer;
