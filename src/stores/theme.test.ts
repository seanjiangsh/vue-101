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

  // Walks the full loop and wraps back to the start, so an off-by-one in cycle()
  // (e.g. missing the modulo wrap: system → light) would fail the last assertion.
  // Synchronous state, so no await/nextTick needed.
  it("cycles light -> dark -> system", () => {
    const theme = useThemeStore();
    theme.cycleTheme();
    expect(theme.mode).toBe("light");
    theme.cycleTheme();
    expect(theme.mode).toBe("dark");
    theme.cycleTheme();
    expect(theme.mode).toBe("system");
  });

  // effectiveTheme is the *rendered* theme: for an explicit light/dark it's just
  // the mode, but for "system" it follows the OS — which the matchMedia stub
  // controls. beforeEach stubs matches:false (OS prefers light), so a "system"
  // mode resolves to "light". This is the one test that actually exercises the mock.
  it("resolves system mode to a light OS preference", () => {
    const theme = useThemeStore();
    expect(theme.mode).toBe("system");
    expect(theme.effectiveTheme).toBe("light");
  });
});
