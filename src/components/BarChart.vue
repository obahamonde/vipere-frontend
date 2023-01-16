<template>
    <div >
      <BarChart v-bind="barChartProps" />
    </div>
</template>
  
  <script setup lang='ts'>
  import {  BarChart, useBarChart } from "vue-chart-3";
  import { Chart, ChartData, ChartOptions, registerables } from "chart.js";
  
  onBeforeMount(() => {
    Chart.register(...registerables);
  });

  const { state } = useStore();

  const dataLabels = computed(() => {
    return state.monitoring.topStatus.map((url) => url.name);
  });

  const dataValues = computed(() => {
    return state.monitoring.topStatus.map((url) => url.value);
  });

      const toggleLegend = ref(true);
  
      const testData = computed<ChartData<"bar">>(() => ({
          labels: dataLabels.value,
          datasets: [
            {
              data: dataValues.value,
              backgroundColor: [
                "#77CEFF",
                "#ff0000",
                "#ffff00",
              ],
            },
          ]
          }));

      const options = computed<ChartOptions<"bar">>(() => ({
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
            text: "Request by Status Code",
          },
        },
      }));
       
      const { barChartProps } = useBarChart({
        chartData:testData,
        options: {
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
              text: "Request by Status Code",
            },
          },
        },

      });
  </script>