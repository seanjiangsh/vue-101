import {
  computed,
  readonly,
  ref,
  watch,
  type ComputedRef,
  type DeepReadonly,
  type Ref,
} from "vue";

import { cycle } from "../utils/array";

export type ThemeMode = "light" | "dark" | "system"; // the user's choice
type EffectiveTheme = "light" | "dark"; // what actually renders

interface UseThemeReturn {
  mode: DeepReadonly<Ref<ThemeMode>>;
  effectiveTheme: DeepReadonly<Ref<EffectiveTheme>>;
  nextTheme: ComputedRef<ThemeMode>;
  cycleTheme: () => void;
}

// ── Helpers ──────────────────────────────────────────────────────────────

// Type guard: narrows an untrusted value (e.g. from localStorage) to ThemeMode.
// After it returns true, TS treats the value as ThemeMode — no `as` cast.
function isThemeMode(value: unknown): value is ThemeMode {
  return value === "light" || value === "dark" || value === "system";
}

/**
 * Decide the mode to start with, in priority order:
 *   1. A previously saved choice in localStorage (user's explicit override).
 *   2. Otherwise "system" — i.e. follow the OS preference.
 */
function getInitialMode(): ThemeMode {
  const stored = localStorage.getItem("theme");
  return isThemeMode(stored) ? stored : "system";
}

// ── Shared state ─────────────────────────────────────────────────────────
// Everything below runs ONCE, the first time this file is imported. Because
// these refs live at module scope (not inside useTheme), every component that
// calls useTheme() shares the same instances — a tiny global store, no Pinia
// or Context needed.

// The user's *choice*: light | dark | system. This is what we persist.
const mode = ref<ThemeMode>(getInitialMode());

// A reactive mirror of the OS preference. It needs its own ref (rather than
// reading mql.matches directly inside the computed) because mql.matches is NOT
// reactive — the listener updates this ref so `effectiveTheme` recomputes when
// the OS theme changes while mode === "system".
const mql = window.matchMedia("(prefers-color-scheme: dark)");
const systemTheme = ref<EffectiveTheme>(mql.matches ? "dark" : "light");
mql.addEventListener("change", (e) => {
  systemTheme.value = e.matches ? "dark" : "light";
});
// No cleanup needed: this listener is a module-scope singleton that lives for
// the whole app lifetime. (Inside a component you'd remove it in onUnmounted.)

// What actually renders: *derived* from mode + systemTheme, so it's a computed.
const effectiveTheme = computed<EffectiveTheme>(() =>
  mode.value === "system" ? systemTheme.value : mode.value,
);

// Single source of truth for the cycle order; nextTheme derives from it.
// `as const` makes this a non-empty tuple (not just ThemeMode[]), which is
// what cycle()'s signature requires — and it keeps the element types literal.
const themeOrder = ["light", "dark", "system"] as const;
const nextTheme = computed<ThemeMode>(() => cycle(themeOrder, mode.value));

// ── Side effects ───────────────────────────────────────────────────────────

// Mirror the *rendered* theme onto <html> so the CSS can react.
// `immediate: true` also runs it on load to apply the initial theme.
watch(
  effectiveTheme,
  (current) => {
    document.documentElement.classList.toggle("dark", current === "dark");
  },
  { immediate: true },
);

// Persist the user's *choice* (mode), not the resolved result.
watch(
  mode,
  (current) => {
    localStorage.setItem("theme", current);
  },
  { immediate: true },
);

// ── Actions ────────────────────────────────────────────────────────────────

function cycleTheme(): void {
  mode.value = nextTheme.value;
}

/**
 * Shared light/dark/system theme state. The Vue equivalent of a React custom
 * hook — but Vue calls it a *composable*.
 *
 *   const { mode, effectiveTheme, nextTheme, cycleTheme } = useTheme();
 *
 * `mode` and `effectiveTheme` are readonly — change the theme via cycleTheme(),
 * the composable's controlled entry point (like [state, setState] in React).
 */
export function useTheme(): UseThemeReturn {
  return {
    mode: readonly(mode),
    effectiveTheme: readonly(effectiveTheme),
    nextTheme,
    cycleTheme,
  };
}
