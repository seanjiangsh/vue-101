import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, nextTick } from "vue";
import ErrorBoundary from "./ErrorBoundary.vue";

// A child that throws during render. Error boundaries only catch render /
// lifecycle / setup / watcher errors — throwing in setup() qualifies.
const Boom = defineComponent({
  setup() {
    throw new Error("kaboom");
  },
  template: "<div>never rendered</div>",
});

describe("ErrorBoundary", () => {
  it("renders slot content when there is no error", () => {
    const wrapper = mount(ErrorBoundary, {
      slots: { default: "<p>all good</p>" },
    });
    expect(wrapper.text()).toContain("all good");
  });

  // A throwing descendant is caught by onErrorCaptured, which swaps in the
  // fallback. Two things to note:
  //  - `await nextTick()`: the throw happens during render; the fallback only
  //    appears on the NEXT render (after error.value is set), so assert after it.
  //  - Vue logs the caught error to the console during this test — that's
  //    expected, not a failure (silence with vi.spyOn(console, "error") if noisy).
  it("shows the fallback when a child throws", async () => {
    const wrapper = mount(ErrorBoundary, { slots: { default: Boom } });
    await nextTick();
    expect(wrapper.text()).toContain("kaboom");
  });
});
