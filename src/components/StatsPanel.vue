<script setup lang="ts">
import { computed } from "vue";
import { useCounterStore } from "../stores/counter";

// Pretend this component is heavy (a charting library, a big table). That's
// the kind of thing worth splitting into its own JS chunk and loading only when
// the user asks for it. Once TODO #3 is done, it's no longer in the main bundle.
const counter = useCounterStore();

const rows = computed(() => [
  { label: "Count", value: counter.count },
  { label: "Doubled", value: counter.doubleCount },
  { label: "Squared", value: counter.count ** 2 },
]);
</script>

<template>
  <table class="stats">
    <tr v-for="row in rows" :key="row.label">
      <th scope="row">{{ row.label }}</th>
      <td>{{ row.value }}</td>
    </tr>
  </table>
</template>

<style scoped>
.stats {
  border-collapse: collapse;
}
.stats th,
.stats td {
  padding: 4px 12px;
  border: 1px solid var(--border);
  text-align: left;
}
</style>
