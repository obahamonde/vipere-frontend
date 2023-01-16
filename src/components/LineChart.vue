<template>
    <div>
      <LineChart v-bind="lineChartProps" />
    </div>
  </template>
  
  <script setup lang='ts'>
  import {  LineChart, useLineChart } from "vue-chart-3";
  import { Chart, ChartData, ChartOptions, registerables } from "chart.js";
  const { state } = useStore();
  const labels = computed(() => {
    return state.monitoring.topUrls.map((url) => url.name);
  });

  const values = computed(() => {
    return state.monitoring.topUrls.map((url) => url.value);
  });


  watchEffect(() => {
    console.log("labels", labels.value);
    console.log("values", values.value);
  });

  Chart.register(...registerables);const toggleLegend = ref(true);
  
      const testData = computed<ChartData<"line">>(() => ({
        labels: labels.value,
        datasets: [
          {
            data: values.value,
            backgroundColor: [
              "#77CEFF",
              "#0079AF",
              "#123E6B",
              "#97B0C4",
              "#A5C8ED",
            ],
          },
        ],
      }));
  
      const options = computed<ChartOptions<"line">>(() => ({
        scales: {
          myScale: {
            type: "logarithmic",
            position: toggleLegend.value ? "left" : "right",
          },
        },
        plugins: {
          legend: {
            position: toggleLegend.value ? "top" : "bottom",
          },
          title: {
            display: true,
            text: "Top Urls",
          },
        },
      }));
  
      const { lineChartProps } = useLineChart({
        chartData: testData,
        options,
      });
</script>