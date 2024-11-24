<template>
  <div class="device-container">
    <div class="search-wrap">
      <div class="button-wrap">
        <div class="button"
             v-bind:class="{disabled: !hasSelected,active: hasSelected}"
             v-on:click="handleDeviceSetting">
          <span>设置</span>
        </div>
      </div>
      <div class="input-wrap">
        <input placeholder="设备名称" v-model="conditionForm.deviceName"/>
      </div>

    </div>


    <TableComponent
        :columns="columns"
        :rows="formatRows"
        :on-selected-change="onSelectedChange"
        :checkbox="true"
        v-on:pageChange="handlePageChange"
        :total="pagination.total"
        :current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
    />

    <!-- 设备信息弹窗 -->
    <Modal
        :visible="detailModalVisible"
        :onCloseTrigger="onModalCloseAction"
        class="modal"
    >
      <template v-slot:header>
        <div class="innerHeader"><span>设备名称：</span>
          <h3>{{ deviceNames }}</h3></div>
      </template>
      <template v-slot:body>

        <div class="row">
          <!-- 左侧表单部分 -->
          <div class="col-span-7 form-wrap">
            <div class="form-group">
              <div class="form-label">测量单位</div>
              <div class="group-select">
                <unit-select/>
              </div>
            </div>
            <div class="form-group">
              <div class="form-label">报警值</div>
              <div class="input-value row">
                <span class="name col-span-2">低报警值</span>
                <input class="input col-span-8" name="min-alert" v-model="deviceDetail.low_alert"/>
                <span class="unit col-span-2">{{ currentUnit.text }}</span>
              </div>

              <div class="input-value">
                <span class="name col-span-2">高报警值</span>
                <input class="input col-span-8" name="min-alert" v-model="deviceDetail.high_alert"/>
                <span class="unit col-span-2">{{ currentUnit.text }}</span>
              </div>

              <div class="input-value">
                <span class="name col-span-2">采集周期</span>
                <input class="input col-span-8" name="interval" v-model="deviceDetail.acquire"/>
                <span class="unit col-span-2">min</span>
              </div>

              <div class="input-value">
                <span class="name col-span-2">上传周期</span>
                <input class="input col-span-8" name="upload_interval" v-model="deviceDetail.update"/>
                <span style="white-space: nowrap" class="unit col-span-2">min->({{(deviceDetail.update / 60).toFixed(1)}}H)</span>
              </div>

            </div>
          </div>
          <!-- 右侧设备基本信息 -->
          <div class="col-span-5">
            <div class="device-basic-info">
              <div class="row">
                <div class="col-span-12">
                  <div class="value-group">
                    <label>产品型号</label>
                    <span class="value">{{ deviceDetail.type }}</span>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-span-12 grid">
                  <div class="value-group">
                    <label>显示版本</label>
                    <span class="value">{{ deviceDetail.body_version }}</span>
                  </div>

                  <div class="value-group">
                    <label>组件版本</label>
                    <span class="value">{{ deviceDetail.body_version }}</span>
                  </div>

                  <div class="value-group">
                    <label>探头版本</label>
                    <span class="value">{{ deviceDetail.camera_version }}</span>
                  </div>

                  <div class="value-group">
                    <label>生产日期</label>
                    <span class="value">{{ deviceDetail.manufacture_date }}</span>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

      </template>
      <template v-slot:footer>
        <div class="button-wrap">
          <div class="button prefer" v-on:click="handleSave">
            保存
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
import TableComponent from "@/components/Table";
import Vue from 'vue';
import {mapActions} from 'vuex';
import Modal from "@/components/Modal";
import tableSelected from "@/mixins/tableSelected";
import ValueGroup from "@/components/ValueGroup";
import {request} from "@/utils/http";
import UnitSelect from "../../components/UnitSelect";
import formSearching from "@/mixins/formSearching";
import {isFaultMsg, isMileageFaultMsg, isMileageWarnMsg, isWarnMsg} from "@/utils/tool";

export default {
  name: "DeviceList",
  components: {UnitSelect, Modal, TableComponent, ValueGroup},
  mixins: [tableSelected, formSearching],
  // inject: ['clearInterval'],
  created() {
    this.$emit("clearInterval");
  },
  data: function () {
    return {
      // 基础数据信息
      columns: [
        {
          label: '设备名称',
          key: 'name',
          width: '5%',
        },
        {
          label: '设备位号',
          key: 'no',
          width: '10%',
        },

        {
          label: '实时浓度',
          key: 'concentration',
          width: '10%',
          // eslint-disable-next-line no-unused-vars
          render: function (value) {
            return Vue.component('concentration', {
              render: function (h) {
                return h('h2', this.currentUnit.transform(value).value + "" + this.currentUnit.text)
              }
            })
          }
        },
        {
          label: '状态',
          key: 'status',
          width: '10%',
          render: (value) => {
            let currentStatus = value;
            let text;
            switch (value) {
              case NORMAL:
                text = '正常';
                break;
              case WARN:
                text = '故障';
                break;
              case ERROR:
                text = '报警';
                break;
            }
            return Vue.component('dynamic', {
              render: function (h) {
                return h('div', {
                  attrs: {
                    class: `${currentStatus} status`
                  }
                }, [
                  h('span', text)
                ], '');
                //return `<div class="status ${currentStatus}"><span>${text}</span></div>`
              }
            })
          }
        },


      ],
      deviceDetail: null,
      timer: ''
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },

  mounted() {
    this.fetchPageWithQuery(1);
    this.timer = setInterval(() => {
      this.fetchPageWithQuery(1);
    }, 4000);
    if (this.$route.query?.deviceName) {
      this.conditionForm.deviceName = this.$route.query.deviceName;
    }
  },

  methods: {
    ...mapActions({
      'fetchPage': 'mileageList/fetchPage',
      'fetchDeviceConfig': 'mileageDeviceConfig/fetchDeviceConfig',
      'fetchDevicesConfig': 'mileageDeviceConfig/fetchDevicesConfig',
      'clearConfigInfo': 'mileageDeviceConfig/clearConfigInfo'
    }),
    onModalCloseAction: function () {
      this.clearConfigInfo();
    },
    // 获取设备设置信息
    handleDeviceSetting: function () {
      // if(this.currentSelected.length == 1) {
      //   // 获取单个设备信息
      //   const deviceName = this.currentSelected[0].no;
      //   this.fetchDeviceConfig(deviceName)
      // } else if(this.currentSelected.length > 1) {
      // 获取多个设备名称
      let selectedDevices = this.currentSelected.map(item => {
        return item.no;
      });
      // load first device as default display info
      // this.fetchDeviceConfig(selectedDevices);
      this.fetchDevicesConfig(selectedDevices);

      // }
      // 获取多个设备信息
    },

    //设置设备信息
    handleSave: function () {
      // 准备上传配置信息
      const data = {
        username: this.username,
        devicename: this.deviceDetail.deviceName,
        low_alert: this.currentUnit.transBack(parseInt(this.deviceDetail.low_alert)), // 转换为vol值
        high_alert: this.currentUnit.transBack(parseInt(this.deviceDetail.high_alert)), // 转换为vol值
        acquire: parseInt(this.deviceDetail.acquire),
        update: parseInt(this.deviceDetail.update)
      };
      // 单个设备信息保存
      // if(this.singleDeviceSelected) {
      //   request.post('single', {
      //     ...data
      //   }).then(res => {
      //     console.log(res);
      //     this.clearConfigInfo();
      //   })
      // }
      // // 多个设备信息保存
      // else {
      console.log('data', data)
      let deviceName = this.configDetailList.map(value => value.deviceName).filter(o => o != null);
      request.post('much', {
        ...data,
        isMileage: 1,
        devicename: deviceName
      }).then(res => {
        console.log(res);
        this.clearConfigInfo();
        this.fetchPageWithQuery();
      })
      // }
    },

    // 翻页动作处理
    handlePageChange: function (ev) {
      const {page} = ev;
      this.fetchPageWithQuery(page);
    }
  },
  computed: {
    singleDeviceSelected: function () {
      return this.currentSelected.length === 1
    },
    formatRows: function () {
      return this.rows.map(value => {
        return {
          ...value,
          className: value.status
        }
      })
    },
    // 设备列表
    rows: function () {
      return this.$store.state.mileageList.list.map(item => {
        let status = NORMAL;
        if (isMileageFaultMsg(item)) {
          status = WARN;
        }
        if (isMileageWarnMsg(item)) {
          status = ERROR;
        }
        const { devicename } = item;
        const showPress = this.getPressShowByDeviceName(devicename);
        return {
          ...item,
          id: item.id,
          name: item.nickName,
          no: item.deviceName,
          showPress,
          status: status,
          concentration: item.concentration
        }
      });
    },

    // 已加载的设备信息
    configDetail: function () {
      return this.$store.state.mileageDeviceConfig.configDetail;
    },

    // 已选中的所有设备信息
    configDetailList: function () {
      return this.$store.state.mileageDeviceConfig.configList;
    },

    // 已选中的所有设备名称
    deviceNames: function () {
      return this.configDetailList.map(value => value.deviceName).join(',');
    },

    // 分页信息

    pagination: function () {
      return {
        total: this.$store.state.mileageList.total,
        pageSize: this.$store.state.mileageList.pageSize,
        currentPage: this.$store.state.mileageList.currentPage,
      }
    },

    detailModalVisible: function () {
      return this.deviceDetail != null;
    }

  },

  watch: {
    configDetail: function (cur) {
      if (cur == null) {
        this.deviceDetail = null;
      } else {
        this.deviceDetail = {
          ...cur,
          low_alert: this.currentUnit.transform(cur.low_alert).value,
          high_alert: this.currentUnit.transform(cur.high_alert).value
        };
      }
    },
    // 当用户unit更改的情况下
    currentUnit: function (newUnit, oldUnit) {
      if (this.deviceDetail != null) {
        const cur = {...this.deviceDetail};
        this.deviceDetail = {
          ...cur,
          low_alert: newUnit.transform(oldUnit.transBack(cur.low_alert).value).value,
          high_alert: newUnit.transform(oldUnit.transBack(cur.high_alert).value).value
        };
      }
    }
  }

}
</script>

<style scoped lang="less">
@import "../../styles/common";

.device-container {
  position: relative;
  z-index: 10;
  width: 100%;
  pointer-events: visible;
  font-size: 0.16rem;
  color: white;

  .search-wrap {
    padding-top: calc(0.26rem + 0.58rem);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    margin-right: 0.26rem;
  }

  .input-wrap {
    width: 2.0rem;
    margin-right: 0.1rem;
    height: @navButtonSize;
    background-image: url("../../assets/img/search.svg");
    background-repeat: no-repeat;
    padding-left: 0.3rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    background-position-y: center;
    border-bottom: 1px solid rgba(175, 176, 176, 1);

    input {
      background: transparent;
      border: none;
      outline: none;
      color: white;

      &::-webkit-calendar-picker-indicator {
        margin-top: 4px;
        cursor: pointer;
        filter: invert(1);
      }

      &::-webkit-input-placeholder {
        color: rgba(255, 255, 255, 0.4);
      }
    }
  }

  // 顶部按钮部分

  .button-wrap {
    width: 100%;
    .button;
    //.button {
    //  height: @navButtonSize;
    //  cursor: pointer;
    //  width: auto;
    //  display: inline-block;
    //  border-radius: @navButtonSize/2;
    //  color: black;
    //  line-height: @navButtonSize;
    //  font-weight: bold;
    //  text-align: center;
    //  min-width: 1.28rem;
    //  box-sizing: border-box;
    //  padding-left: @padding;
    //  padding-right: @padding;
    //  background-color: white;
    //}
    //
    margin-bottom: @padding;
  }

  .modal {
    .innerHeader {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    // 表单信息
    .form-wrap {
      padding-right: @padding;
      box-sizing: border-box;

      .form-group {
        margin-bottom: 0.24rem;

        &:last-of-type {
          margin-bottom: 0;
        }

        .form-label {
          color: rgba(34, 34, 34, 1);
          font-size: 0.16rem;
          margin-bottom: 0.1rem;
        }

        .group-select {
          display: grid;
          grid-gap: 0.2rem;
          grid-template-columns: repeat(4, 1fr);

          .select-option {
            width: 1.4rem;
            height: 0.44rem;
            color: rgba(23, 23, 23, 1);
            font-size: 0.2rem;
            border: 1px solid rgba(221, 221, 221, 1);
            border-radius: 0.22rem;
            .contentCenter;
            cursor: pointer;

            &.active {
              background: rgba(255, 135, 49, 1);
            }
          }
        }

        .input-value {
          margin-bottom: 0.07rem;
          padding-left: 0.38rem;
          padding-right: 0.28rem;
          box-sizing: border-box;
          color: black;
          display: flex;
          flex-direction: row;
          height: 0.5rem;
          background: rgba(245, 245, 245, 1);
          border-radius: 0.05rem;
          align-items: center;

          .name {
            white-space: nowrap;
            font-size: 0.16rem;
            padding-right: 0.1rem;
          }

          .input {
            height: 0.4rem;
            border-radius: 0.08rem;
            background: white;
            border: 0.01rem solid rgba(221, 221, 221, 1);
            text-align: center;
            font-weight: bold;
            font-size: 0.2rem;
          }

          .unit {
            padding-left: 0.1rem;
            font-size: 0.16rem;
          }

          &:last-of-type {
            margin-bottom: 0;
          }
        }
      }
    }

    // 设备详细信息
    .device-basic-info {
      border: 1px solid rgba(221, 221, 221, 1);
      border-radius: 0.2rem;
      padding: @padding;
      box-sizing: border-box;
      color: @blackColor;
      height: 100%;

      .value-group {
        margin-bottom: 0.2rem;
        display: grid;
        grid-gap: 0.1rem;

        label {
          color: rgba(102, 102, 102, 1);
          font-size: 0.14rem;
        }

        .value {
          font-weight: bold;
        }
      }

      .grid {
        display: grid !important;
        grid-template-columns: repeat(2, 1fr);
        grid-column-gap: 0.2rem;
        grid-row-gap: 0;
      }
    }

    // 按钮部分信息
    .button-wrap {
      .button;
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      justify-content: flex-end;
      padding: 0 @padding;
      box-sizing: border-box;
    }
  }

}

.select-dialog-value {
  height: 50px;
  line-height: 50px;
  margin: 0;
  padding: 0 !important;
  display: flex !important;
  margin-left: 1px;
  align-items: center;
  overflow: hidden;
  width: 83px !important;
}
</style>
