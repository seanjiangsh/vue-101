import { defineStore } from "pinia";
import { computed, ref } from "vue";

export type ThemeMode = "light" | "dark" | "system";
type EffectiveTheme = "light" | "dark";

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

  // 👉 TODO (getter): nextTheme — the next value in ["light","dark","system"].
  //    Reuse your util: `import { cycle } from "../utils/array"`, add a
  //    `themeOrder` tuple, then `cycle(themeOrder, mode.value)`.
  const nextTheme = computed<ThemeMode>(() => mode.value); // replace

  // 👉 TODO (action): cycleTheme — advance mode to nextTheme.value.
  function cycleTheme(): void {
    // mode.value = nextTheme.value;
  }

  // 👉 TODO (side effects): move the two watches from useTheme (import `watch`):
  //   1) watch(effectiveTheme, t => document.documentElement.classList
  //        .toggle("dark", t === "dark"), { immediate: true })
  //   2) watch(mode, m => localStorage.setItem("theme", m), { immediate: true })

  return { mode, effectiveTheme, nextTheme, cycleTheme };
});
