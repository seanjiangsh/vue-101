<script setup lang="ts">
import { ref } from "vue";

import ErrorBoundary from "./ErrorBoundary.vue";
import AsyncQuote from "./AsyncQuote.vue";

// TODO(you) #3: load StatsPanel lazily with defineAsyncComponent.
// Right now it's a normal static import, so it ships in the main bundle even
// if nobody ever clicks "Show stats". Replace this import with:
//
//   import { defineAsyncComponent } from "vue";   (add to the import above)
//   import LoadingSpinner from "./LoadingSpinner.vue";
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

      <ErrorBoundary>
        <!-- TODO(you) #2: wrap <AsyncQuote> in <Suspense>.
             <Suspense>
               <AsyncQuote ... />                (the default slot)
               <template #fallback>…</template>  (shown while it's pending)
             </Suspense>
             LoadingSpinner works well as the fallback (import it).
             Then try `:timeout="0"` on <Suspense> and click "New quote":
             without it, Suspense keeps the OLD quote on screen while the new
             one loads; with it, the fallback shows straight away.
             ErrorBoundary sits OUTSIDE Suspense, so a rejected fetch reaches
             its onErrorCaptured; its Retry button remounts and refetches. -->
        <AsyncQuote :key="quoteKey" :fail="failQuote" />
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
