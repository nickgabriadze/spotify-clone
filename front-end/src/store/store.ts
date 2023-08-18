import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import spotiUserSlice from "./features/spotiUserSlice";
import navigationSlice from "./features/navigationSlice";


export const SpotiStore = configureStore({
    reducer: {
        spotiUserReducer: spotiUserSlice,
        navigationReducer: navigationSlice
    }
})

export type RootState = ReturnType<typeof SpotiStore.getState>
export type AppDispatch = typeof SpotiStore.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;