<script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";
const { isAuthenticated } = useAuth0();
const items = ref([
  { title: "Issues", icon: "mdi-check", to: "/issues" },
  { title: "CodeStudio", icon: "material-symbols:file-copy", to: "/code" },
  { title: "Search", icon: "mdi-magnify", to: "/search" },
  { title: "Datastores", icon: "mdi-database", to: "/data" },
  { title: "Pipelines", icon: "mdi-pipe", to: "/pipelines" },
  { title: "Monitor", icon: "ic:round-bar-chart", to: "/monitor" },
  { title: "About", icon: "mdi-information", to: "/about" },
]);
</script>
<template>
  <VToolbar
    col
    center
    h-screen
    fixed
    color="primary"
    class="top-0 left-0 h-full z-40 sh px-1 rounded-r"
    v-if="isAuthenticated"
  >
    <VList dense col center bg-transparent gap-4>
      <img
        x4
        src="/favicon.gif"
        cp
        hover:opacity-50
        @click="drawer = !drawer"
      />
      <VListItem v-for="item in items" :key="item.title">
        <RouterLink
          :to="item.to"
          text-cyan-300
          decoration-none
          :title="item.title"
        >
          <Icon text-4xl scale hover:text-amber :icon="item.icon" />
        </RouterLink>
      </VListItem>
    </VList>
  </VToolbar>
  <button
    class="top-0 left-0 rf z-50 px-1 m-1 mt-20 hover:opacity-50 fixed"
    @click="drawer = !drawer"
    v-else
  >
    <img src="/favicon.gif" x4 />
  </button>
</template>
