<script setup lang="ts">
import { computed, ref } from "vue";

// A non-zero starting distance so the 3D effect is visible immediately: CSS
// treats `perspective: 0` as "no perspective", which makes the rotations look
// like a flat squash rather than a tilt in depth. Shared by the initial value
// and reset() so the two can't drift.
const DEFAULT_PERSPECTIVE = 300;

// The four slider values (state), bound to the range inputs with v-model.number.
const perspective = ref<number>(DEFAULT_PERSPECTIVE);
const rotateX = ref<number>(0);
const rotateY = ref<number>(0);
const rotateZ = ref<number>(0);

// perspective() belongs on the CONTAINER — the parent of the element being
// transformed. It sets the viewer's distance from the 3D scene, so smaller
// values produce a more extreme effect.
const containerStyle = computed(() => ({
  perspective: `${perspective.value}px`,
}));

// The rotations belong on the BOX itself — the element actually being turned.
const boxStyle = computed(() => ({
  transform: `rotateX(${rotateX.value}deg) rotateY(${rotateY.value}deg) rotateZ(${rotateZ.value}deg)`,
}));

function reset(): void {
  perspective.value = DEFAULT_PERSPECTIVE;
  rotateX.value = 0;
  rotateY.value = 0;
  rotateZ.value = 0;
}

// Copy a pasteable CSS snippet. This reads the *computeds* rather than
// rebuilding the strings from the refs, so what lands on the clipboard can
// never drift from what the box is actually rendering.
async function copy(): Promise<void> {
  const css = [
    `.box-container {`,
    `  perspective: ${containerStyle.value.perspective};`,
    `}`,
    `.box {`,
    `  transform: ${boxStyle.value.transform};`,
    `}`,
  ].join("\n");

  try {
    await navigator.clipboard.writeText(css);
  } catch (err) {
    console.warn("Copy failed:", err);
  }
}
</script>

<template>
  <div class="perspective-view">
    <h2>CSS3 Perspective Playground</h2>
    <main>
      <section class="settings">
        <div class="settings-container">
          <label>perspective: {{ perspective }}px;</label>
          <!-- min="1" keeps the slider out of the `perspective: 0` dead zone,
               where CSS applies no perspective at all. -->
          <input type="range" min="1" max="999" v-model.number="perspective" />

          <label>rotateX: {{ rotateX }}deg;</label>
          <input type="range" min="-180" max="180" v-model.number="rotateX" />

          <label>rotateY: {{ rotateY }}deg;</label>
          <input type="range" min="-180" max="180" v-model.number="rotateY" />

          <label>rotateZ: {{ rotateZ }}deg;</label>
          <input type="range" min="-180" max="180" v-model.number="rotateZ" />

          <button type="button" @click="reset">Reset</button>
          <button type="button" @click="copy">Copy</button>
        </div>
      </section>

      <section class="output">
        <!-- perspective applies here (the parent); the box is what rotates. -->
        <div class="box-container" :style="containerStyle">
          <div class="box" :style="boxStyle" />
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* Scoped: all of these apply ONLY to this component (Vue tags each element
   with a data-attribute and rewrites the selectors to match). That's why the
   bare `button`/`h2` rules here can't leak into the rest of the app. */
.perspective-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #261c33;
  font-family: monospace, sans-serif;
}

h2 {
  color: #8d81f3;
  text-align: center;
  font-size: 40px;
  margin: 20px;
}

main {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 420px;
  max-width: 768px;
  width: 100%;
  font-size: 22px;
}

.settings {
  width: 50%;
  z-index: 2;
}

label {
  display: block;
  color: #fff;
}

input[type="range"] {
  display: block;
  margin-bottom: 10px;
  width: 200px;
}

.box-container {
  padding: 50px;
  border: 1px solid #8d81f3;
}

.box {
  width: 150px;
  height: 150px;
  background: #8d81f3;
}

button {
  background-color: #8d81f3;
  color: #fff;
  font-size: 20px;
  padding: 10px;
  border: none;
  margin-right: 10px;
  margin-top: 10px;
  cursor: pointer;
}
</style>
