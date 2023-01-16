<script setup lang="ts">
const show = ref(true);
const props = defineProps<{ timeout: number }>();
const { state } = useStore();
onMounted(() => {
  setTimeout(() => {
    show.value = false;
  }, props.timeout);
});
</script>
<template>
  <div>
    <v-alert
      animate-fade-in-right
      tr
      fixed
      text-xs
      mt-24
      bg-black
      text-white
      v-model="show"
      col
      sh
    >
      <p text-white my-4>
        Suggestion: press
        <kbd p-1 rounded sh bg-gray-300 text-black>Tab</kbd> to autocomplete
      </p>
      <code w-full h-full bg-black text-lime-300 p-4 overflow-x-scroll>
        {{ state.completion }}
      </code>
    </v-alert>

    <div v-if="!show" class="text-center"></div>
  </div>
</template>
