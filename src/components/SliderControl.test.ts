import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import SliderControl from "./SliderControl.vue";

// Component tests: `mount()` renders the component into jsdom and returns a
// `wrapper` you can query (`.find`, `.text`, `.emitted`) and interact with.
// It's the Vue Test Utils equivalent of React Testing Library's `render()`.
describe("SliderControl", () => {
  it("renders label, value and unit together", () => {
    const wrapper = mount(SliderControl, {
      props: { label: "rotateX", min: -180, max: 180, unit: "deg", modelValue: 45 },
    });
    // Template renders `{{ label }}: {{ model }}{{ unit }}`.
    expect(wrapper.text()).toContain("rotateX: 45deg");
  });

  // 👉 TODO: moving the slider should emit `update:modelValue` with the new
  //    NUMBER (v-model.number coerces it). Sketch:
  //      const wrapper = mount(SliderControl, { props: { label, min, max, modelValue: 0 } });
  //      const input = wrapper.find('input[type="range"]');
  //      await input.setValue("90");
  //      expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([90]);
  //    `update:modelValue` is the event `defineModel()` emits under the hood —
  //    asserting on it proves your custom v-model actually works.
  it.todo("emits update:modelValue when the slider moves");
});
