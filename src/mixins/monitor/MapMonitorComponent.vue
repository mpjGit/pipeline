<template>
  <div>
    <div class="nav-tab" id="notiNavTab">
      <div
          v-if="isShowRoute(item.type)"
          v-for="item in getShowRoutes"
          :key="item.name"
          @click="() => { curNavType = item.type.slice(0, 2) }"
          :class="['nav-tab-item', {'nav-tab-item-active': curNavType === item.type.slice(0, 2)}]"
      >{{ getPaneLabel(item.type.slice(0, 2)) }}
      </div>
    </div>


    <!-- 通知信息 -->
    <NewNotificationBlock
        v-if="notificationTab !== PageTypeEnum.DOWNHOLE && notificationTab !== PageTypeEnum.MILEAGE"
        class="notification-container"
        :inFullScreen="isFullScreen"
        :type="filterType"
        ref="sonsson">
    </NewNotificationBlock>

    <down-hole-notification-block
        v-else
        class="notification-container"
        :inFullScreen="isFullScreen"
        :type="filterType"
    />

    <!-- 通知信息提示 -->

    <!-- 统计信息 -->
    <div class="summary-wrap" v-bind:class="{avoidNav: avoidNav}">
      <SummaryBlock
        v-for="(summary, index) in monitorSummaryList"
        v-bind:key="index"
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
import calculateDevices from "@/mixins/monitor/calcMonitorDevices";
import updateDeviceSignOnMap from "@/mixins/monitor/updateMonitorDeviceSignOnMap";
import NewNotificationBlock from "@/components/map/NewNotificationBlock.vue";
import DownHoleNotificationBlock from "@/components/NotificationBlock.vue";
import summaryMixin from "@/mixins/monitor/monitorSummary";
import summary from "@/components/Summary.vue";
import {mapActions} from "vuex";

export default {
  name: "MapNewComponent.vue",
  components: {
    SummaryBlock: summary, NewNotificationBlock, DownHoleNotificationBlock,
  },
  props: {
    avoidNav: Boolean,
  },
  beforeDestroy() {
  },
  data() {
    return {
      curNavType: PageTypeEnum.DOWNHOLE,
      navRouter: {},
      searchedDevice: '',
      deviceSearchList: [],
    }
  },
  created() {
    this.$store.commit('setNotificationTab', this.curNavType);
  },
  mounted: function () {
  },
  watch: {
    curNavType() {
      this.$store.commit('setNotificationTab', this.curNavType);
    },
    getShowRoutes(val) {
      this.curNavType = val[0].name.slice(0, 2);
    },
  },
  computed: {
    getShowRoutes() {
      return this.$store.getters['getShowRoutes'].filter((item) => item.name !== '监控中心');
    },
    notificationTab() {
      return this.$store.state.device.notificationTab;
    },
    monitorSummaryList() {
      return [].concat(this.downHoleSummaryList).concat(this.summaryList).filter(item => item.total !== 0);
    },
    allDevices() {
      return [...this.devices, ...this.downHoleDevices, ...this.mileageDevices];
    },
  },
  mixins: [calculateDevices, updateDeviceSignOnMap, summaryMixin],
  methods: {
    ...mapActions({
      'refreshWarnList': 'notification/refreshWarnList',
      'refreshFaultList': 'notification/refreshFaultList',
      'refreshMonitorWarnFaultList': 'notification/refreshMonitorWarnFaultList',
    }),
    handleSelect(item) {
      this.searchedDevice = item.name;
      const [longitude, latitude] = item.position;
      let map = this.getMap();
      var point = new BMapGL.Point(Number(longitude), Number(latitude));
      map.centerAndZoom(point, 14);
      setTimeout(() => {
        map.centerAndZoom(point, 20);
      }, 1500)
      map.enableScrollWheelZoom(true);
    },
    handleIconClick() {
      this.searchedDevice = '';
    },
    createFilter(queryString) {
      return (deviceList) => {
        console.log({
          queryString,
          deviceList,
        })
        return (deviceList.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    querySearch(queryString, cb) {
      const deviceList = this.allDevices.map((item) => item);
      const results = queryString ? deviceList.filter(this.createFilter(queryString)) : deviceList;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    getPaneLabel(name) {
      const {monitorData} = this.$store.state.notification;
      const map = {
        '井下': `无线(${monitorData.downHoleFault.length + monitorData.downHoleWarn.length})`,
        '车载': `${name}(${monitorData.chezainum})`,
        '开路': `${name}(${monitorData.kailunum})`,
        '手持': `${name}(${monitorData.shouchinum})`,
        '里程': `${name}(${monitorData.mileageFault.length + monitorData.mileageWarn.length})`,
      };
      return map[name] || name;
    },
    isShowRoute(type) {
      return this.monitorShowRoute.includes(type);
    },
    async refreshNaviDom() {
      console.log('refreshNaviDom');
    },
    async handleClick() {
      this.$store.commit('setNotificationTab', this.curNavType);
      if (this.curNavType === PageTypeEnum.DOWNHOLE) {
        this.refreshWarnList().then();
        this.refreshFaultList().then();
      } else {
        this.refreshMonitorWarnFaultList().then();
      }
    },
  }
}
</script>

<style scoped lang="less">

@import "../../styles/common";



.my-autocomplete {

  background: #aeb7b740;
  li {
    line-height: normal;
    padding: 7px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .addr {
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}

.nav-tab {
  z-index: 22;
  position: absolute;
  font-size: 14px;
  top: 0.9rem;
  right: 0.3rem;
  transition: right 0.5s ease-in-out;
  background-color: rgba(42, 54, 68, 0.3);
  color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  height: 70px;
  padding-top: 10px;
  padding-bottom: 10px;

  .nav-tab-item {
    font-weight: bold;
    font-size: 14px;
    height: 57px;
    width: 57px;
    background: rgba(42, 54, 68, 0.3);
    border-radius: 50%;
    margin-right: 10px;
    margin-left: 0;
    display: flex;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    white-space: nowrap;

    &:first-of-type {
      margin-left: 10px;
    }

    &-active {
      color: #ffaa6c;
    }

    &:hover {
      color: #ffaa6c;
    }
  }

  ::v-deep {
    .el-tabs__item {
      padding: 5px !important;
      height: 70px;
      width: 70px;
      display: flex;
      align-items: center;
      border-radius: 50px;
    }

    .el-tabs--border-card > .el-tabs__header .el-tabs__item {
      &.is-active {
        color: #F98631;
      }


      &:hover {
        color: #F98631;
      }

    }

    .el-tabs {
      border-radius: 15px;
    }

    .el-tabs__content {
      display: none;
    }

    .el-tabs__nav-scroll {
      border-radius: 15px;
    }

    .el-tabs__header {
      border-radius: 15px;
    }

    .el-tabs__nav {
    }
  }
}

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
    grid-template-columns: repeat(4, 1fr);
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
