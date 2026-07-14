import { computed, ref, watch, type ComputedRef, type Ref } from "vue";

// The available swatch colors. Each name must have a matching `--<name>` CSS
// variable in style.css. `as const` gives a non-empty tuple of literal types.
export const swatchColors = [
  "primary",
  "success",
  "warning",
  "error",
  "info",
  "purple",
  "pink",
] as const;

export type ColorName = (typeof swatchColors)[number];

// Colors that can be hidden via the "hide alerts" toggle.
const alertColors: ColorName[] = ["error", "warning"];

interface UseColorSwatchReturn {
  activeColor: Ref<ColorName>;
  hideAlerts: Ref<boolean>;
  visibleColors: ComputedRef<ColorName[]>;
}

/**
 * Per-component color-picker state.
 *
 * Note the contrast with useTheme: there, the state lives at *module scope*
 * so it's a shared, app-wide singleton. Here the refs are created *inside* the
 * function, so every caller gets its own independent selection — this is local
 * UI state, not global. (Same distinction as calling a React hook per component
 * vs. reaching for a global store.)
 */
export function useColorSwatch(): UseColorSwatchReturn {
  // Source of truth is the color *name*; the CSS string is derived in the view.
  const activeColor = ref<ColorName>("primary");
  const hideAlerts = ref<boolean>(false);

  // The list to render: all colors, or with the alerts filtered out.
  // Derived from hideAlerts, so it's a computed (never mutates swatchColors).
  const visibleColors = computed<ColorName[]>(() =>
    hideAlerts.value
      ? swatchColors.filter((color) => !alertColors.includes(color))
      : [...swatchColors],
  );

  // If the active color gets filtered out of view, fall back to the first
  // visible one so the preview never shows a hidden color.
  watch(visibleColors, (colors) => {
    if (!colors.includes(activeColor.value)) {
      activeColor.value = colors[0] ?? "primary";
    }
  });

  return { activeColor, hideAlerts, visibleColors };
}
