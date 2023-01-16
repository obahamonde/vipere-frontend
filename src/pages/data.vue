<script setup lang="ts">
import { DataStore } from "../types";
const { state, http } = useStore();

const isFetching = ref(false);

const datastore = ref<DataStore>({
  image: "",
  protocol: "tcp",
});
const logdata = ref("");
const hideLogs = ref(true);
const hideUri = ref(true);
const getDatastores = async () => {
  isFetching.value = true;
  state.datastores = await http.get("/datastores/?sub=" + state.user.sub);
  isFetching.value = false;
};

const createDatastore = async () => {
  isFetching.value = true;
  await http.post(
    "/datastores/" + datastore.value.image + "?sub=" + state.user.sub
  );
  await getDatastores();
  isFetching.value = false;
};

const deleteDatastore = async (name: string) => {
  await http.delete("/datastores/" + name);
  await getDatastores();
};

const getLogs = async (name: string) => {
  logdata.value = (await http.text("/datastores/logs/" + name)) as string;
};

onMounted(async () => {
  await getDatastores();
});

const copy = (text: string) => {
  navigator.clipboard.writeText(text);
};
</script>
<template>
  <VContainer col center>
    <VCard bg-gray-700 sh gap-4 m-8 pa-4 rounded width="500px" col center>
      <VCardTitle class="text-h5 text-cyan-300">Pick a DataStore</VCardTitle>
      <VRadioGroup v-model="datastore.image" row center>
        <VRadio label="Postgres" value="postgres">
          <template v-slot:label>
            <p text-cyan-300>
              Postgres
              <Icon icon="logos:postgresql" x4 />
            </p>
          </template>
        </VRadio>
        <VRadio label="MySQL" value="mysql">
          <template v-slot:label>
            <p col text-cyan-300>
              MySQL
              <Icon icon="logos:mysql-icon" x4 brightness-200 />
            </p>
          </template>
        </VRadio>
        <VRadio label="MongoDB" value="mongo">
          <template v-slot:label>
            <p text-cyan-300>
              MongoDB
              <Icon icon="vscode-icons:file-type-mongo" x4 />
            </p>
          </template>
        </VRadio>
      </VRadioGroup>
      <VBtn @click="createDatastore()" color="cyan" text-gray-900>Create</VBtn>
    </VCard>
    <div v-if="isFetching" class="col center p-4">
      <VProgressCircular x4 indeterminate color="primary" />
    </div>
    <section grid4>
      <div
        v-for="datastore in state.datastores"
        :key="datastore.name"
        bg-gray-700
        w-48
        m-4
        sh
        gap-2
        m-2
        p-4
        rounded
        width="300px"
        col
        center
        overflow-x-scroll
      >
        <Icon
          :class="datastore.image === 'mysql' ? 'brightness-200' : ''"
          :icon="
            datastore.image === 'postgres'
              ? 'logos:postgresql'
              : datastore.image === 'mysql'
              ? 'logos:mysql-icon'
              : 'vscode-icons:file-type-mongo'
          "
          x4
        />
        <p class="text-cyan-300">{{ datastore.name }}</p>
        <small class="text-cyan-300">Port: {{ datastore.host_port }}</small>
        <small class="text-cyan-300"
          >Uri: {{ hideUri ? "******" : datastore.database_uri }}
        </small>
        <h1 row gap-4>
          <Icon
            class="text-cyan-300 cp"
            @click="hideUri = !hideUri"
            icon="mdi:eye"
            x2
          />
          <Icon
            class="text-cyan-300 cp"
            @click="copy(datastore.database_uri as string)"
            icon="mdi:content-copy"
            x2
          />
        </h1>
        <VBtn
          color="error"
          @click="deleteDatastore(datastore.name as string)"
          text-gray-900
          >Delete</VBtn
        >
        <VBtn
          @click="getLogs(datastore.name as string)"
          color="cyan"
          text-gray-900
          >Logs</VBtn
        >
      </div>
    </section>

    <p
      font-mono
      bg-gray-500
      text-md
      sh
      px-4
      py-2
      rounded-t
      cp
      @click="hideLogs = !hideLogs"
    >
      {{ hideLogs ? "Show" : "Hide" }} Logs
    </p>
    <code
      class="p-4 text-xs w-256 text-lime-300 bg-black rounded overflow-x-scroll"
      v-if="!hideLogs"
      >{{
        logdata.length > 0 ? logdata : "No log data, select a source."
      }}</code
    >
  </VContainer>
</template>
<route lang="yaml">
meta:
  layout: studio
</route>
