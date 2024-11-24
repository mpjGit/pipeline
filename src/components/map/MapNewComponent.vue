<template>
  <div>
    <!-- 通知信息 -->
    <NewNotificationBlock
        class="notification-container"
        :inFullScreen="isFullScreen"
        :type="filterType"
        ref="sonsson"/>
    <!-- 通知信息提示 -->
    <!-- 统计信息 -->
    <div class="summary-wrap" v-bind:class="{avoidNav: avoidNav}">
      <!-- 设备类型悬浮模块 -->
      <SummaryBlock
        v-for="(summary, index) in summaryList"
        :key="index"
        :title="summary.title"
        :total="summary.total"
        :warn_count="summary.warn_count"
        :error_count="summary.error_count"
        :normal_count="summary.normal_count"
      />
      <div class="search-container-auto-acc">
        <el-autocomplete
            popper-class="my-autocomplete"
            v-model="searchedDevice"
            :fetch-suggestions="querySearch"
            placeholder="查询设备名称"
            @select="handleSelect">
          <i
              class="el-icon-delete el-input__icon"
              style="cursor: pointer; color: #181818;"
              slot="suffix"
              @click="handleIconClick">
          </i>
          <template slot-scope="{ item }">
            <div class="name">设备名: {{ item.name }}</div>
            <span class="addr">{{ item.deviceType === 'downhole' ? '无线智能终端' : item.deviceType }}设备</span>
          </template>
        </el-autocomplete>
      </div>
    </div>
  </div>
</template>

<script>
import calculateDevices from "@/mixins/calcNewDevices";
import NewNotificationBlock from "@/components/map/NewNotificationBlock.vue";
import summaryMixin from "@/mixins/map/deviceSummary";
import summary from "@/components/Summary.vue";

export default {
  name: "MapNewComponent.vue",
  components: {SummaryBlock: summary, NewNotificationBlock},
  props: {
    avoidNav: Boolean,
  },
  beforeDestroy() {
  },
  mounted: function () {
  },
  mixins: [calculateDevices, summaryMixin],
  methods: {}
}
</script>

<style scoped lang="less">

@import "../../styles/common";

.map-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  &.fullscreen {
    .summary-wrap {
      padding-left: @padding !important;
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      grid-template-rows: repeat(2, 1fr);
    }
  }

  .fullscreen-logo {
    width: 3.24rem;
    height: auto;
    position: fixed;
    top: @padding;
    left: 50%;
    margin-left: calc(3.24rem / -2);
  }

  .notification-container {

  }

  .summary-wrap {
    padding: @padding;
    display: grid;
    width: fit-content;
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: 0.2rem;
    grid-row-gap: 0.2rem;
    transition: all 0.5s;

    &.avoidNav {
      padding-left: @navWidth + @padding;
    }
  }

}

#map {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: absolute;
}

</style>
