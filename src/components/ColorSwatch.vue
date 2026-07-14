<script setup lang="ts">
import { useColorSwatch } from "../composables/useColorSwatch";

// All swatch state/logic lives in the composable; this component is just the
// view that renders it and forwards clicks.
const { activeColor, hideAlerts, visibleColors } = useColorSwatch();
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
