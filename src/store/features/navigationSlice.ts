import { createSlice } from "@reduxjs/toolkit";
import Navigation from "../../components/navigation/navigation";

interface Navigation {
  navTo: string;
  searchQuery: string;
}

const initialState: Navigation = {
  navTo: "home",
  searchQuery: "",
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

export const { setNavTo, setSearchQuery } = navigationSlice.actions;
export default navigationSlice.reducer;
