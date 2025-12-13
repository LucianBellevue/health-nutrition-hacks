import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PreferencesState {
  searchQuery: string;
  selectedCategory?: string;
  followedCategories: string[];
  initialized: boolean;
}

const initialState: PreferencesState = {
  searchQuery: "",
  selectedCategory: undefined,
  followedCategories: [],
  initialized: false,
};

interface HydratedPreferences {
  searchQuery?: string;
  selectedCategory?: string;
  followedCategories?: string[];
}

const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    hydratePreferences(state, action: PayloadAction<HydratedPreferences>) {
      const { searchQuery, selectedCategory, followedCategories } = action.payload;
      if (typeof searchQuery === "string") {
        state.searchQuery = searchQuery;
      }
      if (typeof selectedCategory === "string" || selectedCategory === undefined) {
        state.selectedCategory = selectedCategory;
      }
      if (Array.isArray(followedCategories)) {
        state.followedCategories = followedCategories;
      }
    },
    setPreferencesInitialized(state, action: PayloadAction<boolean>) {
      state.initialized = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setSelectedCategory(state, action: PayloadAction<string | undefined>) {
      state.selectedCategory = action.payload;
    },
    toggleFollowedCategory(state, action: PayloadAction<string>) {
      const slug = action.payload;
      if (state.followedCategories.includes(slug)) {
        state.followedCategories = state.followedCategories.filter((item) => item !== slug);
      } else {
        state.followedCategories.push(slug);
      }
    },
  },
});

export const {
  hydratePreferences,
  setPreferencesInitialized,
  setSearchQuery,
  setSelectedCategory,
  toggleFollowedCategory,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
