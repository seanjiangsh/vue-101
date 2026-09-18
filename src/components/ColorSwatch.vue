<script setup lang="ts">
import { onRenderTracked, onRenderTriggered, ref } from "vue";

import { useColorSwatch } from "../composables/useColorSwatch";
import {
  provideSwatchConfig,
  type SwatchConfig,
} from "../composables/useSwatchConfig";
import SwatchButton from "./SwatchButton.vue";

// All swatch state/logic lives in the composable; this component is just the
// view that renders it and forwards clicks.
const { activeColor, hideAlerts, visibleColors } = useColorSwatch();

// --- provide / inject practice: this component is the PROVIDER ---------------
// It owns the shared display config and provides it. The <SwatchButton> leaves
// below inject it — notice we never pass a `config` prop to them. Mutating this
// ref (via the controls below) will update every button, once you wire up
// provide (TODO #1) and inject (TODO #3).
const swatchConfig = ref<SwatchConfig>({ size: "md", showLabels: true });
provideSwatchConfig(swatchConfig);

// --- Render-debug hooks (dev-only; stripped from production builds) ---------
// These are instruments, not app logic: registered once, Vue calls them for us.

// onRenderTracked = "what does this render read?" Fires ONCE PER DEP as Vue
// collects dependencies during render — so expect a BURST every render.
// Gotcha: reading a ref reads its `.value`, so `key` is the literal "value" for
// every ref (activeColor, hideAlerts, ...) — not enough to tell them apart. The
// useful signal here is the count and the `type` ('get' for refs), not the key,
// so we keep this log terse.
onRenderTracked((e) => {
  console.log(`[tracked] ${e.type} on "${String(e.key)}"`);
});

// onRenderTriggered = "why did this render happen?" Fires ONCE, when a tracked
// dep actually MUTATES. This is the hook you reach for to debug surprise
// re-renders — and unlike onRenderTracked, its event carries oldValue/newValue,
// so we can show the exact transition that caused the re-render.
onRenderTriggered((e) => {
  console.log(
    `[triggered] ${e.type} on "${String(e.key)}": %o → %o`,
    e.oldValue,
    e.newValue,
  );
});
</script>

<template>
  <div class="swatch-wrap">
    <label class="swatch-toggle">
      <input type="checkbox" v-model="hideAlerts" />
      Hide alert colors
    </label>

    <!-- Config controls: these mutate the PROVIDED ref. They won't visibly do
         anything until provide (#1) + inject (#3) are wired — that's the payoff. -->
    <div class="swatch-config">
      <label>
        Size
        <select v-model="swatchConfig.size">
          <option value="sm">sm</option>
          <option value="md">md</option>
          <option value="lg">lg</option>
        </select>
      </label>
      <label>
        <input type="checkbox" v-model="swatchConfig.showLabels" />
        Show labels
      </label>
    </div>

    <div class="color-swatch">
      <!-- Preview of the selected color: spans the full first row. -->
      <div
        class="swatch-preview"
        :style="{ backgroundColor: `var(--${activeColor})` }"
      />

      <!-- One <SwatchButton> per visible color. It gets color/active as props
           (per-item), but reads size/showLabels via inject (shared config). -->
      <SwatchButton
        v-for="color in visibleColors"
        :key="color"
        :color="color"
        :active="color === activeColor"
        @select="activeColor = color"
      />
    </div>
  </div>
</template>

<style scoped>
.swatch-config {
  display: flex;
  gap: 12px;
  align-items: center;
  font-size: 0.85rem;
}
</style>
