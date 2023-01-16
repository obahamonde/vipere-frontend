<script setup lang="ts">
import { CodeFile } from "../types";
const { state, http, dispatch } = useStore();
const show = (item: CodeFile) => {
  const el = document.getElementById(item.name);
  if (el) {
    el.style.opacity = "1";
  }
};
const hide = (item: CodeFile) => {
  const el = document.getElementById(item.name);
  if (el) {
    el.style.opacity = "0";
  }
};

const postCodeFile = async (file: CodeFile) => {
  await http.post("/codefiles/?sub=" + state.user.sub, {
    body: JSON.stringify(file),
  });
};

const getCodeFiles = async () => {
  const data = await http.get("/codefiles/?sub=" + state.user.sub);
  dispatch({ codefiles: data });
};

const deleteFile = async (id: string) => {
  await http.delete(`/codefiles/${id}?sub=${state.user.sub}`);
  await getCodeFiles();
};

onMounted(async () => {
  await getCodeFiles();
});

onUnmounted(async () => {
  for (const file of state.codefiles) {
    await postCodeFile(file);
  }
});
</script>
<template>
  <section col start h-screen ml-20>
    <div dense col center bg-transparent p-4 gap-4 w-40>
      <button
        v-for="item in state.codefiles"
        :key="item.name"
        row
        start
        gap-2
        animate-fade-in
        @click="$emit('open', item)"
      >
        <Icon :icon="item.icon" />
        <h1 text-sm>{{ item.name }}</h1>
        <Icon
          icon="mdi-delete"
          text-red
          hover:text-red-700
          cp
          scale
          m-1
          @click="deleteFile(item.id as string)"
          :class="{
            'animate-fade-out':
              state.codefiles.indexOf(item) === state.codefiles.length - 1,
          }"
          @mouseover="show(item)"
          @mouseleave="hide(item)"
          :id="item.name"
          opacity="0"
          transition="opacity 0.2s ease-in-out"
        />
      </button>
    </div>
  </section>
</template>
