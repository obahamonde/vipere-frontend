import { MaybeComputedRef } from "@vueuse/core";
import { defineStore, acceptHMRUpdate } from "pinia";
import { DataStore, CodeFile, Project, MicroService, Issue } from "../types";

class Http {
  baseURL: string;
  constructor() {
    this.baseURL = "https://api.smartpro.solutions/api";
  }
  async get(
    url: MaybeComputedRef<string>,
    params?: MaybeComputedRef<RequestInit>
  ) {
    const { data } = await useFetch(`${this.baseURL}${url}`, {
      method: "GET",
      ...params,
    }).json();
    return unref(data);
  }
  async post(
    url: MaybeComputedRef<string>,
    params?: MaybeComputedRef<RequestInit>
  ) {
    const { data } = await useFetch(`${this.baseURL}${url}`, {
      method: "POST",
      ...params,
    }).json();
    return unref(data);
  }
  async put(
    url: MaybeComputedRef<string>,
    params?: MaybeComputedRef<RequestInit>
  ) {
    const { data } = await useFetch(`${this.baseURL}${url}`, {
      method: "PUT",
      ...params,
    }).json();
    return unref(data);
  }
  async delete(
    url: MaybeComputedRef<string>,
    params?: MaybeComputedRef<RequestInit>
  ) {
    const { data } = await useFetch(`${this.baseURL}${url}`, {
      method: "DELETE",
      ...params,
    }).json();
    return unref(data);
  }
  async text(
    url: MaybeComputedRef<string>,
    params?: MaybeComputedRef<RequestInit>
  ) {
    const { data } = await useFetch(`${this.baseURL}${url}`, {
      method: "GET",
      ...params,
    }).text();
    return unref(data);
  }
  async blob(
    url: MaybeComputedRef<string>,
    params?: MaybeComputedRef<RequestInit>
  ) {
    const { data } = await useFetch(`${this.baseURL}${url}`, {
      method: "GET",
      ...params,
    }).blob();
    return unref(data);
  }
}

export const useStore = defineStore("store", () => {
  const state = reactive<{
    user: any;
    codefiles: CodeFile[];
    datastores: DataStore[];
    projects: Project[];
    microservices: MicroService[];
    issues: Issue[];
    completion: string;
  }>({
    user: null,
    codefiles: [] as CodeFile[],
    datastores: [] as DataStore[],
    projects: [] as Project[],
    microservices: [] as MicroService[],
    issues: [] as Issue[],
    completion: "",
    logs:""
  });
  const dispatch = (payload: any) => {
    Object.assign(state, payload);
  };
  const http = new Http();
  return {
    state,
    dispatch,
    http,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot));
}
