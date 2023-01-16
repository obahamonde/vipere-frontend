<script setup lang="ts"></script>
<template>
  <VToolbar color="primary" dark z-50>
    <VToolbarTitle
      text-amber
      cp
      font-script
      text-2xl
      @click.stop="$router.push('/')"
      >Vipère</VToolbarTitle
    >
  </VToolbar>
  <main row>
    <SideBar />
    <RouterView w-full />
    <Auth />
  </main>
</template>
