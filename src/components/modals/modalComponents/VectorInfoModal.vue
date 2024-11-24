<template>
  <transition name="msgbotransitionx-fade">
    <template v-if="visible">
      <modal-fault :faultItem="info" @processConfirm="processConfirm" @closeDialog="closeDialog"
                   v-if="faultModalShow"></modal-fault>
      <modal-alert :faultItem="info" @processConfirm="processConfirm" @closeDialog="closeDialog"
                   v-if="alertModalShow"></modal-alert>
      <open-type-alert :faultItem="info" @processConfirm="processConfirm" @closeDialog="closeDialog"
                       v-if="alertOpenTypeModalShow"
      ></open-type-alert>
      <open-type-fault :faultItem="info" @processConfirm="processConfirm" @closeDialog="closeDialog"
                       v-if="faultOpenTypeModalShow"
      ></open-type-fault>
      <open-type-normal :faultItem="info" @processConfirm="processConfirm" @closeDialog="closeDialog"
                        v-if="normalOpenTypeModalShow"
      ></open-type-normal>
      <hand-type-alert :faultItem="info" @processConfirm="processConfirm" @closeDialog="closeDialog"
                       v-if="alertHandTypeModalShow"
      ></hand-type-alert>
      <hand-type-fault :faultItem="info" @processConfirm="processConfirm" @closeDialog="closeDialog"
                       v-if="faultHandTypeModalShow"
      ></hand-type-fault>

      <update-pwd @processConfirm="processConfirm" @closeDialog="closeDialog"
                  v-if="updatePwdModalShow">

      </update-pwd>

      <handle-open-device-info @processConfirm="processConfirm" @closeDialog="closeDialog"
                               :device-info="info"
                               :modal-type="type"
                               v-if="openDeviceModalShow">
      </handle-open-device-info>


      <handle-downhole-device-info @processConfirm="processConfirm" @closeDialog="closeDialog"
                                   :device-info="info"
                                   :modal-type="type"
                                   v-if="jingxiaDeviceModalShow">
      </handle-downhole-device-info>

      <handle-millage-device-info @processConfirm="processConfirm" @closeDialog="closeDialog"
                                  :device-info="info"
                                  :modal-type="type"
                                  v-if="millageDeviceModalShow">

      </handle-millage-device-info>
      <ling-pai @processConfirm="processConfirm" @closeDialog="closeDialog"
                :userInfo="info"
                v-if="lingPaiModalShow"></ling-pai>

    </template>
  </transition>
</template>
<script>
import ModalFault from './Fault.vue';
import ModalAlert from './Alert.vue';
import OpenTypeAlert from "@/components/modals/modalComponents/OpenTypeAlert.vue";
import OpenTypeFault from "@/components/modals/modalComponents/OpenTypeFault.vue";
import OpenTypeNormal from "@/components/modals/modalComponents/OpenTypeNormal.vue";
import HandTypeAlert from "@/components/modals/modalComponents/HandTypeAlert.vue";
import HandTypeFault from "@/components/modals/modalComponents/HandTypeFault.vue";
import UpdatePwd from "@/components/modals/modalComponents/updatePwd.vue";
import {mapActions} from "vuex";
import lingPai from "@/components/modals/modalComponents/lingPai.vue";
import handleOpenDeviceInfo from "@/components/modals/modalComponents/handleOpenDeviceInfo.vue";
import handleMillageDeviceInfo from "@/components/modals/modalComponents/handleMillageDeviceInfo.vue";
import handleDownholeDeviceInfo from "@/components/modals/modalComponents/handleDownholeDeviceInfo.vue";

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
      return [ModalActionEnum.ADD_DEVICE_KAILU, ModalActionEnum.UPDATE_DEVICE_KAILU].includes(this.type);
    },
    millageDeviceModalShow() {
      return [ModalActionEnum.ADD_DEVICE_MILEAGE, ModalActionEnum.UPDATE_DEVICE_MILEAGE].includes(this.type);
    },
    jingxiaDeviceModalShow() {
      return [ModalActionEnum.ADD_DEVICE_JINGXIA, ModalActionEnum.UPDATE_DEVICE_JINGXIA].includes(this.type);
    },
    lingPaiModalShow() {
      return this.type === ModalActionEnum.LING_PAI;
    },
  },
  created() {
  },
  data() {
    return {
      visible: false,
      info: {},
      type: ModalActionEnum.FAULT,
    }
  },
  methods: {
    ...mapActions({
      'handleAlertWarn': "handleAlertWarn",
      'hideModal': 'hideModal',
    }),
    closeDialog() {
      this.visible = false;
    },
    processConfirm(data) {
      if (!data) {
        console.error('传递处理人错误')
        return;
      }
      console.log('processConfirm', data);
      const {implementer, type, id} = data;
      const statusTypeMap = {
        [ModalActionEnum.FAULT]: '故障',
        [ModalActionEnum.ALERT]: '报警',
        [ModalActionEnum.OPEN_FAULT]: '故障',
        [ModalActionEnum.OPEN_ALERT]: '报警',
        [ModalActionEnum.HAND_FAULT]: '故障',
        [ModalActionEnum.HAND_ALERT]: '报警',
      }
      const params = {
        resolveName: implementer,
        type: this.filterType[0],
        id,
        statusType: statusTypeMap[type],
      }
      this.handleAlertWarn(params);
      this.closeDialog();
    },
  },
}
</script>

<style scoped>

</style>
