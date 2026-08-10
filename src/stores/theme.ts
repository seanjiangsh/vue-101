import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";

import { cycle } from "../utils/array";

// Single source of truth for the theme values: derive the TYPES from the
// runtime tuples so the two can never drift apart. (Renamed to `effectiveThemes`
// so it doesn't shadow the `effectiveTheme` computed inside the store.)
const effectiveThemes = ["light", "dark"] as const; // the concrete rendered themes
const themes = [...effectiveThemes, "system"] as const; // + the "follow OS" choice
export type ThemeMode = (typeof themes)[number]; // "light" | "dark" | "system"
type EffectiveTheme = (typeof effectiveThemes)[number]; // "light" | "dark"

function isThemeMode(value: unknown): value is ThemeMode {
  return value === "light" || value === "dark" || value === "system";
}
function getInitialMode(): ThemeMode {
  const stored = localStorage.getItem("theme");
  return isThemeMode(stored) ? stored : "system";
}

/**
 * Theme as a Pinia store — the A/B counterpart to the useTheme composable.
 * The whole point of this exercise: notice how little changes. Same refs,
 * computeds, and watches, just wrapped in defineStore. A setup store *is* a
 * composable, with devtools / HMR / testability on top.
 */
export const useThemeStore = defineStore("theme", () => {
  // State: the user's choice (persisted to localStorage).
  const mode = ref<ThemeMode>(getInitialMode());

  // Reactive mirror of the OS preference. Same trick as the composable: the
  // matchMedia value isn't reactive by itself, so we push changes into a ref.
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  const systemTheme = ref<EffectiveTheme>(mql.matches ? "dark" : "light");
  mql.addEventListener("change", (e) => {
    systemTheme.value = e.matches ? "dark" : "light";
  });

  // Getter (provided as the reference): what actually renders.
  const effectiveTheme = computed<EffectiveTheme>(() =>
    mode.value === "system" ? systemTheme.value : mode.value,
  );

  // Getter: the next mode in the cycle, reusing the shared cycle() util.
  const nextTheme = computed<ThemeMode>(() => cycle(themes, mode.value));

  // Action: advance to the next mode. In Pinia you mutate state directly.
  function cycleTheme(): void {
    mode.value = nextTheme.value;
  }

  // Side effects (moved verbatim from the composable): mirror the *rendered*
  // theme onto <html>, and persist the *choice*. immediate:true applies on load.
  watch(
    effectiveTheme,
    (theme) =>
      document.documentElement.classList.toggle("dark", theme === "dark"),
    { immediate: true },
  );

  watch(mode, (mode) => localStorage.setItem("theme", mode), {
    immediate: true,
  });

  return { mode, effectiveTheme, nextTheme, cycleTheme };
});
