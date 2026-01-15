import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/themeSlice";
import newsletterReducer from "./slices/newsletterSlice";
import preferencesReducer from "./slices/preferencesSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    newsletter: newsletterReducer,
    preferences: preferencesReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
