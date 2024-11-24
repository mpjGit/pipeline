<template>
  <!-- 故障记录详情、故障记录处理  -->
  <Modal
      class="fault-detail-modal"
      size="big"
      :on-close-trigger="closeDialog"
  >k
    <template v-slot:header>
      <h3>{{ getTitle }}</h3>
    </template>
    <template v-slot:body>
      <div class="add-dev-body">
        <ValueGroup name="设备编号" v-if="isUpdateDownhole" :value="inputValue.devicename"/>
        <ValueGroup name="设备编号" v-if="isAddDownhole" type="input" v-model="inputValue.devicename"/>
        <ValueGroup name="纬度(latitude)" type="input" v-model="inputValue.latitude"/>
        <ValueGroup name="经度(longitude)" type="input" v-model="inputValue.longitude"/>
        <ValueGroup name="录像版本" type="input" v-model="inputValue.video_version"/>
        <ValueGroup name="设备版本" type="input" v-model="inputValue.body_version"/>
        <ValueGroup name="摄像头版本" type="input" v-model="inputValue.camera_version"/>
        <ValueGroup name="生产日期" type="input" v-model="inputValue.manuf_date"/>
        <ValueGroup name="设备位置" type="input" v-model="inputValue.position"/>
        <ValueGroup name="device_secret" type="input" v-model="inputValue.devicesecret"/>
        <ValueGroup name="product_key" type="input" v-model="inputValue.productkey"/>
        <ValueGroup name="product_name" type="input" v-model="inputValue.productname"/>
        <ValueGroup name="product_secret" type="input" v-model="inputValue.product_secret"/>
        <ValueGroup name="消费组ID" type="input" v-model="inputValue.consume_id"/>
      </div>
      <div>
        <el-select v-model="inputValue.userid" placeholder="选择设备所属用户">
          <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.username"
              :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div
          v-for="key in Object.keys(support)"
          :key="key"
          style="margin-bottom: 5px;margin-top: 20px;"
      >
        <el-switch
            v-model="support[key]"
            active-value="1"
            inactive-value="0"
            :inactive-text="keyToText[key]"
            active-color="#e6a23c">
        </el-switch>
      </div>

    </template>
    <template v-slot:footer>
      <div class="button-wrap">
        <div class="button prefer" v-on:click="process">
          <span>确定</span>
        </div>
      </div>
    </template>
  </Modal>

</template>

<script>
import Modal from "@/components/modals/modalComponents/Modal";
import ValueGroup from "@/components/ValueGroup";
import {mapActions} from "vuex";
import {InsertJinxia, UpdateJinxia} from "@/api/apiHandler";
import addDeviceMixin from "@/components/modals/modalComponents/mixins/addDevice.mixin";

const titleEnum = {
  [ModalActionEnum.ADD_DEVICE_JINGXIA]: '添加井下设备',
  [ModalActionEnum.UPDATE_DEVICE_JINGXIA]: '修改井下设备',
};
const keyToText = {
  yeweizhuangtaiSupport: '液位状态展示',
  menjinzhuangtaiSupport: '门禁状态展示',
  wenduSupport: '温度展示',
  jinqikouyaliSupport: '进气口压力展示',
  chuqikouyaliSupport: '出气口压力展示',
  nongduSupport: '浓度展示',
};

export default {
  name: "AddDevice",
  mixins: [addDeviceMixin],
  components: {ValueGroup, Modal},
  props: ['modalType'],
  data: function () {
    return {
      support: {
        // 液位状态展示
        yeweizhuangtaiSupport: true,
        // 门禁状态
        menjinzhuangtaiSupport: true,
        // wenduSupport
        wenduSupport: true,
        jinqikouyaliSupport: true,
        chuqikouyaliSupport: true,
        nongduSupport: true,
      },
    }
  },
  computed: {
    keyToText() {
      return keyToText;
    },
    getTitle() {
      return titleEnum[this.modalType] || '';
    },
    isAddDownhole() {
      return this.modalType === ModalActionEnum.ADD_DEVICE_JINGXIA;
    },
    isUpdateDownhole() {
      return this.modalType === ModalActionEnum.UPDATE_DEVICE_JINGXIA;
    },
  },
  methods: {
    ...mapActions({
      'showModal': 'showModal',
      'hideModal': 'hideModal',
    }),


    closeDialog() {
      this.$emit('closeDialog');
    },

    async process() {
      let hasNull = false;
      Object.keys(this.inputValue).forEach((key) => {
        if (!this.inputValue[key]) {
          hasNull = true;
        }
      });
      if (hasNull) {
        await this.$store.dispatch('toast/showToast', {message: '不能有空值'})
        return;
      }
      Object.entries(this.support).forEach(([key, value]) => this.support[key] = Number(value));
      const req = {
        ...this.inputValue,
        ...this.support,
        type: 'downhole',
        // token: this.token,
        token: 'a999',
      }
      let res;
      if (this.isAddDownhole) {
        res = await InsertJinxia(req);
      } else if (this.isUpdateDownhole) {
        res = await UpdateJinxia(req);
      }
      if (!res?.success) {
        await this.$store.dispatch('toast/showToast', {message: res?.message || '服务异常'})
        return;
      }
      await this.$store.dispatch('toast/showToast', {message: '操作成功'})
      this.$vModal.close();
      this.$bus.$emit('refreshPage', {});
    },

  },
}
</script>

<style scoped lang="less">
@import "../../../styles/common";

.fault-detail-modal {
  .add-dev-body {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    .form-group {
      width: 25%;
      box-sizing: border-box;
      padding-right: 20px;
    }
  }

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
