import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { effectScope } from "vue";
import { useDebouncedRef } from "./useDebouncedRef";

// Fake timers let us step through the debounce delay by hand, so the tests
// don't depend on real time passing.
beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("useDebouncedRef", () => {
  // Every test runs inside an effectScope, the same as useInterval.test.ts:
  // useDebouncedRef calls onScopeDispose, which needs an active scope to attach
  // its cleanup to (without one, Vue warns and the cleanup never runs).
  it("starts with the initial value", () => {
    const scope = effectScope();
    const query = scope.run(() => useDebouncedRef("vue", 300))!;
    expect(query.value).toBe("vue");
    scope.stop();
  });

  // TODO(you) #3: turn these into real tests.
  // Tools: `query.value = "x"` to write, vi.advanceTimersByTime(ms) to move the
  // clock forward, expect(query.value) to check what readers see.
  it.todo("keeps the old value until the delay has passed");
  it.todo("applies only the last write when set several times quickly");
  it.todo("drops a pending write when the effect scope is disposed");
});
