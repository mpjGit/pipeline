<template>

  <!-- 故障记录详情 -->
  <Modal
      class="record-container"
      :on-close-trigger="closeDialog"
  >
    <template v-slot:header>
      <div class="header-content">
        <h3>手动记录</h3>
      </div>
    </template>
    <template v-slot:body>
      <div class="grid-value-group">
        <ValueGroupCompact v-if="!faultItem.resolve" name="操作员" :value="username" type="select"
                    :options="[{name: username}]" v-on:change="onImplementerChange"/>
        <ValueGroupCompact name="操作人员" :value="faultItem.updateBy"/>
        <ValueGroupCompact name="经纬度"
                           :value="`(${Number(faultItem.lat).toFixed(2)},${Number(faultItem.lon).toFixed(2)})`"/>
        <ValueGroupCompact name="浓度" :value="faultItem.density"/>
        <ValueGroupCompact name="信号强度" :value="faultItem.signalStrength"/>
        <ValueGroupCompact name="电池电压" :value="faultItem.battery"/>
        <ValueGroupCompact name="最后上传时间" :value="faultItem.uploadTime"/>
        <ValueGroupCompact name="电池电压" :value="faultItem.battery"/>
        <!-- <ValueGroupCompact name="光强" :value="faultItem.lightIntensity"/>
        <ValueGroupCompact name="设备类型" :value="faultItem.type"/> -->
<!--        <ValueGroupCompact name="事件时间" :value="faultItem.time"/>-->
        <ValueGroupCompact name="温度" :value="`${faultItem.temperature}℃`"/>
        <ValueGroupCompact name="液位状态" :value="`${faultItem.liquidLevel === 1 ? '超限' : '正常'}`"/>
        <ValueGroupCompact name="门禁状态" :value="`${faultItem.entranceGuard === 1 ? '异常' : '正常'}`"/>
        <ValueGroupCompact v-if="isCarPage" name="车速" :value="faultItem.nospeed"/>
        <!-- <ValueGroupCompact name="设备名称" :value="faultItem.deviceName"/> -->
        <ValueGroupCompact name="备注" :value="faultItem.remarks"/>
        <ValueGroupCompact class="area-start-time" name="创建时间" :value="faultItem.createAt"/>
        <ValueGroupCompact class="area-end-time" name="修改时间" :value="faultItem.updateAt"/>
      </div>
      <v-image :url="faultItem.screenshot"></v-image>
      <v-image v-for="item in faultItem.photo" :key="item" :url="item"></v-image>
    </template>
        <template v-slot:footer v-if="faultItem && !faultItem.resolve">
          <div class="button-wrap">
            <div class="button prefer" v-on:click="processAlert">处理</div>
          </div>
        </template>
  </Modal>

</template>

<script>
import Modal from "@/components/modals/modalComponents/Modal";
import ValueGroupCompact from "@/components/modals/modalComponents/valueGroupCompact.vue";
import {mapActions} from "vuex";
import fault from "@/components/modals/modalComponents/Fault.vue";

export default {
  name: "modal-alert",
  components: {ValueGroupCompact, Modal},
  props: {
    faultItem: {
      type: Object,
      default: () => {
      },
    },
  },
  data: function () {
    return {
      selectImplementer: '',
      currentRemarks: ''
    }
  },
  computed: {

  },
  methods: {
    fault() {
      return fault
    },
    ...mapActions({
      'showModal': 'showModal',
      'hideModal': 'hideModal',
    }),
    onImplementerChange: function ({value}) {
      this.selectImplementer = value;
    },

    onRemarksChange: function ({value}) {
      this.currentRemarks = value;
    },

    closeDialog: function () {
      this.$emit('closeDialog');
    },

    showVideo: function () {
      this.play(this.faultItem.video);
    },

    // 处理报警
    processAlert: function () {
      if (!this.selectImplementer) {
        alert('请选择操作人员！');
        return false;
      }

      this.showModal({
        message: '是否确定已处理?',
        onConfirm: () => {
          this.$emit('processConfirm', {
            ...this.faultItem,
            updateBy: this.$store.state.user.userId,
            remarks: this.currentRemarks,
            type: ModalActionEnum.ALERT,
          })
          this.hideModal();
        },
        onCancel: () => {
          this.hideModal();
        }
      })
    }
  },
}

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
      padding-right: @padding/2;
      padding-left: @padding/2;
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
    padding: @padding*3/4;
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
          content: ':';
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
