<template>
  <!-- 故障记录详情、故障记录处理  -->
  <Modal
      class="fault-detail-modal"
      :on-close-trigger="closeDialog"
  >
    <template v-slot:header>
      <h3>故障记录</h3>
    </template>
    <template v-slot:body>
      <div class="grid">
        <ValueGroup v-if="!faultItem.resolve" name="操作员" :value="username" type="select"
                    :options="[{name: username}]" v-on:change="onImplementerChange"/>
        <ValueGroup v-else-if="faultItem.showOperateName !== false" name="操作员" :value="faultItem.openImplementer"/>
        <ValueGroup class="area-device-name" name="设备名称" :value="faultItem.nickname"/>
        <ValueGroup class="area-ch4" name="浓度" :value="faultItem.ch4"/>
        <ValueGroup class="area-reason" name="故障内容" :value="faultItem.fault" type="textarea"/>
        <ValueGroup name="事件时间" :value="faultItem.time"/>
      </div>
    </template>
    <template v-slot:footer v-if="faultItem && !faultItem.resolve">
      <div class="button-wrap">
        <div class="button prefer" v-on:click="processAlert">
          <span>处理</span>
        </div>
      </div>
    </template>
  </Modal>

</template>

<script>
import Modal from "@/components/modals/modalComponents/Modal";
import ValueGroup from "@/components/ValueGroup";
import {mapActions} from "vuex";

export default {
  name: "modal-fault",
  components: {ValueGroup, Modal},
  props: {
    faultItem: {
      type: Object,
      default: () => {
      },
    },
  },
  data: function () {
    return {
      selectImplementer: null
    }
  },
  methods: {
    ...mapActions({
      'showModal': 'showModal',
      'hideModal': 'hideModal',
    }),

    onImplementerChange: function ({value}) {
      this.selectImplementer = value;
    },

    closeDialog() {
      this.$emit('closeDialog');
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
          this.$emit('processConfirm',
              {
                id: this.faultItem.id,
                implementer: this.selectImplementer,
                type: ModalActionEnum.FAULT,
              });
          this.hideModal();
        },
        onCancel: () => {
          this.hideModal();
        }
      })
    },

  },
}
</script>

<style scoped lang="less">
@import "../../../styles/common";

.fault-detail-modal {
  .grid {
    display: grid;
    grid-template-areas:
          'a b b'
          'c c c'
          'd e e';
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, auto);
    grid-column-gap: 0.2rem;

    .area-address {
      grid-area: e;
    }

    .area-device-name {
      grid-area: b;
    }

    .area-reason {
      grid-area: c;
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
