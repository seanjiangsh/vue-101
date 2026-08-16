import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import SliderControl from "./SliderControl.vue";

// Component tests: `mount()` renders the component into jsdom and returns a
// `wrapper` you can query (`.find`, `.text`, `.emitted`) and interact with.
// It's the Vue Test Utils equivalent of React Testing Library's `render()`.
describe("SliderControl", () => {
  it("renders label, value and unit together", () => {
    const wrapper = mount(SliderControl, {
      props: {
        label: "rotateX",
        min: -180,
        max: 180,
        unit: "deg",
        modelValue: 45,
      },
    });
    // Template renders `{{ label }}: {{ model }}{{ unit }}`.
    expect(wrapper.text()).toContain("rotateX: 45deg");
  });

  // Moving the slider emits `update:modelValue` (the event defineModel() emits
  // under the hood), proving the custom v-model round-trips. Two subtleties:
  //  - `await`: DOM/reactivity updates are async, so await setValue() before
  //    asserting, or the emission hasn't happened yet.
  //  - string → number: setValue passes the DOM's string "300"; v-model.number
  //    coerces it, so the payload is [300]. toEqual([300]) would FAIL on ["300"],
  //    which is exactly how this test guards the coercion.
  it("emits update:modelValue when the slider moves", async () => {
    const wrapper = mount(SliderControl, {
      props: {
        label: "perspective",
        min: 1,
        max: 999,
        unit: "px",
        modelValue: 45,
      },
    });
    const input = wrapper.find('input[type="range"]');
    await input.setValue("300");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([300]);
  });
});
