<script setup lang="ts">
import { ref } from "vue";

import type { ColorName } from "../composables/useColorSwatch";
import {
  defaultSwatchConfig,
  type SwatchConfig,
  // useSwatchConfig,  // 👈 TODO(you) #3: uncomment and use this below
} from "../composables/useSwatchConfig";

// `color` and `active` are genuine per-item props/events — they differ for every
// button, so they belong here, NOT in the injected config. The rule of thumb:
// inject shared/ambient config; keep item-specific data as props.
defineProps<{ color: ColorName; active: boolean }>();
defineEmits<{ select: [] }>();

// TODO(you) #3 — read the SHARED display config via injection instead of this
// local default. Once useSwatchConfig() is implemented, replace the line below:
//
//   const config = useSwatchConfig();
//
// Note there's NO `config` prop and HomeView/ColorSwatch never passes one down —
// that's the whole point: the value arrives through provide/inject, not props.
const config = ref<SwatchConfig>(defaultSwatchConfig);

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
    <template v-if="config.showLabels">{{ active ? "✓ " + color : color }}</template>
    <template v-else>{{ active ? "✓" : "●" }}</template>
  </button>
</template>
