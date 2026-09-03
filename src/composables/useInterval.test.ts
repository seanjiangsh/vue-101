import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { effectScope } from "vue";
import { useInterval } from "./useInterval";

// Fake timers replace setInterval/clearInterval with a clock we advance by hand,
// so these tests run instantly and deterministically (no real waiting).
beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("useInterval", () => {
  // useInterval calls onScopeDispose(), which needs an *active effect scope* to
  // attach to. A test has no component, so we create a scope with effectScope()
  // and run the composable inside scope.run(). (Skip the scope and Vue warns
  // "onScopeDispose is called when there is no active effect scope".)
  it("invokes the callback on each interval while active", () => {
    const cb = vi.fn();
    const scope = effectScope();
    const { start } = scope.run(() => useInterval(cb, 1000))!;

    start();
    vi.advanceTimersByTime(3000); // fast-forward 3 seconds
    expect(cb).toHaveBeenCalledTimes(3);

    scope.stop(); // dispose so this test cleans up after itself
  });

  // stop() must CLEAR the timer, not just flip a flag: the "still 2 after
  // another 2s" assertion is the proof — a paused-but-not-cleared timer would
  // tick again. Run inside a scope so useInterval's onScopeDispose has a home.
  it("stops ticking after stop()", () => {
    const cb = vi.fn();
    const scope = effectScope();
    const { start, stop } = scope.run(() => useInterval(cb, 1000))!;
    start();
    vi.advanceTimersByTime(2000);
    stop();
    vi.advanceTimersByTime(2000);
    expect(cb).toHaveBeenCalledTimes(2);
    scope.stop();
  });

  // A second start() must NOT create a second interval. The `if (isActive.value)
  // return` guard makes it a no-op, so there's one timer → one tick here; drop
  // the guard and two overlapping timers would make this 2. The test defends it.
  it("does not stack timers when start() is called twice", () => {
    const cb = vi.fn();
    const scope = effectScope();
    const { start } = scope.run(() => useInterval(cb, 1000))!;
    start();
    start();
    vi.advanceTimersByTime(1000);
    expect(cb).toHaveBeenCalledTimes(1);
    scope.stop();
  });

  // The payoff — this test NEVER calls stop(). scope.stop() disposes the scope,
  // which fires useInterval's onScopeDispose(stop) → the timer clears. The
  // "still 2 after another 2s" assertion proves it. This is exactly what
  // onScopeDispose gives you over onUnmounted: cleanup with no component in sight.
  it("stops ticking when the effect scope is disposed", () => {
    const cb = vi.fn();
    const scope = effectScope();
    const { start } = scope.run(() => useInterval(cb, 1000))!;
    start();
    vi.advanceTimersByTime(2000);
    expect(cb).toHaveBeenCalledTimes(2);
    scope.stop();
    vi.advanceTimersByTime(2000);
    expect(cb).toHaveBeenCalledTimes(2);
  });
});
