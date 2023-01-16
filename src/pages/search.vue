<script setup lang="ts">
import { CodeFile } from "../types";

const { state, http } = useStore();
const results = ref([]);
const repos = ref([]);
const packages = ref([]);
const search = ref("");
const github = ref("");
const pypi = ref("");

const searchGoogle = async () => {
  results.value = await http.get("/search/google/" + search.value);
};

const searchGithub = async () => {
  repos.value = await http.get("/search/github/" + github.value);
};

const searchPypi = async () => {
  packages.value = await http.get("/search/pypi/" + pypi.value);
};

const addtoRequirements = async (pkg: string, vers: string) => {
  let req: CodeFile | undefined = useStore().state.codefiles.find(
    (file) => file.name === "requirements.txt"
  );
  if (!req) {
    state.codefiles.push({
      name: "requirements.txt",
      content: pkg + "==" + vers + "\n",
      content_type: "text/plain",
      icon: "mdi-file-document",
      owner: state.user.sub,
    });
  } else {
    req = {
      name: req.name,
      content: req.content + pkg + "==" + vers + "\n",
      content_type: "text/plain",
      icon: "mdi-file-document",
      owner: state.user.sub,
    };
  }
  await postCodeFile(req as CodeFile);
};

const postCodeFile = async (file: CodeFile) => {
  await http.post("/codefiles/?sub=" + state.user.sub, {
    body: JSON.stringify(file),
  });
};

watchEffect(() => {
  search.value.length < 3 ? (results.value = []) : null;
  github.value.length < 3 ? (repos.value = []) : null;
});
</script>
<template>
  <VContainer p-8 row start gap-8>
    <VCard class="w-1/3" p-12 color="primary">
      <VTextField
        type="text bg-white text-black"
        v-model="search"
        @keyup.enter="searchGoogle()"
        prepend-inner-icon="mdi-magnify"
        label="Search engine"
      ></VTextField>
      <p sh p-2 my-2 bg-white text-black rounded v-for="result in results">
        <a
          :href="result.link"
          cp
          scale
          decoration-none
          hover:underline
          target="_blank"
          >{{ result.title }}</a
        >
      </p>
    </VCard>
    <VCard class="w-1/3" p-12 color="secondary">
      <VTextField
        type="text"
        v-model="github"
        @keyup.enter="searchGithub()"
        prepend-inner-icon="mdi-github"
        label="Github Search"
      ></VTextField>
      <VCard sh p-2 my-2 v-for="result in repos">
        <div row>
          <a
            :href="result.html_url"
            cp
            scale
            decoration-none
            hover:underline
            target="_blank"
          >
            <VCardTitle text-xs>{{ result.name }}</VCardTitle>
          </a>
          <div col end right-0 absolute mr-4>
            <p>{{ result.owner["login"] }}</p>
            <img
              :src="result.owner['avatar_url']"
              class="w-12 h-12 rounded-full"
            />
          </div>
        </div>
        <VCardText text-xs m-2>{{ result.description }}</VCardText>
        <div row text-xs>
          <Icon icon="mdi-star" class="mx-2" /> {{ result.stargazers_count }}
          <Icon icon="mdi-git" class="mx-2" /> {{ result.forks_count }}
          <Icon icon="mdi-information" class="mx-2" />
          {{ result.open_issues_count }}
          <Icon icon="mdi-code-tags" class="mx-2" /> {{ result.language }}
        </div>
      </VCard>
    </VCard>
    <VCard class="w-1/3" p-12 color="success">
      <VTextField
        type="text"
        v-model="pypi"
        @keyup.enter="searchPypi()"
        prepend-inner-icon="mdi-language-python"
        label="Pypi Search"
      ></VTextField>
      <VCard sh p-2 my-2 v-for="result in packages">
        <strong> {{ result.name }}=={{ result.version }} </strong>
        <p>{{ result.description }}</p>
        <VBtn
          link
          color="success"
          class="ml-2 rf"
          icon
          @click="addtoRequirements(result.name, result.version)"
        >
          <VIcon>mdi-file-plus</VIcon>
        </VBtn>
      </VCard>
    </VCard>
  </VContainer>
</template>