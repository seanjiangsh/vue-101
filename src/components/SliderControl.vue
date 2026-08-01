<script setup lang="ts">
import { ref } from "vue"; // 👈 remove once you switch to defineModel

interface SliderControlProps {
  label: string;
  min: number;
  max: number;
  unit?: string; // e.g. "px" / "deg"; renders "" when omitted
}
// Reactive destructure (Vue 3.5+) — these stay reactive in the template.
const { label, min, max, unit } = defineProps<SliderControlProps>();

// 👉 TODO (your practice): replace the placeholder ref below with defineModel.
//
//    const model = defineModel<number>({ required: true });
//
// defineModel (Vue 3.4+) is the macro for a custom v-model. It returns a
// *writable* ref kept in two-way sync with the parent's `v-model` — under the
// hood it wires the `modelValue` prop + `update:modelValue` emit for you.
// React analogy: it generates the value + onChange pair automatically.
//
// The placeholder below lets the file build, but it's a LOCAL ref — dragging
// the slider won't reach the parent until you swap it for defineModel.
const model = ref<number>(0);
</script>

<template>
  <label>
    {{ label }}: {{ model }}{{ unit }}
    <input type="range" :min="min" :max="max" v-model.number="model" />
  </label>
</template>

<style scoped>
/* These move out of PerspectiveView with the sliders: scoped styles only reach
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
