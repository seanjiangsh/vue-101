<script setup lang="ts">
import { ref } from "vue";

import ErrorBoundary from "./ErrorBoundary.vue";
import AsyncQuote from "./AsyncQuote.vue";
import LoadingSpinner from "./LoadingSpinner.vue";

// TODO(you) #3: load StatsPanel lazily with defineAsyncComponent.
// Right now it's a normal static import, so it ships in the main bundle even
// if nobody ever clicks "Show stats". Replace this import with
// (LoadingSpinner is already imported above):
//
//   import { defineAsyncComponent } from "vue";   (add to the import above)
//
//   const StatsPanel = defineAsyncComponent({
//     loader: () => import("./StatsPanel.vue"),
//     loadingComponent: LoadingSpinner,
//     delay: 200, // only show the spinner if loading takes longer than this
//   });
//
// Then run `pnpm run build` before and after: a new StatsPanel-*.js chunk
// appears. In `pnpm dev`, the DevTools Network tab shows it loading on the
// first click only. React comparison: React.lazy(() => import(...)), but the
// loading UI and delay are options here instead of a <Suspense> boundary.
import StatsPanel from "./StatsPanel.vue";

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
