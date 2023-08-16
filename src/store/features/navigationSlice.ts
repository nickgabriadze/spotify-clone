import { createSlice } from "@reduxjs/toolkit";

interface Navigation {
  navTo: string;
}

const initialState: Navigation = {
  navTo: "home",
};

const navigationSlice = createSlice({
  name: "Navigation Slice",
  initialState,
  reducers: {
    setNavTo: (
      state,
      action: {
        payload: Navigation;
      }
    ) => {
      return {
        ...state,
        navTo: action.payload.navTo,
      };
    },
  },
});

export const { setNavTo } = navigationSlice.actions;
export default navigationSlice.reducer;
