import { defineStore } from "pinia";
import { computed, ref } from "vue";

/**
 * A Pinia "setup store": the function body reads exactly like a composable's
 * <script setup>. Whatever you RETURN becomes the store's public API:
 *   - refs      → state
 *   - computeds → getters
 *   - functions → actions
 *
 * The difference from a plain composable: Pinia makes it a single shared
 * instance (like your useTheme singleton), but with devtools, HMR, and easy
 * testing/reset. React analogy: a Zustand/Redux-Toolkit slice.
 *
 * The first arg ("counter") is the store's unique id.
 */
export const useCounterStore = defineStore("counter", () => {
  // State: a ref.
  const count = ref<number>(0);

  // 👉 TODO (getter): a computed derived from state — e.g. double the count.
  //    Getters never mutate; they only read. (Like a Redux selector.)
  const doubleCount = computed<number>(() => 0); // replace with count.value * 2

  // 👉 TODO (action): a function that mutates state. In Pinia you mutate state
  //    directly — no reducers, no immutability ceremony.
  function increment(): void {
    // count.value++;
  }

  // Everything returned here is exposed on the store instance.
  return { count, doubleCount, increment };
});
