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

  // 👉 TODO: stop() should halt the ticking.
  //   Run useInterval in a scope, start(), advanceTimersByTime(2000) → 2 calls,
  //   then stop(), advanceTimersByTime(2000) → STILL 2 (no more ticks).
  it.todo("stops ticking after stop()");

  // 👉 TODO: start() must be idempotent — a second start() must NOT stack a
  //   second timer. start(); start(); advanceTimersByTime(1000) → called ONCE.
  //   (This is the `if (isActive.value) return` guard, under test.)
  it.todo("does not stack timers when start() is called twice");

  // 👉 TODO (the effectScope payoff): disposing the SCOPE stops the timer, even
  //   though you never call stop() yourself.
  //     const scope = effectScope();
  //     scope.run(() => useInterval(cb, 1000).start());
  //     advanceTimersByTime(2000) → 2 calls; scope.stop(); advanceTimersByTime(2000)
  //     → still 2. That proves onScopeDispose(stop) fires on scope.stop() — the
  //   thing onUnmounted could never do, because there's no component here.
  it.todo("stops ticking when the effect scope is disposed");
});
