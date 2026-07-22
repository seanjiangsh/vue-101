import { createRouter, createWebHashHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";

const router = createRouter({
  // Hash history (URLs like /#/perspective) works on static hosts such as
  // GitHub Pages with no server rewrites — unlike HTML5 history mode.
  history: createWebHashHistory(),
  routes: [
    { path: "/", name: "home", component: HomeView },
    {
      path: "/perspective",
      name: "perspective",
      // Lazy-loaded: code-split into its own chunk, fetched on first visit
      // (the Vue Router equivalent of React.lazy).
      component: () => import("../views/PerspectiveView.vue"),
    },
  ],
});

export default router;
