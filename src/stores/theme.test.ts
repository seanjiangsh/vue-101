import { describe, it, expect, beforeEach, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useThemeStore } from "../stores/theme";

describe("theme store", () => {
  beforeEach(() => {
    // Stub matchMedia BEFORE the store is first instantiated. This works only
    // because the store reads matchMedia lazily (inside defineStore's setup),
    // not at module scope — unlike the old useTheme composable, which ran it at
    // import time and so couldn't be stubbed by a beforeEach at all.
    vi.stubGlobal("matchMedia", () => ({
      matches: false,
      addEventListener() {},
      removeEventListener() {},
    }));
    // localStorage isn't reset by a fresh Pinia, so clear it too — otherwise a
    // persisted `mode` from an earlier test would change this test's initial state.
    localStorage.clear();
    setActivePinia(createPinia());
  });

  it("default theme mode should be system", () => {
    const theme = useThemeStore();
    expect(theme.mode).toBe("system");
  });

  it("cycles light -> dark -> system", () => {
    const theme = useThemeStore();
    theme.cycleTheme();
    expect(theme.mode).toBe("light");
    theme.cycleTheme();
    expect(theme.mode).toBe("dark");
    theme.cycleTheme();
    expect(theme.mode).toBe("system");
  });
});
