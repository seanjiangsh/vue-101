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

  // Checks the edge of the delay: still the old value at 299ms, the new one at
  // exactly 300ms. Checking only "long after" would pass with a wrong delay.
  it("keeps the old value until the delay has passed", () => {
    const scope = effectScope();
    const query = scope.run(() => useDebouncedRef("vue", 300))!;
    query.value = "x";
    vi.advanceTimersByTime(299);
    expect(query.value).toBe("vue");
    vi.advanceTimersByTime(1);
    expect(query.value).toBe("x");
    scope.stop();
  });
  // Spaced writes prove each one RESTARTS the timer: at 499ms after "a" the
  // value is still unchanged, and only one timer is pending after "c". Remove
  // clearTimeout from set() and both of those assertions fail.
  it("applies only the last write when set several times quickly", () => {
    const scope = effectScope();
    const query = scope.run(() => useDebouncedRef("vue", 300))!;
    query.value = "a";
    vi.advanceTimersByTime(100);
    expect(query.value).toBe("vue");
    query.value = "b";
    vi.advanceTimersByTime(100);
    expect(query.value).toBe("vue");
    query.value = "c";
    expect(vi.getTimerCount()).toBe(1);
    vi.advanceTimersByTime(299);
    expect(query.value).toBe("vue");
    vi.advanceTimersByTime(1);
    expect(query.value).toBe("c");
    scope.stop();
  });
  // scope.stop() mid-delay stands in for a component unmounting while a write
  // is waiting. The timer count drops to 0 at stop(), before time moves, so the
  // onScopeDispose cleanup is the only thing that could have cleared it. No
  // scope.stop() at the end: the one in the middle is the point of the test.
  it("drops a pending write when the effect scope is disposed", () => {
    const scope = effectScope();
    const query = scope.run(() => useDebouncedRef("vue", 300))!;
    query.value = "x";
    expect(vi.getTimerCount()).toBe(1);
    scope.stop();
    expect(vi.getTimerCount()).toBe(0);
    vi.advanceTimersByTime(500);
    expect(query.value).toBe("vue");
  });
});
