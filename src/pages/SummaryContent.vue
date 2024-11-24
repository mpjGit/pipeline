<template>
  <!-- 统计信息 -->
  <div class="summary-wrap">
    <Summary
      v-for="summary in summaryList"
      :key="summary.title"
      :title="summary.title"
      :total="summary.total"
      :warn_count="summary.warn_count"
      :error_count="summary.error_count"
      :normal_count="summary.normal_count"
    />

  </div>
</template>

<script>
import Summary from "@/components/Summary";
import summaryMixin from "@/mixins/summary";
import calculateDevices from "@/mixins/caculteDevices";
export default {
  name: "SummaryContent",
  components: {Summary},
  mixins: [summaryMixin, calculateDevices]
}
</script>

<style scoped lang="less">
@import "../styles/summary";
</style>
