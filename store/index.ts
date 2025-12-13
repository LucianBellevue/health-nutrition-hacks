import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/themeSlice";
import newsletterReducer from "./slices/newsletterSlice";
import preferencesReducer from "./slices/preferencesSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    newsletter: newsletterReducer,
    preferences: preferencesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
