<template>
  <!-- 故障记录详情 -->
  <Modal class="record-container" :on-close-trigger="closeDialog">
    <template v-slot:header>
      <div class="header-content">
        <h3>设备详情</h3>
      </div>
    </template>
    <template v-slot:body>
      <el-tabs
        v-model="activeTab"
        type="border-card"
        class="lists"
        @tab-click="setActiveTab"
      >
        <el-tab-pane label="详细信息" name="detail">
          <div class="grid-value-group">
            <ValueGroupCompact
              name="企业名称"
              :value="faultItem.enterpriseName"
            />
            <ValueGroupCompact
              name="经纬度"
              :value="`(${Number(faultItem.lat).toFixed(2)},${Number(
                faultItem.lon
              ).toFixed(2)})`"
            />
            <ValueGroupCompact name="创建人" :value="faultItem.createBy" />
            <ValueGroupCompact name="修改人" :value="faultItem.updateBy" />
            <ValueGroupCompact name="IMEI" :value="faultItem.imei" />
            <ValueGroupCompact name="ICCID" :value="faultItem.iccid" />
            <ValueGroupCompact name="SINR" :value="faultItem.sinr" />
            <ValueGroupCompact name="RSRP" :value="faultItem.rsrp" />
            <ValueGroupCompact
              name="浓度"
              :value="`${faultItem.density}(${faultItem.densityL} ~ ${faultItem.densityH})`"
            />
            <ValueGroupCompact
              name="信号强度"
              :value="faultItem.signalStrength"
            />
            <ValueGroupCompact name="池电压值" :value="faultItem.battery" />
            <ValueGroupCompact
              name="最后上传时间"
              :value="faultItem.uploadTime"
            />
            <ValueGroupCompact name="电池电压" :value="faultItem.battery" />
            <ValueGroupCompact
              name="温度"
              :value="`${faultItem.temperature}℃`"
            />
            <ValueGroupCompact
              name="进气压力"
              :value="`${faultItem.intakeMpa}(${faultItem.intakeL} ~ ${faultItem.intakeH})`"
            />
            <ValueGroupCompact
              name="出气压力"
              :value="`${faultItem.ventMpa}(${faultItem.ventL} ~ ${faultItem.ventH})`"
            />
            <ValueGroupCompact
              name="采集周期（单位：分钟）"
              :value="faultItem.collectCycle"
            />
            <ValueGroupCompact
              name="上传周期（单位：分钟）"
              :value="faultItem.uploadCycle"
            />
            <ValueGroupCompact name="报警码" :value="faultItem.alarmCode" />
            <ValueGroupCompact
              name="是否发送历史记录"
              :value="faultItem.historyRecord == '0' ? '否' : '是'"
            />
            <ValueGroupCompact
              name="液位状态"
              :value="`${faultItem.liquidLevel === 1 ? '超限' : '正常'}`"
            />
            <ValueGroupCompact
              name="门禁状态"
              :value="`${faultItem.entranceGuard === 1 ? '异常' : '正常'}`"
            />
            <ValueGroupCompact
              v-if="isCarPage"
              name="车速"
              :value="faultItem.nospeed"
            />
            <!-- <ValueGroupCompact name="设备名称" :value="faultItem.deviceName"/> -->
            <ValueGroupCompact name="备注" :value="faultItem.remarks" />
            <ValueGroupCompact
              class="area-start-time"
              name="创建时间"
              :value="faultItem.createAt"
            />
            <ValueGroupCompact
              class="area-end-time"
              name="修改时间"
              :value="faultItem.updateAt"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="报警记录" name="alarm">
          <!-- 查询区域 -->
          <el-form :inline="true" :model="alarmForm" class="demo-form-inline">
            <el-form-item label="关键字">
              <el-input
                v-model="alarmForm.keyword"
                placeholder="关键字（模糊查询）"
              ></el-input>
            </el-form-item>
            <el-form-item label="报警处理记录">
              <el-select v-model="alarmForm.status" placeholder="活动区域">
                <el-option label="已处理" value="shanghai"></el-option>
                <el-option label="未处理" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="时间范围">
              <el-date-picker
                v-model="alarmForm.searchTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSearchAlarm">查询</el-button>
            </el-form-item>
          </el-form>
          <!-- 数据展示区域 -->
          <el-table :data="alarmData" style="width: 100%">
            <el-table-column
              v-for="item in alarmTableCol"
              :key="item.prop"
              :prop="item.prop"
              :label="item.label"
              :width="item.width"
              :formatter="(row, column, value) => {
                if (item.render) {
                  return item.render(row, value);
                } else {
                  return value;
                }
              }"
            >
            </el-table-column>
          </el-table>
          <el-pagination background layout="prev, pager, next" :total="alarmSearch.total" @current-change="pageNumChange($event, 'alarm')">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="警告记录" name="fault"> 暂无数据！ </el-tab-pane>
        <el-tab-pane label="历史记录" name="hist"> 暂无数据！ </el-tab-pane>
      </el-tabs>
    </template>
    <template v-slot:footer>
      <div class="button-wrap">
        <div class="button prefer" v-on:click="processAlert">关闭</div>
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/modals/modalComponents/Modal";
import ValueGroupCompact from "@/components/modals/modalComponents/valueGroupCompact.vue";
import { mapActions } from "vuex";
import fault from "@/components/modals/modalComponents/Fault.vue";
import { getDeviceAlarmList } from "@/api/apiHandler";
import { isNumber } from "lodash";

export default {
  name: "modal-device-detail",
  components: { ValueGroupCompact, Modal },
  props: {
    faultItem: {
      type: Object,
      default: () => {},
    },
  },
  data: function () {
    return {
      selectImplementer: "",
      currentRemarks: "",
      activeTab: "detail",
      enterpriseUuid: "",
      alarmSearch: {
        total: 20
      },
      alarmForm: {
        enterpriseUuid: "",
        keyword: "",
        status: "",
        searchTime: [],
        pageSize: 10,
        pageNum: 1,
      },
      alarmTableCol: [
        {
          prop: "deviceName",
          label: "设备名称",
          width: 180,
        },
        {
          prop: "enterpriseName",
          label: "企业名称",
          width: 180,
        },
        {
          prop: "status",
          label: "报警状态",
          width: 180,
          render(_, value) {
            if (!value) {
              return "";
            }
            switch (value) {
              case "DEVICE_STATUS_ZC":
                return "正常";
              case "DEVICE_STATUS_GZ":
                return "故障";
              case "DEVICE_STATUS_BJ":
                return "报警";
            }
          }
        },

        {
          prop: "createAt",
          label: "创建时间",
          width: 180,
        },
        {
          prop: "updateAt",
          label: "修改时间",
          width: 180,
        },
        {
          prop: "uploadTime",
          label: "最后上传时间",
          width: 180,
        },
        {
          prop: "updateBy",
          label: "操作人",
          width: 180,
        },
        {
          prop: "signalStrength",
          label: "信号强度",
          width: 180,
        },
        {
          prop: "battery",
          label: "电池电压值",
          width: 180,
        },
        {
          prop: "density",
          label: "浓度",
          width: 180,
          render(row, value) {
            return `${value}(${row.densityL} - ${row.densityH})`
          },
        },
        {
          prop: "temperature",
          label: "温度",
          width: 180,
        },
        {
          prop: "intakeMpa",
          label: "进气压力",
          width: 180,
        },
        {
          prop: "liquidLevel",
          label: "液位状态",
          width: 180,
          render(row, value) {
            if (isNumber(value)) {
              return value === 0 ? '正常' : '超限';
            }
          }
        },
        {
          prop: "entranceGuard",
          label: "门禁状态",
          width: 180,
          render(row, value) {
            if (isNumber(value)) {
              return value === 0 ? '正常' : '异常';
            }
          }
        },
      ],
      alarmData: [],
    };
  },
  created() {
    this.enterpriseUuid = this.$store.state.user.enterpriseUuid; // 获取请求必备参数
    this.alarmForm.enterpriseUuid = this.enterpriseUuid;
    this.onSearchAlarm();
  },
  computed: {},
  methods: {
    fault() {
      return fault;
    },
    ...mapActions({
      showModal: "showModal",
      hideModal: "hideModal",
    }),

    async onSearchAlarm() {
      const searchTime = this.alarmForm.searchTime;
      if (searchTime && searchTime.length > 1) {
        this.alarmForm.startTime = searchTime[0];
        this.alarmForm.endTime = searchTime[1];
      }

      const res = await getDeviceAlarmList({
        ...this.alarmForm,
      });
      const { code } = res;
      if (code == "200") {
        this.alarmData = res.data || [];
        res.total && (this.alarmSearch.total = res.total);
        res.pageNum && (this.alarmSearch.pageNum = res.pageNum);
      }
    },

    pageNumChange(pageNum, type) {
      switch (type) {
        case 'alarm':
          this.alarmForm.pageNum = pageNum;
          this.onSearchAlarm();
          break;
      }
    },

    onImplementerChange: function ({ value }) {
      this.selectImplementer = value;
    },

    onRemarksChange: function ({ value }) {
      this.currentRemarks = value;
    },

    closeDialog: function () {
      this.$emit("closeDialog");
    },

    // 处理报警
    processAlert: function () {
      this.$emit("closeDialog");
    },

    setActiveTab(value) {
      const { paneName } = value;
      this.activeTab = paneName;
    },
  },
};
</script>

<style scoped lang="less">
@import "../../../styles/common";

.app-location {
  grid-area: z;
}

.area-start-time {
  grid-area: e;
}
.area-end-time {
  grid-area: d;
}

.record-container {
  .header-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding-right: 1rem;

    .button {
      height: 0.44rem;
      width: auto;
      padding-right: @padding / 2;
      padding-left: @padding / 2;
      background-color: white;
      border-radius: 0.22rem;
      color: @blackColor;
      background-color: rgba(255, 135, 49, 1);
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-around;
      cursor: pointer;

      .icon {
        width: 0.2rem;
        margin-right: 0.05rem;
      }
    }
  }

  .field-list {
    background-color: rgba(245, 245, 245, 1);
    border-radius: 0.1rem;
    padding: @padding*3 / 4;
    box-sizing: border-box;
    display: grid;
    grid-template-columns: repeat(5, auto);
    grid-column-gap: 0.1rem;
    grid-row-gap: 0.2rem;

    .field-item {
      color: @blackColor;
      font-size: 0.14rem;

      .name {
        color: rgba(102, 102, 102, 1);

        &:after {
          content: ":";
        }
      }

      .value {
        color: @blackColor;
        font-weight: bold;
      }
    }
  }

  .button-wrap {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: @padding;
    .button;
  }
}
</style>
