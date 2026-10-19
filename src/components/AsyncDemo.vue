<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";

import ErrorBoundary from "./ErrorBoundary.vue";
import AsyncQuote from "./AsyncQuote.vue";
import LoadingSpinner from "./LoadingSpinner.vue";

// Lazy-loaded: `() => import(...)` makes the bundler split StatsPanel into its
// own StatsPanel-*.js chunk, fetched the first time it renders ("Show stats")
// and cached after that. The spinner appears only if loading takes over 200ms,
// so fast loads don't flash it. React comparison: React.lazy(() => import(...)),
// but the loading UI is an option here, so no <Suspense> boundary is needed.
const StatsPanel = defineAsyncComponent({
  loader: () => import("./StatsPanel.vue"),
  loadingComponent: LoadingSpinner,
  delay: 200,
});

// Demo 1 state. AsyncQuote's setup runs once per mount, so toggling `fail`
// alone doesn't refetch. "New quote" changes the key, which remounts it.
const failQuote = ref<boolean>(false);
const quoteKey = ref<number>(0);

// Demo 2 state.
const showStats = ref<boolean>(false);
</script>

<template>
  <div class="async-demo">
    <!-- Demo 1: <Suspense> + an async-setup component + your ErrorBoundary. -->
    <section class="async-section">
      <div class="async-controls">
        <label>
          <input type="checkbox" v-model="failQuote" />
          Make it fail
        </label>
        <button type="button" @click="quoteKey++">New quote</button>
      </div>

      <!-- ErrorBoundary goes OUTSIDE Suspense so a rejected fetch reaches its
           onErrorCaptured (Retry remounts the quote and fetches again). Inside,
           Suspense shows #fallback until AsyncQuote's setup promise resolves. -->
      <ErrorBoundary>
        <Suspense>
          <AsyncQuote :key="quoteKey" :fail="failQuote" />
          <template #fallback>
            <LoadingSpinner />
          </template>
        </Suspense>
      </ErrorBoundary>
    </section>

    <!-- Demo 2: defineAsyncComponent (lazy-loaded component). -->
    <section class="async-section">
      <button type="button" @click="showStats = !showStats">
        {{ showStats ? "Hide" : "Show" }} stats
      </button>
      <StatsPanel v-if="showStats" />
    </section>
  </div>
</template>

<style scoped>
.async-demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.async-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.async-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}
</style>
