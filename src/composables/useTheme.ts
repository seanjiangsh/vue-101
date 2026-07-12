import { ref, watch, type Ref } from "vue";

export type ThemeMode = "light" | "dark";

interface UseThemeReturn {
  theme: Ref<ThemeMode>;
  toggleTheme: () => void;
}

// ── Helpers ──────────────────────────────────────────────────────────────

/**
 * Type guard: narrows an untrusted `unknown` value to `ThemeMode`.
 * After this returns true, TypeScript treats the value as a ThemeMode —
 * no `as` cast needed. Used to validate whatever came out of localStorage.
 */
function isThemeMode(value: unknown): value is ThemeMode {
  return value === "light" || value === "dark";
}

/**
 * Decide the theme to start with, in priority order:
 *   1. A previously saved choice in localStorage (user's explicit override).
 *   2. Otherwise, the operating system's color-scheme preference.
 */
function getInitialTheme(): ThemeMode {
  const storedTheme = localStorage.getItem("theme");
  if (isThemeMode(storedTheme)) {
    return storedTheme; // validated — safe to trust
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

// ── Shared state ─────────────────────────────────────────────────────────
// Everything below runs ONCE, the first time this file is imported. Because
// `theme` lives at module scope (not inside useTheme), every component that
// calls useTheme() shares this exact same ref — a tiny global store, no
// Pinia or Context needed.

const theme = ref<ThemeMode>(getInitialTheme());

// Whenever `theme` changes, run its side effects:
//   1. mirror it onto <html> so the CSS can react, and
//   2. persist it to localStorage for next visit.
// Registered once (module scope), so we don't stack a watcher per useTheme()
// call. `immediate: true` also runs it on load to apply the initial theme.
watch(
  theme,
  (current) => {
    document.documentElement.classList.toggle("dark", current === "dark");
    localStorage.setItem("theme", current);
  },
  { immediate: true },
);

function toggleTheme(): void {
  theme.value = theme.value === "dark" ? "light" : "dark";
}

/**
 * Shared light/dark theme state. The Vue equivalent of a React custom hook —
 * but Vue calls it a *composable*.
 *
 *   const { theme, toggleTheme } = useTheme();
 */
export function useTheme(): UseThemeReturn {
  return { theme, toggleTheme };
}
