'use client';

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setPreference, setResolved, setInitialized, ThemePreference } from "@/store/slices/themeSlice";

export function ThemeScript() {
  const script = `
  (function() {
    try {
      const theme = localStorage.getItem('theme');
      const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      const resolved = !theme || theme === 'system' ? system : theme;
      if (resolved === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (_) {}
  })();`;

  return (
    <script dangerouslySetInnerHTML={{ __html: script }} suppressHydrationWarning />
  );
}

const resolveTheme = (preference: ThemePreference) => {
  if (typeof window === "undefined") {
    return "light" as const;
  }
  if (preference === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return preference;
};

export default function ThemeHydrator() {
  const dispatch = useAppDispatch();
  const preference = useAppSelector((state) => state.theme.preference);
  const initialized = useAppSelector((state) => state.theme.initialized);

  // Initialize preference from storage once
  useEffect(() => {
    if (initialized || typeof window === "undefined") return;
    const stored = (localStorage.getItem("theme") as ThemePreference | null) ?? "system";
    dispatch(setPreference(stored));
    dispatch(setInitialized(true));
  }, [dispatch, initialized]);

  // Apply theme + listen for system changes
  useEffect(() => {
    if (!initialized || typeof window === "undefined") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const applyResolved = (pref: ThemePreference) => {
      const resolved = resolveTheme(pref);
      dispatch(setResolved(resolved));
      if (pref !== "system") {
        localStorage.setItem("theme", pref);
      } else {
        localStorage.setItem("theme", "system");
      }
      if (resolved === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return resolved;
    };

    applyResolved(preference);

    const handleChange = (event: MediaQueryListEvent) => {
      if (preference === "system") {
        const next = event.matches ? "dark" : "light";
        dispatch(setResolved(next));
        if (next === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [dispatch, initialized, preference]);

  return null;
}
