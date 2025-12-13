'use client';

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { hydratePreferences, setPreferencesInitialized } from "@/store/slices/preferencesSlice";

const STORAGE_KEY = "hnh-preferences";

export default function PreferencesHydrator() {
  const dispatch = useAppDispatch();
  const preferences = useAppSelector((state) => state.preferences);

  // Initial hydration from localStorage
  useEffect(() => {
    if (preferences.initialized) return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
          dispatch(
            hydratePreferences({
              searchQuery: typeof parsed.searchQuery === "string" ? parsed.searchQuery : undefined,
              selectedCategory: typeof parsed.selectedCategory === "string" ? parsed.selectedCategory : undefined,
              followedCategories: Array.isArray(parsed.followedCategories) ? parsed.followedCategories : undefined,
            }),
          );
        }
      }
    } catch {
      // Ignore malformed storage
    } finally {
      dispatch(setPreferencesInitialized(true));
    }
  }, [dispatch, preferences.initialized]);

  // Persist whenever preferences change
  useEffect(() => {
    if (!preferences.initialized) return;
    try {
      const payload = {
        searchQuery: preferences.searchQuery,
        selectedCategory: preferences.selectedCategory,
        followedCategories: preferences.followedCategories,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Fail silently if storage unavailable
    }
  }, [
    preferences.initialized,
    preferences.searchQuery,
    preferences.selectedCategory,
    preferences.followedCategories,
  ]);

  return null;
}
