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

  it("increments the count", () => {
    const counter = useCounterStore();
    counter.increment();
    expect(counter.count).toBe(1);
  });

  // Two increments → count is 2, so the getter should report 4 — proving it
  // reacts to state changes, not just the initial value.
  it("computes doubleCount as count * 2", () => {
    const counter = useCounterStore();
    counter.increment();
    counter.increment();
    expect(counter.doubleCount).toBe(4);
  });
});
