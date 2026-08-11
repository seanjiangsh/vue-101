import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useCounterStore } from "./counter";

describe("counter store", () => {
  // A fresh Pinia before each test, so store state never leaks between tests.
  // This is the concrete testability win over a module-scope singleton
  // composable — that kind of state can't be reset per test.
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("starts at zero", () => {
    const counter = useCounterStore();
    expect(counter.count).toBe(0);
  });

  // 👉 TODO: call counter.increment() and assert count becomes 1.
  it.todo("increments the count");

  // 👉 TODO: increment a couple of times and assert doubleCount === count * 2.
  it.todo("computes doubleCount as count * 2");
});
