<script setup lang="ts">
import { ref } from "vue";
import viteLogo from "../assets/vite.svg";
import heroImg from "../assets/hero.png";
import vueLogo from "../assets/vue.svg";
import { useTheme } from "../composables/useTheme";

// Hero toggling
const showHero = ref<boolean>(true);

// Count
const count = ref<number>(0);

// Color
type ColorOption =
  | "primary"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "purple"
  | "pink";

const colors: readonly ColorOption[] = [
  "primary",
  "success",
  "warning",
  "error",
  "info",
  "purple",
  "pink",
];
const btnColor = ref<string>(
  `var(--${colors[Math.floor(Math.random() * colors.length)]})`,
);
function changeColor(): void {
  btnColor.value = `var(--${colors[Math.floor(Math.random() * colors.length)]})`;
}

// light/dark theme — all the logic now lives in the composable.
// Just like `const { theme, toggleTheme } = useTheme()` would be a hook in React.
const { theme, toggleTheme } = useTheme();
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
      <button type="button" :style="{ color: btnColor }" @click="changeColor">
        Change text color
      </button>
      <button type="button" @click="toggleTheme">
        Switch to {{ theme === "dark" ? "light" : "dark" }} mode
      </button>
    </div>
  </section>
</template>
