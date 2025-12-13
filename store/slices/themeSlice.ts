import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export interface ThemeState {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  initialized: boolean;
}

const initialState: ThemeState = {
  preference: "system",
  resolved: "light",
  initialized: false,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setPreference(state, action: PayloadAction<ThemePreference>) {
      state.preference = action.payload;
    },
    setResolved(state, action: PayloadAction<ResolvedTheme>) {
      state.resolved = action.payload;
    },
    setInitialized(state, action: PayloadAction<boolean>) {
      state.initialized = action.payload;
    },
  },
});

export const { setPreference, setResolved, setInitialized } = themeSlice.actions;
export default themeSlice.reducer;
