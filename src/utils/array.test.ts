import { describe, it, expect } from "vitest";
import { cycle } from "./array";

// A test file: `describe` groups related tests; `it` (alias `test`) is one case;
// `expect(...).toBe(...)` is the assertion. Run with `pnpm test` (watch) or
// `pnpm test:run` (once). Pure functions like this are the easiest place to start.
describe("cycle", () => {
  const items = ["a", "b", "c"] as const;

  it("returns the next item", () => {
    expect(cycle(items, "a")).toBe("b");
  });

  it("wraps around from the last item to the first", () => {
    expect(cycle(items, "c")).toBe("a");
  });

  // The `as "a"` cast is deliberate: "z" isn't a member of `items`, so TS would
  // reject it. We force it through to exercise cycle()'s defensive branch
  // (indexOf === -1 → return the first item) — a path the types normally prevent.
  it("falls back to the first item when the value is not found", () => {
    expect(cycle(items, "z" as "a")).toBe("a");
  });
});
