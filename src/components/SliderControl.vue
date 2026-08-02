<script setup lang="ts">
import { ref } from "vue";

interface SliderControlProps {
  label: string;
  min: number;
  max: number;
  unit?: string; // e.g. "px" / "deg"; renders "" when omitted
}
// Reactive destructure (Vue 3.5+) — these stay reactive in the template.
const { label, min, max, unit } = defineProps<SliderControlProps>();

// Custom v-model: defineModel returns a *writable* ref kept in two-way sync
// with the parent's `v-model`. It wires the modelValue prop + update:modelValue
// emit for you (React analogy: the value + onChange pair, generated for you).
const model = defineModel<number>({ required: true });

// Let a parent focus the inner <input>. A template ref on a *component* gives
// the instance, not its DOM — so the child must opt a focus() method into its
// public API via defineExpose.
const inputRef = ref<HTMLInputElement | null>(null);
defineExpose({ focus: () => inputRef.value?.focus() });
</script>

<template>
  <label>
    {{ label }}: {{ model }}{{ unit }}
    <input
      ref="inputRef"
      type="range"
      :min="min"
      :max="max"
      v-model.number="model"
    />
  </label>
</template>

<style scoped>
/* These moved out of PerspectiveView with the sliders: scoped styles only reach
   a component's own elements, so the slider styling has to live here now. */
label {
  display: block;
  color: #fff;
}
input[type="range"] {
  display: block;
  margin-bottom: 10px;
  width: 200px;
}
</style>
