<script setup lang="ts">
import { ref } from "vue";

import viteLogo from "../assets/vite.svg";
import heroImg from "../assets/hero.png";
import vueLogo from "../assets/vue.svg";

import { useTheme, type ThemeMode } from "../composables/useTheme";
import ColorSwatch from "../components/ColorSwatch.vue";
import ErrorBoundary from "../components/ErrorBoundary.vue";
import BuggyChild from "../components/BuggyChild.vue";

// Hero toggling
const showHero = ref<boolean>(true);

// Count
const count = ref<number>(0);

// light/dark theme — all the logic lives in the composable (a Vue "hook").
const { nextTheme, cycleTheme } = useTheme();

// Presentation only: how each mode is labelled in the button.
const labels: Record<ThemeMode, string> = {
  light: "☀️ Light",
  dark: "🌙 Dark",
  system: "💻 System",
};
</script>

<template>
  <section id="center">
    <!-- .hero-slot reserves the hero's height so hiding it never shifts the
         buttons. <Transition> fades the hero in/out on the v-if toggle. -->
    <div class="hero-slot">
      <Transition name="fade">
        <div class="hero" v-if="showHero">
          <img :src="heroImg" class="base" width="170" height="179" alt="" />
          <img :src="vueLogo" class="framework" alt="Vue logo" />
          <img :src="viteLogo" class="vite" alt="Vite logo" />
        </div>
      </Transition>
    </div>

    <div class="controls">
      <button type="button" @click="showHero = !showHero">
        {{ showHero ? "Hide" : "Show" }} hero
      </button>
      <button type="button" class="counter" @click="count++">
        Count is {{ count }}
      </button>
      <button type="button" @click="cycleTheme">
        Switch to {{ labels[nextTheme] }} mode
      </button>
      <ColorSwatch />

      <!-- Error-boundary practice: BuggyChild throws on click; once you
           implement onErrorCaptured in ErrorBoundary, this fallback shows
           instead of the error crashing the scene. -->
      <ErrorBoundary>
        <BuggyChild />
      </ErrorBoundary>
    </div>
  </section>
</template>
