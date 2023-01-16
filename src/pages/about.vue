<script setup lang="ts">
const { state, dispatch } = useStore();
const add = () => {
  dispatch({ clicks: state.clicks + 1 });
};
</script>
<template>
<section p-16 col center text-secondary drop-shadow-black drop-shadow-2xl>
<h1 text="#008080" font-script>Thank you!</h1>
</section>
</template>
