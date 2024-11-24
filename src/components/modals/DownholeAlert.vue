<template>
  <!-- 报警记录详情、报警记录处理  -->
  <Modal
      :visible="alertDetailVisible"
      class="alert-detail-modal"
      :on-close-trigger="hideAlertRecordDetail"
  >
    <template v-slot:header>
      <h3>报警记录</h3>
    </template>
    <template v-slot:body>
      <div class="grid">
        <ValueGroup v-if="localRecordDetail.resolve"  name="操作员" :value="localRecordDetail.implementer" />
        <ValueGroup v-else name="操作员" :options="[{name: username }]" type="select" v-on:change="onImplementerChange" />
        <ValueGroup class="area-device-name"  name="设备名称" :value="localRecordDetail.name" />
        <ValueGroup name="浓度" v-if="localRecordDetail.concentrationFlag" :value="localRecordDetail.concentration" />
        <ValueGroup class="area-address" name="事件地址" :value="localRecordDetail.position" />
        <ValueGroup name="温度" v-if="localRecordDetail.temperatureFlag" :value="localRecordDetail.temperature + '℃'" />
        <ValueGroup name="进气口压强" v-if="isShowCurPress" :value="localRecordDetail.entrance_pressure + ' Kpa'" />
        <ValueGroup name="出气口压强" v-if="isShowCurPress" :value="localRecordDetail.exit_pressure + ' Kpa'" />
        <ValueGroup name="采集周期" :value="localRecordDetail.acquire + ' min'" />
        <ValueGroup name="上传周期" :value="formatTimeHours(localRecordDetail.update)" />
        <ValueGroup name="事件时间" :value=" localRecordDetail.time" />
        <ValueGroup name="报警内容" :value=" localRecordDetail.fault" />

        <ValueGroup name="电量" :value="localRecordDetail.power" />
        <ValueGroup name="液位" v-if="localRecordDetail.liqFlag" :value="!localRecordDetail.liq?'正常':'异常'" />
        <ValueGroup name="井盖" v-if="localRecordDetail.manholeFlag" :value="!localRecordDetail.manhole?'正常':'异常'" />
      </div>
    </template>
    <template v-slot:footer v-if="localRecordDetail && !localRecordDetail.resolve">
      <div class="button-wrap">
        <div class="button prefer" v-on:click="processAlert">
          <span>确定</span>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script>
import ValueGroup from "@/components/ValueGroup";
import {timeToString} from "@/utils/tool";
import Modal from "@/components/Modal";
import {mapActions} from "vuex";
export default {
  name: "DownholeAlert",
  components: {Modal, ValueGroup},
  data: function () {
    return {
      localRecordDetail: null,
      selectImplementer: null
    }
  },

  methods: {
    ...mapActions({
      'showModal': 'showModal',
      'hideModal': 'hideModal',
      'processRecord': 'downholeAlertList/processRecord'
    }),

    // 处理报警
    processAlert: function () {
      this.showModal({
        message: '是否确定已处理?',
        onConfirm: () => {
          this.processRecord({id: this.localRecordDetail.id, implementer: this.selectImplementer})
          this.hideModal();
        },
        onCancel: () => {
          this.hideModal();
        }
      })
    },

    hideAlertRecordDetail: function () {
      this.localRecordDetail = null;
    },

    onImplementerChange: function ({value}) {
      this.selectImplementer = value;
    },
  },

  watch: {
    recordDetail: function (cur) {
      if(cur === null) {
        this.localRecordDetail = null
      }else {
        this.localRecordDetail = {
          ...cur,
          time: timeToString(parseInt(cur.time))
        };
      }
    }
  },

  computed: {
    // 当前获取故障记录信息
    recordDetail: function () {
      return this.$store.state.downholeAlertList.recordDetail;
    },
    isShowCurPress() {
      console.log('this.localRecordDetail', this.localRecordDetail)
      return this.getPressShowByDeviceName(this.localRecordDetail?.deviceName);
    },
    alertDetailVisible: function () {
      return this.localRecordDetail != null;
    }
  }
}
</script>

<style scoped lang="less">
@import "../../styles/common";

.alert-detail-modal {

  .grid {
    display: grid;
    grid-template-areas:
          'a b b c'
          'd d d e'
          'f g h i'
          'j k l m';
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(4, 1fr);
    grid-column-gap: 0.2rem;
    .area-address {
      grid-area: d;
    }
    .area-device-name {
      grid-area: b;
    }
  }
  .button-wrap {
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: row;
    padding: 0 @padding @padding;
    .button;
  }
}
</style>
