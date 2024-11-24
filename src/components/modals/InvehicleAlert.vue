<template>

  <!-- 故障记录详情 -->
  <Modal
      class="record-container"
      :on-close-trigger="onModalClose"
      :visible="alertDetailVisible">
    <template v-slot:header>
      <div class="header-content">
        <h3>手动记录</h3>
        <div class="button" v-on:click="showVideo">
          <img class="icon" src="../../assets/img/video.svg" />
          <span>查看视频</span>
        </div>
      </div>
    </template>
    <template v-slot:body>
      <div class="grid">
        <ValueGroup v-if="localRecordDetail.resolve"  name="处理人" :value="localRecordDetail.implementer" />
        <ValueGroup v-else name="处理人" :options="[{name: username }]" type="select" v-on:change="onImplementerChange" />
        <ValueGroup name="处理时间" :value="localRecordDetail.time" />
        <ValueGroup v-if="localRecordDetail.resolve === 0" class="grid-full" type="textarea-editable" name="备注" :value="localRecordDetail.remarks" v-on:change="onRemarksChange" />
        <ValueGroup v-else class="grid-full" type="textarea" name="备注" :value="localRecordDetail.remarks" />

      </div>
      <div class="field-list" v-if="false">
        <div class="field-item">
          <span class="name">操作员</span>
          <span class="value">张大大</span>
        </div>
        <div class="field-item">
          <span class="name">事件地点</span>
          <span class="value">大连市甘井子区</span>
        </div>
        <div class="field-item">
          <span class="name">浓度</span>
          <span class="value">1000vol.m</span>
        </div>
        <div class="field-item">
          <span class="name">光强</span>
          <span class="value">2345</span>
        </div>
        <div class="field-item">
          <span class="name">起始时间</span>
          <span class="value">2022/10/10 12:10</span>
        </div>
        <div class="field-item">
          <span class="name">设备类型</span>
          <span class="value">CT7100000</span>
        </div>
        <div class="field-item">
          <span class="name">事件时间</span>
          <span class="value">2022/10/10 12:00</span>
        </div>
        <div class="field-item">
          <span class="name">温度</span>
          <span class="value">25 ℃</span>
        </div>
        <div class="field-item">
          <span class="name">车速</span>
          <span class="value">10km/h</span>
        </div>
        <div class="field-item">
          <span class="name">备注</span>
          <span class="value">--</span>
        </div>
      </div>
      <div class="image-wrap">
        <img :src="localRecordDetail.screenshot" />
      </div>
    </template>
    <template v-slot:footer v-if="localRecordDetail && !localRecordDetail.resolve">
      <div class="button-wrap">
        <div class="button prefer" v-on:click="processAlert">确认</div>
      </div>
    </template>
  </Modal>

</template>

<script>

import {timeToString} from "@/utils/tool";
import {mapActions} from "vuex";
import Modal from "@/components/Modal";
import ValueGroup from "@/components/ValueGroup";

export default {
  name: "InvehicleAlert",
  components: {ValueGroup, Modal},
  data: function () {
    return {
      localRecordDetail: null,
      selectImplementer: '',
      currentRemarks: ''
    }
  },
  methods: {
    ...mapActions({
      'showModal': 'showModal',
      'hideModal': 'hideModal',
      'processRecord': 'inVehicleAlertList/processRecord'
    }),
    onImplementerChange: function ({value}) {
      this.selectImplementer = value;
    },

    onRemarksChange: function ({value}) {
      this.currentRemarks = value;
    },
    onModalClose: function () {
      this.localRecordDetail = null;
    },
    showVideo: function () {
      this.play(this.localRecordDetail.video);
    },
    // 处理报警
    processAlert: function () {
      this.showModal({
        message: '是否确定已处理?',
        onConfirm: () => {
          this.processRecord({
            id: this.localRecordDetail.id,
            implementer: this.selectImplementer,
            remarks: this.currentRemarks
          })
          this.hideModal();
        },
        onCancel: () => {
          this.hideModal();
        }
      })
    }
  },

  computed: {
    // 当前获取故障记录信息
    recordDetail: function () {
      return this.$store.state.inVehicleAlertList.recordDetail;
    },
    alertDetailVisible: function () {
      return this.localRecordDetail != null;
    }
  },
  watch: {
    recordDetail: function (cur) {
      if(cur === null) {
        this.localRecordDetail = null
      }else {
        this.currentRemarks = cur.remarks;
        this.localRecordDetail = {
          ...cur,
          time: timeToString(parseInt(cur.exe_time))
        };
      }
    }
  }
}

</script>

<style scoped lang="less">
@import "../../styles/common";
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

  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: 0.1rem;
    grid-template-areas: 'a b'
      'c c';
  }

  .grid-full {
    grid-area: c;
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

  .image-wrap {
    margin-top: 0.2rem;

    img {
      width: 100%;
      height: auto;
      border-radius: 0.1rem;
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
