<template>
    <div>
      <DoughnutChart v-bind="doughnutChartProps" />
    </div>
  </template>
  
  <script setup lang='ts'>
  import { DoughnutChart, useDoughnutChart } from "vue-chart-3";
  import { Chart, ChartData, ChartOptions, registerables } from "chart.js";
  
  const { state } = useStore();

  Chart.register(...registerables);
      const dataValues = computed(() => {
        return state.monitoring.topMethods.map((url) => url.value);
      });
      const dataLabels = computed(() => {
        return state.monitoring.topMethods.map((url) => url.name);
      });
      const toggleLegend = ref(true);
  
      const testData = computed<ChartData<"doughnut">>(() => ({
        labels: dataLabels.value,
        datasets: [
          {
            data: dataValues.value,
            backgroundColor: [
              "#77CEFF",
              "#0079AF",
              "#123E6B",
            ],
          },
        ],
      }));
  
      const options = computed<ChartOptions<"doughnut">>(() => ({
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
            text: "Requests by Method",
          },
        },
      }));
  
      const { doughnutChartProps } = useDoughnutChart({
        chartData: testData,
        options,
      });
  </script>