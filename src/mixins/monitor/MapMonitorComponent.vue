<template>
  <div>
    <!-- 按钮信息 -->
    <div class="notification-block">
      <div class="button" v-on:click="showAlarm = !showAlarm">
        <img src="@/assets/img/notification.svg" />
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="summary-wrap" v-bind:class="{ avoidNav: avoidNav }">
      <SummaryBlock
        v-for="(summary, index) in monitorSummaryList"
        v-bind:key="index"
        :title="summary.title"
        :total="summary.total"
        :warn_count="summary.warn_count"
        :error_count="summary.error_count"
        :normal_count="summary.normal_count"
        :deviceBattery="summary.deviceBattery"
        :deviceSignal="summary.deviceSignal"
        :deviceElectricity="summary.deviceElectricity"
      />
    </div>

    <!-- 下面的查询列表 -->
    <div
      :class="[
        'search-list',
        showMore ? 'morelists' : '',
        avoidNav && !isFullScreen ? 'avoidNav' : '',
      ]"
    >
      <el-form
        :model="formData"
        :inline="true"
        class="search-form"
        label-width="80px"
      >
        <el-form-item label="关键字">
          <el-input
            width="200px"
            v-model="formData.keyword"
            placeholder="模糊查询"
          ></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="formData.rangeTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <div class="search-item">
          <el-button type="primary" @click="onSearch">查询</el-button>
        </div>
      </el-form>

      <el-tabs
        v-model="activeTab"
        type="border-card"
        class="lists"
        @tab-click="setActiveTab"
      >
        <el-tab-pane
          v-for="item in tabData"
          :key="item.distinguish"
          :label="deviceType_toStr(item.distinguish)"
          :name="item.distinguish"
        >
          <div v-if="item.distinguish === 'DEVICE_JX'">
            <div class="ls-content">
              <el-card
                v-for="item in searchList"
                :key="item.uuid"
                shadow="always"
                class="item-card"
                @click.native="handleClickDevice(item)"
              >
                <el-descriptions
                  :title="`${item.name}(${item.code})`"
                  :column="2"
                >
                  <el-descriptions-item label="信号强度">{{
                    item.signalStrength
                  }}</el-descriptions-item>
                  <el-descriptions-item label="电池电压值">{{
                    item.battery
                  }}</el-descriptions-item>
                  <el-descriptions-item label="浓度">{{
                    item.density
                  }}</el-descriptions-item>
                  <el-descriptions-item label="温度">{{
                    item.temperature
                  }}</el-descriptions-item>
                  <el-descriptions-item label="液位状态">{{
                    item.liquidLevel === 0 ? "正常" : "超限"
                  }}</el-descriptions-item>
                  <el-descriptions-item label="门禁状态">{{
                    item.entranceGuard === 0 ? "正常" : "异常"
                  }}</el-descriptions-item>
                  <el-descriptions-item label="进气压力">{{
                    item.intakeMpa
                  }}</el-descriptions-item>
                  <el-descriptions-item label="出气压力">{{
                    item.ventMpa
                  }}</el-descriptions-item>
                  <el-descriptions-item label="最后上传时间">{{
                    item.uploadTime
                  }}</el-descriptions-item>
                </el-descriptions>
              </el-card>
            </div>
            <div class="loading-card" v-if="loadingShow">
              <img class="loading" src="@/assets/img/loading.gif" />
            </div>
          </div>
          <div v-else>暂无数据！</div>
        </el-tab-pane>
      </el-tabs>

      <!-- 收起按钮-->
      <div class="expand-button" v-on:click="showMore = !showMore">
        <img
          class="expand"
          v-bind:class="{ show: !showMore }"
          src="@/assets/img/nav_expand.svg"
        />
        <img
          class="closed"
          v-bind:class="{ show: showMore }"
          src="@/assets/img/nav_hide.svg"
        />
      </div>
    </div>

    <!-- 右侧报警列表 -->
    <div
      :class="[
        'alarm-list',
        alarmMore ? 'more-list' : '',
        showAlarm ? 'show' : 'hide',
      ]"
    >
      <div class="list-title">
        <span>报警列表</span>
        <el-button
          :type="allVoice === 'ALARM_VOICE_TRUE' ? 'danger' : 'warning'"
          class="voice-btn"
          size="small"
          @click.stop="setAllVoice()"
        >
          {{ allVoice === "ALARM_VOICE_TRUE" ? "全部消音" : "全部报警" }}
        </el-button>
      </div>

      <div class="lists">
        <div v-if="alarmList.length" class="ls-content">
          <el-card
            v-for="item in alarmList"
            :key="item.uuid"
            shadow="always"
            class="item-card"
            @click.native="handleClickAlarm(item)"
          >
            <el-descriptions :title="`${item.name}(${item.count})`" :column="2">
              <template slot="extra">
                <el-button
                  :type="
                    item.voice === 'ALARM_VOICE_TRUE' ? 'danger' : 'warning'
                  "
                  size="small"
                  @click.stop="setVoice(item)"
                >
                  {{ item.voice === "ALARM_VOICE_TRUE" ? "消音" : "取消静音" }}
                </el-button>
                <el-button size="small" @click.stop="solveItem(item)">
                  处理
                </el-button>
              </template>
              <el-descriptions-item label="code" :span="2">{{
                item.code
              }}</el-descriptions-item>
              <el-descriptions-item label="浓度（井下）" :span="2">{{
                item.density
              }}</el-descriptions-item>
              <el-descriptions-item label="报警码" :span="2">{{
                solveAlarmCode(item.alarmCode)
              }}</el-descriptions-item>
              <el-descriptions-item label="报警时间" :span="2">{{
                solveTime(item.alarmTime) || ""
              }}</el-descriptions-item>
            </el-descriptions>
          </el-card>
        </div>
        <div v-else>暂无数据！</div>
      </div>

      <!-- 收起按钮-->
      <div class="expand-left-button" v-on:click="alarmMore = !alarmMore">
        <img
          class="expand"
          v-bind:class="{ show: alarmMore }"
          src="@/assets/img/nav_expand.svg"
        />
        <img
          class="closed"
          v-bind:class="{ show: !alarmMore }"
          src="@/assets/img/nav_hide.svg"
        />
      </div>

      <!-- 定位 -->
      <div class="position">
        <img
          class="positon-icon"
          src="@/assets/img/location.png"
          @click.stop="resetPositon"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script>
import calculateDevices from "@/mixins/monitor/calcMonitorDevices";
import updateDeviceSignOnMap from "@/mixins/monitor/updateMonitorDeviceSignOnMap"; // 更新地图上的点
import summaryMixin from "@/mixins/monitor/monitorSummary";
import summary from "@/components/Summary.vue";
import { deviceType_toStr, alarmCode2type } from "@/utils/tool";
import { mapActions } from "vuex";
import {
  getDeviceJXList,
  getDevAlarmList,
  setVoiceStatus,
  JXDeviceDetail,
  getDeviceInfos,
  getLeftSupportDevice,
} from "@/api/apiHandler";

export default {
  name: "MapNewComponent.vue",
  components: {
    SummaryBlock: summary,
  },
  props: {
    avoidNav: Boolean,
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll, true);
  },
  data() {
    return {
      curNavType: PageTypeEnum.DOWNHOLE,
      navRouter: {},
      deviceSearchList: [],
      showMore: false, // true is close , false is open
      tabData: [],
      activeTab: "",
      activeAlarmTab: "",
      enterpriseUuid: "",
      showAlarm: true,
      formData: {
        distinguish: "DEVICE_ALL",
        enterpriseUuid: "",
        pageNum: 1,
        pageSize: 5,
        keyword: "",
        startTime: "",
        endTime: "",
      },
      alarmForm: {
        enterpriseUuid: "",
        distinguish: "DEVICE_ALL",
      },
      searchList: [],
      alarmList: [],
      searchLists: [],
      totalPage: 1,
      loadingShow: false,
      searchLoading: false,
      alarmMore: false,
      isSetVoice: false,
      allVoice: "ALARM_VOICE_TRUE",
    };
  },
  created: async function () {
    this.$store.commit("setNotificationTab", this.curNavType);
    this.formData.enterpriseUuid = this.$store.state.user.enterpriseUuid; // 获取请求必备参数
    this.alarmForm.enterpriseUuid = this.$store.state.user.enterpriseUuid; // 获取请求必备参数
  },
  mounted: async function () {
    window.addEventListener("scroll", this.handleScroll, true);
  },
  watch: {
    "$route.query.type": {
      immediate: true,
      handler(val) {
        console.log(val);
        if (this.$route.query.type) {
          this.formData.distinguish = this.$route.query.type;
          this.alarmForm.distinguish = this.$route.query.type;
        }
        getLeftSupportDevice({
          enterpriseUuid: this.$store.state.user.enterpriseUuid,
        }).then((res) => {
          const { code, data } = res;
          if (code == "200") {
            if (this.formData.distinguish === "DEVICE_ALL") {
              this.tabData = data;
              this.activeTab = data[0].distinguish;
              this.activeAlarmTab = data[0].distinguish;
            } else {
              const _tabData = [];
              for (const item of data) {
                if (item.distinguish === this.formData.distinguish) {
                  _tabData.push(item);
                }
              }
              this.tabData = _tabData;
              this.activeTab = _tabData[0]?.distinguish;
              this.activeAlarmTab = _tabData[0]?.distinguish;
            }
            if (
              ["DEVICE_ALL", "DEVICE_JX"].indexOf(this.formData.distinguish) >
              -1
            ) {
              this.onSearch(); // 先执行一次查询
            }
            this.getDevAlarmList();
          }
        });
      },
    },
    curNavType() {
      this.$store.commit("setNotificationTab", this.curNavType);
    },
    getShowRoutes(val) {
      this.curNavType = val[0].name.slice(0, 2);
    },
    showMore(val) {
      if (val) {
        this.formData.pageSize = 15;
        if (this.alarmMore) {
          this.alarmMore = false;
        }
      } else {
        this.formData.pageSize = 5;
      }
      this.formData.pageNum = 1;
      this.onSearch();
    },
    alarmMore(val) {
      if (val && this.showMore) {
        this.showMore = false;
      }
    },
    tabData(val) {
      if (val && val.length) {
        getDeviceInfos({
          distinguish: this.formData.distinguish,
          enterpriseUuid: this.formData.enterpriseUuid,
        }).then((res) => {
          const { code, data } = res;
          if (code == "200") {
            this.setSummryList(data);
          }
        });
      }
    },
    alarmList(val) {
      this.setWarnMuteList(val);
    },
    allVoice(val) {
      for (const item of this.alarmList) {
        item.voice = val;
      }
      this.alarmList = [...this.alarmList];
    },
  },
  computed: {
    getShowRoutes() {
      return this.$store.getters["getShowRoutes"].filter(
        (item) => item.name !== "监控中心" && this.isShowRoute(item.type)
      );
    },
    notificationTab() {
      return this.$store.state.device.notificationTab;
    },
    monitorSummaryList() {
      return [].concat(this.summaryList).filter((item) => !!item.title);
    },
    allDevices() {
      return [...this.devices, ...this.downHoleDevices, ...this.mileageDevices];
    },
  },
  mixins: [calculateDevices, updateDeviceSignOnMap, summaryMixin],
  methods: {
    ...mapActions({
      refreshWarnList: "notification/refreshWarnList",
      refreshFaultList: "notification/refreshFaultList",
      refreshMonitorWarnFaultList: "notification/refreshMonitorWarnFaultList",
    }),
    solveTime(str) {
      const date = new Date(str);
      return date.toLocaleDateString();
    },
    solveAlarmCode(code) {
      if (code && code.length) {
        const codeArr = code.split(',');
        const alarmArr = [];
        for (const item of codeArr) {
          const alarmType = alarmCode2type(item);
          if (alarmType) {
            alarmArr.push(alarmType)
          }
        }
        return alarmArr.join(',')
      }
      return ""
    },
    setActiveTab(value) {
      const { paneName } = value;
      this.activeTab = paneName;
    },
    setActiveAlarmTab(value) {
      const { paneName } = value;
      this.activeAlarmTab = paneName;
    },
    deviceType_toStr(type) {
      return deviceType_toStr(type);
    },
    resetPositon() {
      const map = this.getMap();
      const userData = this.$store.state.user.data;
      const { lon, lat } = userData;
      var point = new BMapGL.Point(Number(lon), Number(lat));
      map.centerAndZoom(point, 16);
    },
    // 滚动操作
    handleScroll(e) {
      let dom = document.querySelector(".lists");
      //文档内容实际高度（包括超出视窗的溢出部分）
      let scrollHeight = Math.max(dom.scrollHeight, dom.scrollHeight);
      //滚动条滚动距离
      let scrollTop = e.target.scrollTop;
      //窗口可视范围高度
      let clientHeight =
        dom.innerHeight || Math.min(dom.clientHeight, dom.clientHeight);
      if (clientHeight + scrollTop >= scrollHeight) {
        this.searchMore();
      }
    },
    handleClickDevice(item) {
      const map = this.getMap();
      const { lon, lat } = item;
      if (lon && lat) {
        var point = new BMapGL.Point(Number(lon), Number(lat));
        map.centerAndZoom(point, 20);
      } else {
        this.$store.dispatch("toast/showToast", {
          message: "当前设备暂时无法定位！",
        });
      }
    },
    handleClickAlarm(item) {
      const map = this.getMap();
      const { lon, lat } = item;
      if (lon && lat) {
        var point = new BMapGL.Point(Number(lon), Number(lat));
        map.centerAndZoom(point, 20);
      } else {
        this.$store.dispatch("toast/showToast", {
          message: "当前报警暂时无法定位！",
        });
      }
    },
    getDevAlarmList: async function () {
      const res = await getDevAlarmList({
        ...this.alarmForm,
      });
      if (res && res.code === 200) {
        this.alarmList = res.data;
      }
    },
    onSearch: async function () {
      this.searchLoading = true;
      this.formData.pageNum = 1;
      if (this.formData.rangeTime && this.formData.rangeTime.length > 1) {
        this.formData.startTime = this.formData.rangeTime[0];
        this.formData.endTime = this.formData.rangeTime[1];
        delete this.formData.rangeTime;
      }
      const res = await getDeviceJXList({
        ...this.formData,
      });
      if (res && res.code === 200) {
        this.searchList = res.data;
        this.totalPage = res.totalPage;
      }
      this.searchLoading = false;
    },
    searchMore: async function () {
      this.loadingShow = true;

      if (this.formData.pageNum < this.totalPage) {
        this.formData.pageNum++;

        // 时间处理
        if (this.formData.rangeTime && this.formData.rangeTime.length > 1) {
          this.formData.startTime = this.formData.rangeTime[0];
          this.formData.endTime = this.formData.rangeTime[1];
          delete this.formData.rangeTime;
        }

        const res = await getDeviceJXList({
          ...this.formData,
        });
        if (res && res.code === 200) {
          this.searchList = this.searchList.concat(res.data);
          this.formData.pageNum = res.pageNum;
        }
      }

      this.loadingShow = false;
    },
    setVoice(item) {
      let { uuid, voice = "ALARM_VOICE_FALSE" } = item;
      if (voice === "ALARM_VOICE_TRUE") {
        voice = "ALARM_VOICE_FALSE";
      } else {
        voice = "ALARM_VOICE_TRUE";
      }
      item.voice = voice;
      this.alarmList = [...this.alarmList];
      setVoiceStatus({
        enterpriseUuid: this.formData.enterpriseUuid,
        uuid,
        voiceStatus: voice,
      });
    },
    setWarnMuteList(lists) {
      const muteList = [];
      for (const item of lists) {
        if (item && item.voice === "ALARM_VOICE_TRUE") {
          muteList.push(item);
        }
      }
      this.$store.commit("notification/muteWarnList", muteList);
    },
    async solveItem(item) {
      // statusType用于兼容开路设备
      const { status = "报警", statusType = ERROR } = item;
      this.$store.commit("notification/setIndexAlarm", item);
      let resInfo = null;
      if (status === "报警" || statusType === ERROR) {
        // 拿到设备详情
        resInfo = await JXDeviceDetail({ uuid: item.uuid });
      }
      if (resInfo.code === 200) {
        this.$vModal({
          info: resInfo.data,
          type: ModalActionEnum.ALERT,
        });
      }
    },
    setAllVoice() {
      if (this.allVoice === "ALARM_VOICE_TRUE") {
        this.allVoice = "ALARM_VOICE_FALSE";
      } else {
        this.allVoice = "ALARM_VOICE_TRUE";
      }
    },
    createFilter(queryString) {
      return (deviceList) => {
        console.log({
          queryString,
          deviceList,
        });
        return (
          deviceList.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    getPaneLabel(name) {
      const { monitorData } = this.$store.state.notification;
      const map = {
        井下: `无线(${
          monitorData.downHoleFault.length + monitorData.downHoleWarn.length
        })`,
        车载: `${name}(${monitorData.chezainum})`,
        开路: `${name}(${monitorData.kailunum})`,
        手持: `${name}(${monitorData.shouchinum})`,
        里程: `${name}(${
          monitorData.mileageFault.length + monitorData.mileageWarn.length
        })`,
      };
      return map[name] || name;
    },
    isShowRoute(type) {
      return this.monitorShowRoute.includes(type);
    },
    async refreshNaviDom() {
      console.log("refreshNaviDom");
    },
    async handleClick() {
      this.$store.commit("setNotificationTab", this.curNavType);
      if (this.curNavType === PageTypeEnum.DOWNHOLE) {
        this.refreshWarnList().then();
        this.refreshFaultList().then();
      } else {
        this.refreshMonitorWarnFaultList().then();
      }
    },
  },
};
</script>

<style scoped lang="less">
@import "../../styles/common";

.notification-block {
  pointer-events: visible;
  position: absolute;
  z-index: 24;

  top: @padding;
  right: @padding;

  .button {
    cursor: pointer;
    width: @navButtonSize;
    height: @navButtonSize;
    border-radius: 50%;
    background-color: white;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    img {
      width: 0.24rem;
      height: 0.24rem;
      object-position: center;
      object-fit: contain;
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
        color: #f98631;
      }

      &:hover {
        color: #f98631;
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
    .el-tab-pane {
      gap: 8px;
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
      width: fit-content;
      grid-template-columns: repeat(5, 1fr);
      grid-template-rows: repeat(1, 1fr);
      grid-column-gap: 0.2rem;
      grid-row-gap: 0.2rem;
      transition: all 0.5s;
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

  .summary-wrap {
    padding: @padding;
    display: grid;
    width: fit-content;
    grid-template-columns: repeat(5, 1fr);
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

.el-popper[x-placement^="bottom"] {
  z-index: 99999999 !important;
}

.search-list {
  z-index: 9;
  width: 4.2rem;
  height: 64vh;
  color: white;
  background: #222a3644;
  border-radius: 0.16rem 0.16rem 0.16rem 0.16rem;
  position: relative;
  left: 25px;
  font-size: 0.2rem;
  padding: 0.3rem 0.22rem;
  transition: width 1s ease-in-out, transform 0.5s ease-in-out;

  &.morelists {
    width: 8.5rem;
  }

  &.avoidNav {
    transform: translateX(240px);
  }

  .search-form {
    position: relative;
    width: 6rem;
    .search-item {
      position: absolute;
      top: 0;
      right: 230px;
    }
  }

  ::v-deep {
    .el-form--inline .el-form-item__label {
      color: #58f;
    }

    .el-descriptions__header {
      margin-bottom: 10px;
    }
    .el-card__body,
    .el-main {
      padding: 10px;
    }
    .el-tabs--border-card {
      background-color: transparent;
      border: none;
    }
    .el-card__body {
      background: #222a3644;
      border: none;
      .el-descriptions__title {
        color: #fff;
      }
      .el-descriptions__body {
        background-color: transparent;
        .el-descriptions__table .el-descriptions-item__cell {
          color: #fff;
        }
      }
    }
  }

  .lists {
    margin-top: 10px;
    height: 50vh;
    overflow-x: hidden;
    overflow-y: auto;
    border-radius: 10px;

    .ls-content {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      gap: 8px;
      height: auto;
      .item-card {
        cursor: pointer;
        width: 4rem;
        height: 2.2rem;
        background-color: transparent;
        border: none;
      }
    }
    .loading-card {
      width: 100%;
      height: auto;
      text-align: center;
      .loading {
        width: 20px;
        height: 20px;
        margin: 10px auto;
      }
    }
  }

  .expand-button {
    cursor: pointer;
    width: 0.4rem;
    height: 0.4rem;
    border-radius: 50%;
    background-color: rgba(42, 54, 1, 0.7);
    margin-right: -0.2rem;
    box-shadow: 0 0 3px rgba(255, 255, 255, 0.8);
    z-index: 10;
    position: absolute;
    right: 0;
    top: 50%;
    margin-top: -0.2rem;
    display: flex;

    .show {
      display: block;
    }

    img {
      display: none;
    }

    &:hover {
      background-color: rgba(42, 54, 68, 0.5);
      box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
    }
  }
}

.alarm-list {
  z-index: 9;
  width: 4.2rem;
  height: 64vh;
  color: white;
  background: #222a3644;
  border-radius: 0.16rem 0.16rem 0.16rem 0.16rem;
  position: absolute;
  right: 25px;
  top: 200px;
  font-size: 0.2rem;
  padding: 0.3rem 0.22rem;
  transition: width 1s ease-in-out, transform 0.5s ease-in-out,
    right 0.5s ease-in-out;

  &.more-list {
    width: 8.5rem;
  }

  &.hide {
    right: -5rem;
  }

  ::v-deep {
    .el-tabs--border-card {
      background-color: transparent;
      border: none;
    }
    .el-card {
      border: none;
      background-color: transparent;
      .el-card__body {
        height: 100%;
        border: none;
        background: #222a3644;
        .el-descriptions__title {
          color: #fff;
        }
        .el-descriptions__body {
          background-color: transparent;
          .el-descriptions__table .el-descriptions-item__cell {
            color: #fff;
          }
        }
      }
    }
  }

  .list-title {
    width: 100%;
    height: 28px;
    line-height: 28px;
    padding: 8px;
    font-size: 24px;
    font-weight: bolder;
    color: #f23a5f;
    position: relative;
    .voice-btn {
      position: absolute;
      right: 40px;
      top: 10px;
    }
  }

  .lists {
    margin-top: 10px;
    height: 58vh;
    overflow-x: hidden;
    overflow-y: auto;
    border-radius: 10px;

    .ls-content {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      gap: 8px;
      height: auto;
      padding-left: 8px;
      .item-card {
        width: 4rem;
        height: 2rem;
      }
    }
  }

  .expand-left-button {
    cursor: pointer;
    width: 0.4rem;
    height: 0.4rem;
    border-radius: 50%;
    background-color: rgba(42, 54, 1, 0.7);
    margin-left: -0.2rem;
    box-shadow: 0 0 3px rgba(255, 255, 255, 0.8);
    z-index: 10;
    position: absolute;
    left: 0;
    top: 50%;
    margin-top: -0.2rem;
    display: flex;

    .show {
      display: block;
    }

    img {
      display: none;
    }

    &:hover {
      background-color: rgba(42, 54, 68, 0.5);
      box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
    }
  }
}

.position {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  position: fixed;
  bottom: 36px;
  right: 171px;
  background: #222a3644;
  display: flex;
  justify-content: center;
  align-items: center;
  .positon-icon {
    width: 18px;
    height: 18px;
  }
}
</style>
