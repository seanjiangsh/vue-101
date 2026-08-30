<script setup lang="ts">
import { ref } from "vue";
import { useInterval } from "../composables/useInterval";

const ticks = ref<number>(0);
// The log is a learning aid: watch the console while you Start the ticker, then
// Hide the demo. With onScopeDispose in useInterval the logs stop on unmount;
// without it they'd keep firing forever (the leak). Remove once you've seen it.
const { isActive, start, stop } = useInterval(() => {
  console.log("[IntervalDemo] tick", ticks.value);
  ticks.value++;
}, 1000);
</script>

<template>
  <div class="interval-demo">
    <p>Ticks: {{ ticks }} — {{ isActive ? "running" : "stopped" }}</p>
    <button type="button" :disabled="isActive" @click="start">Start</button>
    <button type="button" :disabled="!isActive" @click="stop">Stop</button>
  </div>
</template>

<style scoped>
.interval-demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
</style>
