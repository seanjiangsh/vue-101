<script setup lang="ts">
import { ref } from "vue";

import viteLogo from "../assets/vite.svg";
import heroImg from "../assets/hero.png";
import vueLogo from "../assets/vue.svg";

import ColorSwatch from "../components/ColorSwatch.vue";
import ErrorBoundary from "../components/ErrorBoundary.vue";
import BuggyChild from "../components/BuggyChild.vue";
import AppModal from "../components/AppModal.vue";
import IntervalDemo from "../components/IntervalDemo.vue";
import FlushTimingDemo from "../components/FlushTimingDemo.vue";
import { useCounterStore } from "../stores/counter";
import { useThemeStore, type ThemeMode } from "../stores/theme";

// Hero toggling
const showHero = ref<boolean>(true);

// Interval demo toggle — hiding it UNMOUNTS IntervalDemo, which disposes its
// effect scope and (once you add onScopeDispose) stops the timer.
const showInterval = ref<boolean>(true);

// Count
const counter = useCounterStore();

// light/dark theme
const theme = useThemeStore();

// Presentation only: how each mode is labelled in the button.
const labels: Record<ThemeMode, string> = {
  light: "☀️ Light",
  dark: "🌙 Dark",
  system: "💻 System",
};

// About
const showAbout = ref<boolean>(false);
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
      <button type="button" class="counter" @click="counter.increment">
        Count is {{ counter.count }}, doubled is {{ counter.doubleCount }}
      </button>
      <button type="button" @click="theme.cycleTheme">
        Switch to {{ labels[theme.nextTheme] }} mode
      </button>
      <ColorSwatch />

      <!-- Error-boundary practice: BuggyChild throws on click; once you
      implement onErrorCaptured in ErrorBoundary, this fallback shows
      instead of the error crashing the scene. -->
      <ErrorBoundary>
        <BuggyChild />
      </ErrorBoundary>

      <button type="button" @click="showAbout = true">About</button>

      <!-- effectScope / onScopeDispose practice: start the ticker, then hide
           the demo. Unmounting disposes its scope — with onScopeDispose the
           timer stops; without it, it leaks (ticks keep firing in the console). -->
      <button type="button" @click="showInterval = !showInterval">
        {{ showInterval ? "Hide" : "Show" }} interval demo
      </button>
      <IntervalDemo v-if="showInterval" />

      <!-- Watcher flush-timing practice: open the console, click "Add item",
           and compare the [pre ] vs [post] height logs. -->
      <FlushTimingDemo />
    </div>

    <!-- Teleport and named/scoped slots practice -->
    <AppModal v-model:open="showAbout">
      <template #header>About vue-101</template>
      <p>A Vue 3 learning playground.</p>
      <template #footer="{ close }">
        <button @click="close">Got it</button>
      </template>
    </AppModal>
  </section>
</template>
