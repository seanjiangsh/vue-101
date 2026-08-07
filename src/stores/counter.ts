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

  // Getter: a computed derived from state (never mutates). Like a Redux selector.
  const doubleCount = computed<number>(() => count.value * 2);

  // Action: mutates state directly — no reducers, no immutability ceremony.
  function increment(): void {
    count.value++;
  }

  // Everything returned here is exposed on the store instance.
  return { count, doubleCount, increment };
});
