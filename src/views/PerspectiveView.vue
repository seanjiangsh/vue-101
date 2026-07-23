<script setup lang="ts">
import { computed, ref } from "vue";

// The four slider values (state). Declared so the file builds; they're already
// wired to the sliders via v-model in the template. Feel free to refactor into
// a single reactive() object if you prefer.
const perspective = ref<number>(0);
const rotateX = ref<number>(0);
const rotateY = ref<number>(0);
const rotateZ = ref<number>(0);

// 👉 TODO: perspective() belongs on the CONTAINER (the parent of the box).
//    Return a style object, e.g. { perspective: `${perspective.value}px` }.
const containerStyle = computed(() => ({
  perspective: `${perspective.value}px`,
}));

// 👉 TODO: the rotations belong on the BOX itself. Build the transform string
//    from rotateX/Y/Z, e.g.
//    { transform: `rotateX(${rotateX.value}deg) rotateY(${rotateY.value}deg) rotateZ(${rotateZ.value}deg)` }
const boxStyle = computed(() => ({
  transform: `rotateX(${rotateX.value}deg) rotateY(${rotateY.value}deg) rotateZ(${rotateZ.value}deg)`,
}));

// 👉 TODO: set all four refs back to 0.
function reset(): void {
  perspective.value = 0;
  rotateX.value = 0;
  rotateY.value = 0;
  rotateZ.value = 0;
}

// 👉 TODO: copy the generated CSS to the clipboard with
//    navigator.clipboard.writeText(...). Decide what to copy — e.g. just the
//    box transform, or the full `perspective` + `transform` snippet.
async function copy(): Promise<void> {
  const data = {
    perspective: perspective.value,
    rotateX: rotateX.value,
    rotateY: rotateY.value,
    rotateZ: rotateZ.value,
  };
  try {
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  } catch (err) {
    console.warn(err);
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
          <input type="range" min="0" max="999" v-model.number="perspective" />

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
