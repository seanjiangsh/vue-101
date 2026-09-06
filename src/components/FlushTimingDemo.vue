<script setup lang="ts">
import { ref, watch } from "vue";
// 👉 TODO: you may also want `watchPostEffect` (see the TODO below).

const count = ref<number>(3);
const listRef = ref<HTMLUListElement | null>(null);

// Default watch = flush: 'pre' → runs BEFORE Vue patches the DOM. So when count
// changes, this reads the list's OLD height (the new <li> isn't rendered yet):
// it's one change behind.
watch(count, () => {
  console.log("[pre ] height =", listRef.value?.offsetHeight);
});

// 👉 TODO (your practice): add a watcher that runs AFTER the DOM updates, so it
//    reads the NEW height. Two equivalent ways — pick one:
//
//    watch(count, () => {
//      console.log("[post] height =", listRef.value?.offsetHeight);
//    }, { flush: "post" });
//
//    // or the shorthand (auto-tracks count because you read it):
//    watchPostEffect(() => {
//      count.value;
//      console.log("[post] height =", listRef.value?.offsetHeight);
//    });
//
// Then click "Add item" and compare: [pre ] logs the height BEFORE the new row
// rendered, [post] logs it AFTER. That gap is the whole lesson — reading the DOM
// in a watcher requires flush:'post' (default 'pre' sees a stale DOM).
</script>

<template>
  <div class="flush-demo">
    <ul ref="listRef" class="flush-list">
      <li v-for="n in count" :key="n">Item {{ n }}</li>
    </ul>
    <button type="button" @click="count++">Add item</button>
  </div>
</template>

<style scoped>
.flush-demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.flush-list {
  margin: 0;
  padding-left: 20px;
  text-align: left;
}
</style>
