import { createSlice } from "@reduxjs/toolkit";
import Navigation from "../../components/navigation/navigation";

interface Navigation {
  navTo: string;
  searchQuery: string;
  typing: boolean;
}

const initialState: Navigation = {
  navTo: "home",
  searchQuery: "",
  typing: false,
};

const navigationSlice = createSlice({
  name: "Navigation Slice",
  initialState,
  reducers: {
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

export const { setNavTo, setSearchQuery, setTyping } = navigationSlice.actions;
export default navigationSlice.reducer;
