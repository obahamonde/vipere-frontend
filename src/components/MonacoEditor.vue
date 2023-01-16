<script setup lang="ts">
import MonacoEditor from "monaco-editor-vue3";
import { CodeFile } from "../types";
const { http, state, dispatch } = useStore();

const codefile = reactive<CodeFile>({
  name: "Untitled",
  content: "",
});

const show = ref(false);

const fileExtension = computed(() => codefile.name.split(".").pop());

const fileIcon = computed(() => {
  switch (fileExtension.value) {
    case "js":
      return "logos:javascript";
    case "py":
      return "logos:python";
    case "ts":
      return "logos:typescript-icon";
    case "html":
      return "logos:html-5";
    case "css":
      return "logos:css-3";
    case "json":
      return "logos:json";
    case "md":
      return "logos:markdown";
    default:
      return "mdi-file";
  }
});

const fileLanguage = computed(() => {
  switch (fileExtension.value) {
    case "js":
      return "javascript";
    case "ts":
      return "typescript";
    case "html":
      return "html";
    case "css":
      return "css";
    case "json":
      return "json";
    case "md":
      return "markdown";
    case "py":
      return "python";
    default:
      return "plaintext";
  }
});

const fileContentType = computed(() => {
  switch (fileExtension.value) {
    case "js":
      return "application/javascript";
    case "ts":
      return "application/typescript";
    case "html":
      return "text/html";
    case "css":
      return "text/css";
    case "json":
      return "application/json";
    case "md":
      return "text/markdown";
    case "py":
      return "text/x-python";
    default:
      return "text/plain";
  }
});

const pushFile = (file: CodeFile) => {
  if (file.name === "Untitled") {
    file.name = "app.py";
  }
  if (file.name.split(".").length === 1) {
    file.name = file.name + ".py";
  }
  if (state.codefiles.some((item) => item.name === file.name)) {
    return;
  }
  dispatch({
    codefiles: [
      ...state.codefiles,
      {
        ...file,
        icon: fileIcon.value,
        content_type: fileContentType.value,
        extension: fileExtension.value,
        last_modified: Date.now(),
        owner: state.user.sub,
      },
    ],
  });
};

const handleOpen = (file: CodeFile) => {
  Object.assign(codefile, file);
};

watchEffect(() => {
  for (const file of state.codefiles) {
    if (file.name === codefile.name) {
      Object.assign(file, codefile);
    }
  }
});

const getCompletion = async (file: CodeFile) => {
  const data = await http.text("/search/complete/" + encodeURIComponent(file.content as string)) as string;
  state.completion = data;
  show.value = true;
};

const handleCompletion = () => {
  codefile.content = codefile.content + state.completion;
  state.completion = "";
};

watchEffect(() => {
  if (state.completion === "") {
    show.value = false;
  }
});




</script>

<template>
  <main row start>
    <FileExplorer @open="handleOpen($event)" />
    <div h-94vh w-full rounded-lg sh>
      <div w-36 sh row rounded-tr :bg="isDark ? '#1E1E1E' : '#FFFFFE'">
        <input
          v-model="codefile.name"
          text-center
          class="w-32 h-10 px-2 dark:text-white no-outline"
          @keyup.enter="pushFile(codefile)"
          placeholder="Untitled"
        />
        <Icon
          icon="mdi-close"
          text-red
          hover:text-red-700
          cp
          scale
          m-1
          @click=""
        />
      </div>
      <MonacoEditor
        :theme="isDark ? 'vs-dark' : 'vs'"
        :options="monacoOptions"
        :language="fileLanguage"
        v-model:value="codefile.content"
        p-4
        :bg="isDark ? '#1E1E1E' : '#FFFFFE'"
        @change="codefile.last_modified = Date.now().toLocaleString()"
        @keydown.enter="getCompletion(codefile)"
        @keydown.tab="handleCompletion()"
        @keydown.escape="show = false;state.completion=''"
      />
      <Notification :timeout="10000" v-if="show" />
    </div>
  </main>
</template>
