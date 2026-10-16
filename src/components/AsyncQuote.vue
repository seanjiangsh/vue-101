<script setup lang="ts">
import type { Quote } from "../utils/fakeQuoteApi";

defineProps<{ fail?: boolean }>();

// TODO(you) #1: fetch the quote with a top-level `await`.
//  a) Keep the props: `const props = defineProps<{ fail?: boolean }>();`
//  b) import { fetchQuote } from "../utils/fakeQuoteApi";
//  c) Replace the placeholder below with:
//       const quote = await fetchQuote(props.fail);
//
// Any top-level `await` in <script setup> turns this into an ASYNC component:
// its setup returns a promise, and Vue won't render it until that settles. Its
// parent then needs a <Suspense> around it (TODO #2). Without one, Vue warns
// and renders nothing. Try it once before doing #2 so you see the warning.
// React comparison: this is "suspending" a component while its data loads.
const quote: Quote = { text: "(placeholder, not fetched yet)", author: "TODO #1" };
</script>

<template>
  <blockquote class="quote">
    <p>“{{ quote.text }}”</p>
    <footer>— {{ quote.author }}</footer>
  </blockquote>
</template>

<style scoped>
.quote {
  margin: 0;
  max-width: 320px;
  font-style: italic;
}
.quote p {
  margin: 0 0 4px;
}
.quote footer {
  font-style: normal;
  font-size: 0.85rem;
}
</style>
