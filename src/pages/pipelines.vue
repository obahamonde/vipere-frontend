<script setup lang="ts">

import { MicroService } from "../types";

const { state, http } = useStore();

const isFetching = ref(false);

const hover = ref(false);

const micro = reactive<MicroService>({
  name: "",
  runtime: "python3.8",
  code: state.codefiles,
  owner: state.user.sub,
})

const deployMicroService = async (micro: MicroService) => {
  isFetching.value = true;
  await http.post("/microservices/", {
    body: JSON.stringify({
      name: micro.name,
      runtime: micro.runtime,
      code: micro.code,
      owner: micro.owner,
    }),
  });
  await fetchMicroServices();
  isFetching.value = false;
};

const fetchMicroServices = async () => {
  isFetching.value = true;
  const data = await http.get("/microservices/" + state.user.sub);
  state.microservices = data;
  isFetching.value = false;
};

const deleteMicroService = async (id: string) => {
  isFetching.value = true;
  await http.delete("/microservices/" + id);
  await fetchMicroServices();
  isFetching.value = false;
};

watch(isFetching, (val) => {
  if (val) {
    console.log("Fetching...");
  }
});

onMounted(async () => {
  await fetchMicroServices();
});

</script>
<template>
  <div col center p-8>
    <h3 mx-auto text-md font-mono>Project Resources</h3>
    <section grid4 gap-4>
      <VCard
        v-for="item in state.codefiles"
        :key="item.id"
        class="m-4 w-auto p-4 col center sh"
        hover
      >
        <VCardTitle>
          <h1 class="text-lg">{{ item.name }}</h1>
        </VCardTitle>
        <VCardText>
          <p>{{ item.content?.length }} characters</p>
        </VCardText>
        <VBtn icon>
          <Icon :icon="item.icon" />
        </VBtn>
      </VCard>
      <VCard
        v-for="item in state.datastores"
        class="m-4 w-auto bg-gray-700 text-cyan-300 p-4 col center sh"
        hover
      >
        <VCardTitle>
          <h1 class="text-lg">{{ item.name }}</h1>
        </VCardTitle>
        <VCardText>
          <p>{{ item.image }}</p>
        </VCardText>
        <VBtn icon>
          <VIcon>mdi-database</VIcon>
        </VBtn>
      </VCard>
    </section>
    <VCard pa-4 m-4>
      <input
        type="text"
        v-model="micro.name"
        placeholder="Pipeline Name"
        class="bg-gray-700 text-cyan-300 border border-cyan-300 rounded p-2 m-4"
      />
      <VBtn color="primary" @click="deployMicroService(micro)"> Deploy </VBtn>
    </VCard>
    <div v-if="isFetching" class="col center">
      <VProgressCircular indeterminate color="primary" />
    </div>
    <div v-if="state.microservices" grid4> 
      <VCard
        v-for="item in state.microservices"
        class="m-4 w-auto bg-gray-700 text-cyan-300 p-4 col center gap-2 sh"
      >
        <VCardTitle>
          {{ item.name }}
        </VCardTitle>
        <Icon icon="mdi-delete" @click="deleteMicroService(item.id)"
          class="absolute top-0 right-0 m-2 cursor-pointer text-red-500 hover:text-red-700"
          @mouseover="hover = true"
          @mouseleave="hover = false"
          
          :style="{ opacity: hover ? 1 : 0 }"
          />
        <VCardText text-center>
          <p>{{ item.runtime }}</p>
          <Icon icon="logos:python" x2 mt-4 />
        </VCardText>
        <VBtn :href="item.function_url" target="_blank" color="primary">
          <VIcon>mdi-link</VIcon>
        </VBtn>
      </VCard>
    </div>
  </div>
</template>
