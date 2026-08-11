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

  // 👉 TODO: wrapping — cycle(items, "c") should return "a".
  it.todo("wraps around from the last item to the first");

  // 👉 TODO: fallback — when the value isn't in the array it returns items[0].
  //    (You'll need a cast to pass a non-member, e.g. cycle(items, "z" as "a").
  //    Testing that defensive branch is itself the lesson.)
  it.todo("falls back to the first item when the value is not found");
});
