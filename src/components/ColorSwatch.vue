<script setup lang="ts">
import { onRenderTracked, onRenderTriggered } from "vue";

import { useColorSwatch } from "../composables/useColorSwatch";

// All swatch state/logic lives in the composable; this component is just the
// view that renders it and forwards clicks.
const { activeColor, hideAlerts, visibleColors } = useColorSwatch();

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
    `[triggered] ${e.type} on "${String(e.key)}": ${e.oldValue} → ${e.newValue}`,
  );
});
</script>

<template>
  <div class="swatch-wrap">
    <label class="swatch-toggle">
      <input type="checkbox" v-model="hideAlerts" />
      Hide alert colors
    </label>

    <div class="color-swatch">
      <!-- Preview of the selected color: spans the full first row. -->
      <div
        class="swatch-preview"
        :style="{ backgroundColor: `var(--${activeColor})` }"
      />

      <!-- One button per visible color; clicking selects it. -->
      <button
        v-for="color in visibleColors"
        :key="color"
        type="button"
        :style="{ color: `var(--${color})` }"
        :class="{ active: color === activeColor }"
        :aria-label="color"
        @click="activeColor = color"
      >
        {{ color === activeColor ? "✓ " + color : color }}
      </button>
    </div>
  </div>
</template>
