"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  applyTheme,
  isTheme,
  persistTheme,
  readStoredTheme,
  readSystemTheme,
  resolveInitialTheme,
  type Theme,
} from "./theme";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readDocumentTheme(): Theme {
  const current = document.documentElement.dataset.theme;
  return isTheme(current) ? current : resolveInitialTheme();
}

/** The document's data-theme attribute is the source of truth; React subscribes to it. */
function subscribeToDocumentTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function getServerTheme(): Theme {
  return "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeToDocumentTheme,
    readDocumentTheme,
    getServerTheme,
  );

  useLayoutEffect(() => {
    applyTheme(readDocumentTheme());

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemThemeChange = () => {
      if (readStoredTheme()) {
        return;
      }

      applyTheme(readSystemTheme());
    };

    media.addEventListener("change", onSystemThemeChange);
    return () => media.removeEventListener("change", onSystemThemeChange);
  }, []);

  const toggleTheme = useCallback(() => {
    const current = readDocumentTheme();
    const next: Theme = current === "dark" ? "light" : "dark";
    applyTheme(next);
    persistTheme(next);
  }, []);

  const value = useMemo(
    () => ({ theme, toggleTheme }),
    [theme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
