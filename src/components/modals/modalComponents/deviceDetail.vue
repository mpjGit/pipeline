<template>
  <!-- 故障记录详情 -->
  <Modal class="record-container" :on-close-trigger="closeDialog">
    <template v-slot:header>
      <div class="header-content">
        <h3>详细信息</h3>
      </div>
    </template>
    <template v-slot:body>
      <div class="grid-value-group">
        <ValueGroupCompact name="企业名称" :value="faultItem.enterpriseName" />
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
        <ValueGroupCompact name="信号强度" :value="faultItem.signalStrength" />
        <ValueGroupCompact name="池电压值" :value="faultItem.battery" />
        <ValueGroupCompact name="最后上传时间" :value="faultItem.uploadTime" />
        <ValueGroupCompact name="电池电压" :value="faultItem.battery" />
        <ValueGroupCompact name="温度" :value="`${faultItem.temperature}℃`" />
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
    };
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
