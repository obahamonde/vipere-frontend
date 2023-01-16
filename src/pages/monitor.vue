<script setup lang="ts">
const { dispatch, http, state } = useStore()
const i = ref<number>(0);
const dashboardData = ref<object[]>([]);
const url = computed(() => state.microservices[i.value].function_url);
const name = computed(() => state.microservices[i.value].name);
const getDahboardData = async () => {
  const response = await http.get("/monitor/?url=" + url.value);
  dashboardData.value = response
};
onMounted(async () => {
  await getDahboardData();
});

const nextChart = () => {
  i.value = i.value + 1;
  if (i.value > state.microservices.length - 1) {
    i.value = 0;
  }
  getDahboardData();
};


const groupByMethodandCount = computed(() => {
  if (dashboardData.value){
  const result = dashboardData.value.reduce((acc: any, item: any) => {
    const key = item.method;
    if (!acc[key]) {
      acc[key] = 0;
    }
    acc[key]++;
    return acc;
  }, {});
  return result;
};
});

const groupByStatusandCount = computed(() => {
  if(dashboardData.value){
  const result = dashboardData.value.reduce((acc: any, item: any) => {
    const key = item.status_code;
    if (!acc[key]) {
      acc[key] = 0;
    }
    acc[key]++;
    return acc;
  }, {});
  return result;
}
});

const topUrlsCount = computed(() => {
  if (dashboardData.value){
  const result = dashboardData.value.reduce((acc: any, item: any) => {
    const key = item.url;
    if (!acc[key]) {
      acc[key] = 0;
    }
    acc[key]++;
    return acc;
  }, {});
  return result;
}
});

const topUrlsCountData = computed(() => {
  const result = topUrlsCount.value;
  const topUrls = Object.keys(result).sort((a, b) => result[b] - result[a]).slice(0, 5);
  const topUrlsCountData = topUrls.map((url: any) => {
    return {
      name: url.split("aws")[1],
      value: result[url]
    }
  });
  return topUrlsCountData;
});

const topStatusCountData = computed(() => {
  const result = groupByStatusandCount.value;
  const topStatus = Object.keys(result).sort((a, b) => result[b] - result[a]).slice(0, 5);
  const topStatusCountData = topStatus.map((status: any) => {
    return {
      name: status,
      value: result[status]
    }
  });
  return topStatusCountData;
});

const topMethodsCountData = computed(() => {
  const result = groupByMethodandCount.value
  const topMethods = Object.keys(result).sort((a, b) => result[b] - result[a]).slice(0, 5);
  const topMethodsCountData = topMethods.map((method: any) => {
    return {
      name: method,
      value: result[method]
    }
  });
  return topMethodsCountData;
});

watchEffect(() => {
  dispatch({
    monitoring: {
      topUrls: topUrlsCountData.value,
      topStatus: topStatusCountData.value,
      topMethods: topMethodsCountData.value
    }
  })
})

</script>
<template><section p-32 gap-8>
    
  <Icon @click="nextChart" icon="mdi-arrow-right" x2 text-black top-0 right-0 absolute z-50 mt-24 m-4 cp scale
    v-if="i < state.microservices.length - 1"
  />
  
  <h1 text-lg font-script m-4>{{ name }} function</h1>
  <a :href="url" text-sm font-script m-4>{{ url }}</a>
  <div>  
  <BarChart />
    <LineChart />
    <PieChart />
  </div>
  </section>
</template>