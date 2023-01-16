<script setup lang="ts">
import { Issue } from "../types";
const { state, http } = useStore();

const issue = ref<Issue>({
  title: "",
  description: "",
  completed: false,
});

const getTodos = async () => {
  const sub = state.user ? state.user.sub : "";
  const data = await http.get("/issues/");
  state.issues = data as Issue[];
};
const updateTodo = async (issue: Issue) => {
  await http.put(`/issues/?id=${issue.id}`, {
    body: JSON.stringify(issue),
  });
  await getTodos();
};

const deleteTodo = async (uid: string) => {
  await http.delete(`/issues/?id=${uid}`);
  await getTodos();
};

const addTodo = async (todo: Issue) => {
  await http.post("/issues/", {
    body: JSON.stringify(todo),
  });
  await getTodos();
};

onMounted(async () => {
  await getTodos();
});
</script>
<template>
  <VContainer v-if="state.issues.length > 0">
    <VContainer grid4 gap-4>
      <VCard v-for="todo in state.issues" :key="todo.id" pa-4>
        <VCheckboxBtn
          v-model="todo.completed"
          @update:model-value="updateTodo(todo)"
        />
        <span text-xs>{{ todo.completed ? 'Done!': 'Pending'   }}</span>
        <VCardTitle :class="{ completed: todo.completed }">{{
          todo.title
        }}</VCardTitle>
        <VCardText :class="{ completed: todo.completed }">{{
          todo.description
        }}</VCardText>
        <VBtn @click="deleteTodo(todo.id as string)" icon color="red">
          <VIcon>mdi-delete</VIcon>
        </VBtn>
      </VCard>
    </VContainer>
  </VContainer>
  <VContainer v-else>
    <VCard>
      <VCardTitle>No issues</VCardTitle>
    </VCard>
  </VContainer>

  <div m-4 mx-auto pa-4 col center w-96 rounded sh>
    <VCardTitle>New Issue</VCardTitle>
    <VTextField v-model="issue.title" label="Title" w-72 />
    <VTextarea
      v-model="issue.description"
      label="Description"
      w-72
      auto-grow
      rows="4"
      max-rows="8"
      @keydown.enter="addTodo(issue)"
    />
    <VCardActions>
      <VBtn
        @click="addTodo(issue)"
        :disabled="issue.title && issue.description ? false : true"
      >
        <VIcon>mdi-plus</VIcon>
      </VBtn>
    </VCardActions>
  </div>
</template>
<style scoped>
.completed {
  text-decoration: line-through;
}
</style>
