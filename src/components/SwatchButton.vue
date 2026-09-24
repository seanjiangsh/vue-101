<script setup lang="ts">
import type { ColorName } from "../composables/useColorSwatch";
import {
  useSwatchConfig,
  type SwatchConfig,
} from "../composables/useSwatchConfig";

// `color` and `active` are genuine per-item props/events — they differ for every
// button, so they belong here, NOT in the injected config. The rule of thumb:
// inject shared/ambient config; keep item-specific data as props.
defineProps<{ color: ColorName; active: boolean }>();
defineEmits<{ select: [] }>();

// Shared display config (size/showLabels), pulled from the nearest provider via
// inject — no `config` prop is threaded down. It's a Ref; the template reads
// `config.size` directly because templates auto-unwrap top-level refs (in script
// you'd need `config.value.size`).
const config = useSwatchConfig();

// Maps the injected size to pixel dimensions (proof the injection reached here).
const sizePx: Record<SwatchConfig["size"], { w: number; h: number }> = {
  sm: { w: 80, h: 40 },
  md: { w: 100, h: 50 },
  lg: { w: 130, h: 64 },
};
</script>

<template>
  <button
    type="button"
    :style="{
      color: `var(--${color})`,
      width: sizePx[config.size].w + 'px',
      height: sizePx[config.size].h + 'px',
    }"
    :class="{ active }"
    :aria-label="color"
    @click="$emit('select')"
  >
    <!-- showLabels (from injected config) decides label vs. compact dot. -->
    <template v-if="config.showLabels">{{
      active ? "✓ " + color : color
    }}</template>
    <template v-else>{{ active ? "✓" : "●" }}</template>
  </button>
</template>
