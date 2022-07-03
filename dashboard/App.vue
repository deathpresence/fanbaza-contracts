<template>
  <div style="width: 1200px; height: 800px;">
    <div style="display: flex; justify-content: center">

    </div>
    <LineChart v-bind="lineChartProps" />
  </div>
</template>

<script lang='ts'>
import { computed, defineComponent, onMounted, ref } from "vue";
import { LineChart, useLineChart } from "vue-chart-3";
import { Chart, ChartData, ChartOptions, registerables } from "chart.js";
import { ethers } from "ethers"
import VestingWallet from "../artifacts/contracts/VestingWallet.sol/VestingWallet.json"

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/")

Chart.register(...registerables);
export default defineComponent({
  name: "App",
  components: { LineChart },
  setup() {
    const dataValues = ref([]);
    const dataLabels = ref([]);
    const toggleLegend = ref(true);
    onMounted(async () => {
      const vestingWallet = new ethers.Contract("0xCafac3dD18aC6c6e92c921884f9E4176737C052c", VestingWallet.abi, provider)
      const start = await vestingWallet.start()
      const cliff = await vestingWallet.cliff()
      const reserves = await vestingWallet.reserves()
      console.log("reserves", reserves.toString())

      dataLabels.value = cliff.map((item, index) => {
        return new Date((start.toNumber() + (2628288 * (index + 1))) * 1000).toLocaleDateString()
      });

      let acc = ethers.BigNumber.from(0)

      dataValues.value = cliff.map((item) => {
        const res = reserves.div("10000").mul(item)
        acc = acc.add(res)
        console.log(res.toString())
        return ethers.utils.formatEther(acc)
      })

      console.log(dataValues.value)

    })



    const testData = computed<ChartData<"line">>(() => ({
      labels: dataLabels.value,
      datasets: [
        {
          data: dataValues.value,
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
          type: "linear",
          position: toggleLegend.value ? "left" : "right",
        },
      },
      plugins: {
        legend: {
          position: toggleLegend.value ? "top" : "bottom",
        },
        title: {
          display: true,
          text: "Vesting chart",
        },
      },
    }));

    const { lineChartProps, lineChartRef } = useLineChart({
      chartData: testData,
      height: 500,
      options,
    });


    function switchLegend() {
      toggleLegend.value = !toggleLegend.value;
    }

    return {
      switchLegend,
      testData,
      options,
      lineChartRef,
      lineChartProps,
    };
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
