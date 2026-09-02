export const THEME_STORAGE_KEY = "theme";

export type Theme = "light" | "dark";

export function isTheme(value: string | null | undefined): value is Theme {
  return value === "light" || value === "dark";
}

export function readStoredTheme(): Theme | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return isTheme(stored) ? stored : null;
}

export function resolveInitialTheme(): Theme {
  return readStoredTheme() ?? "light";
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

export function persistTheme(theme: Theme) {
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
}

/** Inline script run before paint to avoid a flash of the wrong theme. */
export const themeInitScript = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var s=localStorage.getItem(k);var t=s==="light"||s==="dark"?s:"light";document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme="light";}})();`;
