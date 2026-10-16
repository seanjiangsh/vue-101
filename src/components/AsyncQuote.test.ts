import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchQuote } from "../utils/fakeQuoteApi";

// Fake timers so the API's delay passes instantly and on cue.
beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("fetchQuote", () => {
  // Attach the assertion BEFORE advancing the clock, so the promise already has
  // a handler when it settles (otherwise a rejection can be reported as
  // unhandled for a moment).
  it("resolves with a quote after the delay", async () => {
    const quote = fetchQuote(false, 800);
    const assertion = expect(quote).resolves.toHaveProperty("author");
    vi.advanceTimersByTime(800);
    await assertion;
  });

  it("rejects when asked to fail", async () => {
    const quote = fetchQuote(true, 800);
    const assertion = expect(quote).rejects.toThrow("Quote service is down");
    vi.advanceTimersByTime(800);
    await assertion;
  });
});

// TODO(you) #4 (optional): test AsyncQuote inside a real <Suspense>.
// You can't use a template string here, so build the tree with h():
//
//   import { h, Suspense } from "vue";
//   import { mount, flushPromises } from "@vue/test-utils";
//   import AsyncQuote from "./AsyncQuote.vue";
//
//   const wrapper = mount({
//     render: () =>
//       h(Suspense, null, {
//         default: () => h(AsyncQuote),
//         fallback: () => h("p", "Loading"),
//       }),
//   });
//
// Then: assert the fallback text, vi.advanceTimersByTime(800), await
// flushPromises() (lets the resolved promise and Vue's re-render run), and
// assert the quote's author is shown. Only add the imports you actually use,
// or vue-tsc fails the build on unused ones.
describe("AsyncQuote inside <Suspense>", () => {
  it.todo("shows the fallback while the quote is loading");
  it.todo("shows the quote once the fetch resolves");
});
