<template>
  <transition name="msgbotransitionx-fade">
    <template v-if="visible">
      <modal-fault
        :faultItem="info"
        @processConfirm="processConfirm"
        @closeDialog="closeDialog"
        v-if="faultModalShow"
      ></modal-fault>

      <!-- 报警处理对话框 -->
      <modal-alert
        :faultItem="info"
        @processConfirm="processConfirm"
        @closeDialog="closeDialog"
        @solveItem="solveItem"
        v-if="alertModalShow"
      ></modal-alert>

      <!-- 地图设备详情对话框 -->
      <modal-device-detail
        :faultItem="deviceDetailInfo"
        @processConfirm="processConfirm"
        @closeDialog="closeDialog"
        v-if="deviceDetailShow"
      ></modal-device-detail>

      <open-type-alert
        :faultItem="info"
        @processConfirm="processConfirm"
        @closeDialog="closeDialog"
        v-if="alertOpenTypeModalShow"
      ></open-type-alert>
      <open-type-fault
        :faultItem="info"
        @processConfirm="processConfirm"
        @closeDialog="closeDialog"
        v-if="faultOpenTypeModalShow"
      ></open-type-fault>
      <open-type-normal
        :faultItem="info"
        @processConfirm="processConfirm"
        @closeDialog="closeDialog"
        v-if="normalOpenTypeModalShow"
      ></open-type-normal>
      <hand-type-alert
        :faultItem="info"
        @processConfirm="processConfirm"
        @closeDialog="closeDialog"
        v-if="alertHandTypeModalShow"
      ></hand-type-alert>
      <hand-type-fault
        :faultItem="info"
        @processConfirm="processConfirm"
        @closeDialog="closeDialog"
        v-if="faultHandTypeModalShow"
      ></hand-type-fault>

      <update-pwd
        @processConfirm="processConfirm"
        @closeDialog="closeDialog"
        v-if="updatePwdModalShow"
      >
      </update-pwd>

      <handle-open-device-info
        @processConfirm="processConfirm"
        @closeDialog="closeDialog"
        :device-info="info"
        :modal-type="type"
        v-if="openDeviceModalShow"
      >
      </handle-open-device-info>

      <handle-downhole-device-info
        @processConfirm="processConfirm"
        @closeDialog="closeDialog"
        :device-info="info"
        :modal-type="type"
        v-if="jingxiaDeviceModalShow"
      >
      </handle-downhole-device-info>

      <handle-millage-device-info
        @processConfirm="processConfirm"
        @closeDialog="closeDialog"
        :device-info="info"
        :modal-type="type"
        v-if="millageDeviceModalShow"
      >
      </handle-millage-device-info>
      <ling-pai
        @processConfirm="processConfirm"
        @closeDialog="closeDialog"
        :userInfo="info"
        v-if="lingPaiModalShow"
      ></ling-pai>
    </template>
  </transition>
</template>
<script>
import ModalFault from "./Fault.vue";
import ModalAlert from "./Alert.vue";
import { mapActions } from "vuex";
import OpenTypeAlert from "@/components/modals/modalComponents/OpenTypeAlert.vue";
import OpenTypeFault from "@/components/modals/modalComponents/OpenTypeFault.vue";
import OpenTypeNormal from "@/components/modals/modalComponents/OpenTypeNormal.vue";
import HandTypeAlert from "@/components/modals/modalComponents/HandTypeAlert.vue";
import HandTypeFault from "@/components/modals/modalComponents/HandTypeFault.vue";
import UpdatePwd from "@/components/modals/modalComponents/updatePwd.vue";
import lingPai from "@/components/modals/modalComponents/lingPai.vue";
import handleOpenDeviceInfo from "@/components/modals/modalComponents/handleOpenDeviceInfo.vue";
import handleMillageDeviceInfo from "@/components/modals/modalComponents/handleMillageDeviceInfo.vue";
import handleDownholeDeviceInfo from "@/components/modals/modalComponents/handleDownholeDeviceInfo.vue";
import deviceDetail from "@/components/modals/modalComponents/deviceDetail.vue";
import {
  handleJXAlarm,
  handleJXAlarmAll,
  fetchDeviceDetail,
} from "@/api/apiHandler";
import EventBus from "@/utils/eventBus";

export default {
  name: "VectorInfoModal",
  components: {
    lingPai,
    handleOpenDeviceInfo,
    handleDownholeDeviceInfo,
    handleMillageDeviceInfo,
    ModalFault,
    ModalAlert,
    OpenTypeAlert,
    OpenTypeFault,
    OpenTypeNormal,
    UpdatePwd,
    HandTypeAlert,
    HandTypeFault,
    ModalDeviceDetail: deviceDetail,
  },
  computed: {
    // 故障查询详情弹窗
    faultModalShow() {
      return this.type === ModalActionEnum.FAULT;
    },
    // 报警查询详情弹窗
    alertModalShow() {
      return this.type === ModalActionEnum.ALERT;
    },
    // 报警查询详情弹窗
    alertOpenTypeModalShow() {
      return this.type === ModalActionEnum.OPEN_ALERT;
    },
    faultOpenTypeModalShow() {
      return this.type === ModalActionEnum.OPEN_FAULT;
    },
    normalOpenTypeModalShow() {
      return this.type === ModalActionEnum.OPEN_NORMAL;
    },
    // 报警查询详情弹窗
    alertHandTypeModalShow() {
      return this.type === ModalActionEnum.HAND_ALERT;
    },
    faultHandTypeModalShow() {
      return this.type === ModalActionEnum.HAND_FAULT;
    },
    updatePwdModalShow() {
      return this.type === ModalActionEnum.UPDATE_PWD;
    },
    openDeviceModalShow() {
      return [
        ModalActionEnum.ADD_DEVICE_KAILU,
        ModalActionEnum.UPDATE_DEVICE_KAILU,
      ].includes(this.type);
    },
    millageDeviceModalShow() {
      return [
        ModalActionEnum.ADD_DEVICE_MILEAGE,
        ModalActionEnum.UPDATE_DEVICE_MILEAGE,
      ].includes(this.type);
    },
    jingxiaDeviceModalShow() {
      return [
        ModalActionEnum.ADD_DEVICE_JINGXIA,
        ModalActionEnum.UPDATE_DEVICE_JINGXIA,
      ].includes(this.type);
    },
    lingPaiModalShow() {
      return this.type === ModalActionEnum.LING_PAI;
    },
    deviceDetailShow() {
      return this.type === ModalActionEnum.DEVICE_DETAIL;
    },
  },
  created() {},
  data() {
    return {
      visible: false,
      info: {},
      deviceDetailInfo: {},
      type: ModalActionEnum.FAULT,
    };
  },
  watch: {
    info(val) {
      if (val && val.uuid) {
        fetchDeviceDetail({
          uuid: val.uuid,
        }).then((res) => {
          const { code, data } = res;
          if (code == "200") {
            this.deviceDetailInfo = {
              ...data,
            };
          }
        });
      }
    },
  },
  methods: {
    ...mapActions({
      handleAlertWarn: "handleAlertWarn",
      hideModal: "hideModal",
    }),
    closeDialog() {
      this.visible = false;
      this.$store.commit("notification/setIndexAlarm", null);
    },
    // 确认处理
    processConfirm(data) {
      if (!data) {
        console.error("传递处理人错误");
        return;
      }
      const { implementer, type, id } = data;
      const statusTypeMap = {
        [ModalActionEnum.FAULT]: "故障",
        [ModalActionEnum.ALERT]: "报警",
        [ModalActionEnum.OPEN_FAULT]: "故障",
        [ModalActionEnum.OPEN_ALERT]: "报警",
        [ModalActionEnum.HAND_FAULT]: "故障",
        [ModalActionEnum.HAND_ALERT]: "报警",
      };
      const params = {
        resolveName: implementer,
        type: this.filterType[0],
        id,
        statusType: statusTypeMap[type],
      };
      if (statusTypeMap[type] === "报警") {
        delete data.type;
        handleJXAlarmAll({
          uuid: data.uuid,
        }).then((res) => {
          if (res.code == "200") {
            this.toast("处理成功！");
            EventBus.$emit("refreshPage", {});
          }
        });
      } else {
        this.handleAlertWarn(params);
      }
      this.closeDialog();
    },
    solveItem() {
      const item = this.$store.state.notification.indexSolveAlarm;
      if (item) {
        handleJXAlarm({
          uuid: item.uuid,
        }).then((res) => {
          if (res.code == "200") {
            this.toast("处理成功！");
            EventBus.$emit("refreshPage", {});
          }
        });
      }
    },
  },
};
</script>

<style scoped></style>
