 <script setup lang="ts">
const route = useRoute();
</script>
<template>
  <section>
    {{ route.path }}
  </section>
</template>
