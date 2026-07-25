<script setup lang="ts">
import { computed, onUnmounted, ref } from "vue";

// A non-zero starting distance so the 3D effect is visible immediately: CSS
// treats `perspective: 0` as "no perspective", which makes the rotations look
// like a flat squash rather than a tilt in depth. Shared by the initial value
// and reset() so the two can't drift.
const DEFAULT_PERSPECTIVE = 300;
const COPY_BTN_DEFAULT_TEXT = "Copy";
const COPY_BTN_COPIED_TEXT = "Style Copied!";
const COPY_RESET_MS = 2000;
// Safety net only. The label normally swaps on the button's `transitionend`,
// but when transitions are disabled (prefers-reduced-motion) that event never
// fires — so this makes sure the label still updates. Must be comfortably
// longer than the CSS transition.
const COPY_TEXT_FALLBACK_MS = 300;

// The four slider values (state), bound to the range inputs with v-model.number.
const perspective = ref<number>(DEFAULT_PERSPECTIVE);
const rotateX = ref<number>(0);
const rotateY = ref<number>(0);
const rotateZ = ref<number>(0);

// Two separate flags so the width and the label can be staggered:
//   isCopied       → drives the .copied class (the width transition)
//   showCopiedText → drives the label, one transition-length later
// Using a single flag for both would change them simultaneously — there'd be
// nothing to sequence.
const isCopied = ref<boolean>(false);
const showCopiedText = ref<boolean>(false);
const copyBtnText = computed(() =>
  showCopiedText.value ? COPY_BTN_COPIED_TEXT : COPY_BTN_DEFAULT_TEXT,
);

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

// Pending timers for the copy animation. Kept in one list so a rapid second
// click (or unmounting the view) can cancel every one of them at once.
let copyTimers: ReturnType<typeof setTimeout>[] = [];

function clearCopyTimers(): void {
  copyTimers.forEach((timer) => clearTimeout(timer));
  copyTimers = [];
}

// This view unmounts whenever you navigate to another route, so cancel any
// timer that would otherwise fire against a dead component.
onUnmounted(clearCopyTimers);

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
    clearCopyTimers(); // a rapid re-click restarts the sequence cleanly

    // Widen first. The label swaps in onWidthTransitionEnd(), i.e. exactly when
    // the width animation finishes — no hard-coded duration to keep in sync.
    isCopied.value = true;

    copyTimers.push(
      // Revert both together: the label shortens instantly, so the button can
      // shrink underneath it without the long text ever being clipped.
      setTimeout(() => {
        showCopiedText.value = false;
        isCopied.value = false;
      }, COPY_RESET_MS),
    );
  } catch (err) {
    console.warn("Copy failed:", err);
  }
}

function showCopiedLabel(): void {
  // Guard: ignore the *shrink* transition at the end of the sequence, when
  // isCopied is already false. Safe to call more than once.
  if (isCopied.value) showCopiedText.value = true;
}

function onWidthTransitionEnd(event: TransitionEvent): void {
  // `transition: all` fires this once per animated property, so filter to the
  // one we actually care about.
  if (event.propertyName === "width") showCopiedLabel();
}
</script>

<template>
  <div class="perspective-view">
    <h2>CSS3 Perspective Playground</h2>
    <main>
      <section class="settings">
        <div class="settings-container">
          <!-- Wrapping the input in its <label> associates the two, so screen
               readers announce the name and clicking the text focuses the
               slider. No id/for pairs needed. -->
          <label>
            perspective: {{ perspective }}px;
            <!-- min="1" keeps the slider out of the `perspective: 0` dead zone,
                 where CSS applies no perspective at all. -->
            <input
              type="range"
              min="1"
              max="999"
              v-model.number="perspective"
            />
          </label>

          <label>
            rotateX: {{ rotateX }}deg;
            <input type="range" min="-180" max="180" v-model.number="rotateX" />
          </label>

          <label>
            rotateY: {{ rotateY }}deg;
            <input type="range" min="-180" max="180" v-model.number="rotateY" />
          </label>

          <label>
            rotateZ: {{ rotateZ }}deg;
            <input type="range" min="-180" max="180" v-model.number="rotateZ" />
          </label>

          <button type="button" @click="reset">Reset</button>
          <!-- aria-live announces the "Style Copied!" change to screen readers. -->
          <button
            type="button"
            class="copy-btn"
            :class="{ copied: isCopied }"
            aria-live="polite"
            @click="copy"
            @transitionend="onWidthTransitionEnd"
          >
            {{ copyBtnText }}
          </button>
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
  white-space: nowrap;
  /* Free to change: the script waits for `transitionend` rather than assuming
     a duration, so the label stays in step automatically. */
  transition: all 0.1s ease-out;
}

/* A transition needs the *computed* value to change. A content-driven width
   (`auto`) keeps the same computed value when the label text changes, so
   nothing animates — that's why the earlier auto/calc-size attempt did nothing.
   Two explicit widths toggled by the .copied class give the browser a real
   start and end value to interpolate between. */
.copy-btn {
  width: 100px;
}

.copy-btn.copied {
  width: 190px;
}

/* Respect users who ask the OS to minimise animation. */
@media (prefers-reduced-motion: reduce) {
  button {
    transition: none;
  }
}
</style>
