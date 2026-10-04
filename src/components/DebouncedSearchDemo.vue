<script setup lang="ts">
import { ref, watch } from "vue";
import { useDebouncedRef } from "../composables/useDebouncedRef";

// Bound with v-model like any ref. Once TODO #1 is done, the watcher below runs
// only after you stop typing for 500ms.
const query = useDebouncedRef<string>("", 500);

// Stands in for an API call. Count how often it runs: with a plain ref it runs
// on every keystroke, with the debounced ref once per pause.
const searches = ref<number>(0);
watch(query, (q) => {
  searches.value++;
  console.log("[search]", JSON.stringify(q));
});
</script>

<template>
  <div class="search-demo">
    <input v-model="query" type="search" placeholder="Type to search…" />
    <p>
      Debounced value: <code>{{ query || "∅" }}</code> · searches fired:
      {{ searches }}
    </p>
  </div>
</template>

<style scoped>
.search-demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.search-demo p {
  margin: 0;
  font-size: 0.85rem;
}
</style>
