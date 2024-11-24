<template>
  <!-- 单个记录 -->
  <transition name="fade">
    <Modal
        :on-close-trigger="closeDialog"
    >
      <template v-slot:header>
        <h2>历史记录详情</h2>
      </template>
      <template v-slot:body>
        <div class="form-wrap row">
          <div class="col-span-7">
            <div class="row">
              <ValueGroup
                  name="设备名称"
                  :value="faultItem.nickname"
              />
            </div>

            <div class="grid-left">
              <ValueGroup name="信号强度" :value="faultItem.signal" />
              <ValueGroup name="光照强度" :value="faultItem.light" />
              <ValueGroup name="低保警值" :value="currentUnit.transform(faultItem.lowAlert || faultItem.low_alert).value + currentUnit.text" />
              <ValueGroup name="浓度" :value="currentUnit.transform(faultItem.concentration).value + currentUnit.text" />
              <ValueGroup name="高报警值" :value="currentUnit.transform(faultItem.highAlert || faultItem.high_alert).value + currentUnit.text" />
              <!-- <ValueGroup name="进气口压强" :value="faultItem.entrance_pressure + ' Kpa'" />-->
            </div>

          </div>
          <div class="col-span-5">
            <div class="grid-right">
              <ValueGroup class="grid-a" name="状态" :value="faultItem.statusType" type="status"/>
              <ValueGroup class="grid-b" name="上传时间" :value="faultItem.time"/>
              <!--  <ValueGroup name="出气口压强" :value="faultItem.exit_pressure + ' Kpa'"/>-->
<!--              <ValueGroup name="电量" :value="faultItem.power"/>-->
            </div>
          </div>
        </div>
      </template>
    </Modal>
  </transition>
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
  mounted() {
    console.log('faultItem', this.faultItem)
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
.modal {
  .grid-left {
    display: grid!important;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 0.2rem;
    grid-row-gap: 0;
  }
  .grid-right {
    padding-left: @padding;
    box-sizing: border-box;
    display: grid!important;
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: 0.2rem;
    grid-template-areas: 'a a'
      'b b'
      'd e';
    .grid-a {
      grid-area: a;
    }
    .grid-b {
      grid-area: b;
    }
  }
}

</style>
