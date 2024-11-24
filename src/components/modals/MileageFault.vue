<template>
  <!-- 故障记录详情、故障记录处理  -->
  <Modal
      :visible="faultDetailVisible"
      class="fault-detail-modal"
      :on-close-trigger="hideFaultRecordDetail">
    <template v-slot:header>
      <h3>故障记录</h3>
    </template>
    <template v-slot:body>
      <div class="grid">
        <ValueGroup  v-if="!localRecordDetail.resolve" name="操作员" :value="username" type="select" :options="[{name: username}]" v-on:change="onImplementerChange"/>
        <ValueGroup v-else name="操作员" :value="localRecordDetail.implementer" />
        <ValueGroup class="area-device-name"  name="设备名称" :value="localRecordDetail.name" />
        <ValueGroup class="area-reason" name="故障原因" :value="localRecordDetail.fault_reason" type="textarea" />
        <ValueGroup name="事件时间" :value="localRecordDetail.time" />
        <ValueGroup class="area-address" name="事件地址" :value="localRecordDetail.position" />
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
import Modal from "@/components/Modal";
import ValueGroup from "@/components/ValueGroup";
import {timeToString} from "@/utils/tool";
import {mapActions} from 'vuex'
export default {
  name: "MileageFault",
  components: {ValueGroup, Modal},
  data: function () {
    return {
      localRecordDetail: null,
      selectImplementer: null,
    }
  },
  methods: {
    ...mapActions({
      'showModal': 'showModal',
      'hideModal': 'hideModal',
      'processRecord': 'mileageFaultList/processRecord'
    }),

    hideFaultRecordDetail: function () {
      this.localRecordDetail = null;
    },

    onImplementerChange: function ({value}) {
      this.selectImplementer = value;
    },

    // 处理报警
    processAlert: function () {
      if(!this.selectImplementer) {
        alert('请选择操作人员！');
        return false;
      }
      this.showModal({
        message: '是否确定已处理?',
        onConfirm: () => {
          this.processRecord({id: this.localRecordDetail.id, implementer: this.selectImplementer});
          this.hideModal();
        },
        onCancel: () => {
          this.hideModal();
        }
      })
    },
  },
  computed: {
    faultDetailVisible: function () {
      return this.localRecordDetail != null;
    },
    // 当前获取故障记录信息
    recordDetail: function () {
      return this.$store.state.mileageFaultList.recordDetail;
    }
  },
  watch: {
    recordDetail: function (cur) {
      if (cur === null) {
        this.localRecordDetail = null;
      } else {
        this.localRecordDetail = {...cur, time: timeToString(parseInt(cur.time))};
      }
    }
  }
}

</script>

<style scoped lang="less">

.fault-detail-modal {
  @import "../../styles/common";
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
