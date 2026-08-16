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

  // 👉 TODO: when a descendant throws, the fallback should render instead of
  //    the children. Sketch:
  //      const wrapper = mount(ErrorBoundary, { slots: { default: Boom } });
  //      await nextTick(); // the boundary re-renders after onErrorCaptured runs
  //      expect(wrapper.text()).toContain("Something broke");
  //    Note: Vue will log the caught error to the console during this test —
  //    that's expected, not a failure. (You can silence it with a
  //    vi.spyOn(console, "error").mockImplementation(() => {}) if it bothers you.)
  it.todo("shows the fallback when a child throws");
});
