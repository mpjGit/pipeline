<template>
  <div class="history-container">
    <div class="function-wrap">
      <div class="button-wrap">
        <div class="button"
             v-bind:class="{active: hasSelected, disabled: !hasSelected}"
             v-on:click="processExport"
        >

          <span>导出</span>
        </div>
      </div>
      <div class="button-wrap"></div><!--删除导出按钮-->

      <div class="search-wrap">
        <div class="input-wrap">
          <input placeholder="设备名称" v-model="conditionForm.deviceName" />
        </div>

        <!-- <div class="input-wrap">
          <input placeholder="操作人员" v-model="conditionForm.implementer" />
        </div> -->

        <div class="input-wrap">
          <input placeholder="起始时间" type="date" v-model="conditionForm.startTime"/>
        </div>

        <div class="input-wrap">
          <input placeholder="终止时间" type="date"  v-model="conditionForm.endTime" />
        </div>
      </div>

    </div>

    <!-- 表格 -->
    <div class="table-container">
      <TableComponent
          class="table"
          :columns="columns"
          :rows="formatRows"
          :checkbox="true"
          :on-selected-change="onSelectedChange"
          :total="pagination.total"
          :current-page="pagination.currentPage"
          :page-size="pagination.pageSize"
          v-on:pageChange="handlePageChange"
      />
    </div>

    <!-- 单个记录 -->
    <transition name="fade">
      <Modal
          :visible="historyDetailVisible"
          :on-close-trigger="onModalCloseAction"
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
                  :value="localRecordDetail.name"
              />
            </div>

            <div class="grid-left">
              <ValueGroup name="信号强度" :value="localRecordDetail.signal" />
              <ValueGroup name="采集周期" :value="localRecordDetail.acquire + ' min'" />
              <ValueGroup name="上传周期" :value="formatTimeHours(localRecordDetail.update)" />
              <ValueGroup name="浓度" :value="localRecordDetail.concentration" />
              <ValueGroup name="温度" :value="localRecordDetail.temperature + ' ℃'" />
              <ValueGroup v-if="localRecordDetail.status === 1" name="故障内容" :value="MILEAGE_FAULT_MAP[localRecordDetail.fault]" />
              <ValueGroup v-if="localRecordDetail.status === 2" name="报警内容" :value="MILEAGE_FAULT_MAP[localRecordDetail.fault]" />
            </div>

          </div>
          <div class="col-span-5">
            <div class="grid-right">
              <ValueGroup class="grid-a" name="状态" :value="localRecordDetail.status" type="status"/>
              <ValueGroup class="grid-b" name="上传时间" :value="localRecordDetail.time"/>
            <!--  <ValueGroup name="出气口压强" :value="localRecordDetail.exit_pressure + ' Kpa'"/>-->
              <ValueGroup name="电量" :value="localRecordDetail.power"/>
            </div>
          </div>
        </div>
      </template>
    </Modal>
    </transition>

  </div>

</template>

<script>
import TableComponent from "@/components/Table";
import Vue from 'vue'
import tableSelected from "@/mixins/tableSelected";
import Modal from "@/components/Modal";
import ValueGroup from "@/components/ValueGroup";

import { mapActions } from 'vuex'
import {isMileageFaultMsg, isMileageWarnMsg, isWarnMsg, powerToString, timeToString} from "@/utils/tool";
import {request} from "@/utils/http";
import formSearching from "@/mixins/formSearching";

const settingIcon = require('../../assets/img/setting.svg');

export default {
  name: "HistoryList",
  components: {ValueGroup, Modal, TableComponent},
  mixins: [tableSelected, formSearching],
  data: function () {
    return {
      // 基础数据信息
      columns: [
        {
          label: '设备名称',
          key: 'name',
          width: '10%',
        },
        {
          label: '浓度',
          key: 'concentration',
          width: '10%',
          // eslint-disable-next-line no-unused-vars
          render: function(value) {
            return Vue.component('concentration', {
              render: function(h) {
                return h('h2', this.currentUnit.transform(value).value+""+this.currentUnit.text);
              }
            })
          }
        },
        {
          label: '事件时间',
          key: 'time',
          width: '15%',
          render: (value) => {
            return Vue.component('timeComponent', {
              render: function (h) {
                return h('span', timeToString(parseInt(value)))
              }
            })
          }
        },
        {
          label: '状态',
          key: 'status',
          width: '10%',
          render: (value, row) => {
            const { fault, liq, manhole } = row;
            let text = '正常'
            let currentStatus = NORMAL;
            console.log(';rrowrowrow', row)
            if(isMileageWarnMsg(row)) {
              text = '报警';
              currentStatus = ERROR;
            }
            else {
              if(fault  || liq || manhole) {
                text = '故障';
                currentStatus = WARN;
              }
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
              }
            })
          }
        },
        {
          label: '操作',
          key: 'operator',
          width: '3%',
          // eslint-disable-next-line no-unused-vars
          render: (value, row) => {
            return Vue.component('edit', {
              render: (h) => {
                return h('img', {
                  on: {
                    click: () => {
                      this.showRecordDetail(row);
                    }
                  },
                  attrs: {
                    src: settingIcon,
                    class: 'icon',
                  },
                }, [
                ], '');
              }
            });
          }
        }
      ],
      localRecordDetail: null,
      timer: null
    }
  },

  beforeDestroy() {
    clearInterval(this.timer)
  },

  mounted() {
    this.fetchPageWithQuery(1);
    /*this.timer = setInterval(() => {
      this.fetchPageWithQuery(1);
    }, 4000);*/
  },

  methods: {
    // 关闭历史记录详情
    onModalCloseAction: function () {
      this.localRecordDetail = null;
    },

    showRecordDetail: function (data) {
      let status = 0;

      if(isMileageWarnMsg(data)) {
        status = 2;
      }
      else {
        if(data.fault  || data.liq || data.manhole) {
          status = 1;
        }
      }

      this.localRecordDetail = {
        ...data,
        time: timeToString(parseInt(data.time)),
        power: powerToString(data.power),
        status: status
      };
    },

    // 处理翻页
    handlePageChange: function({page})  {
      this.fetchPageWithQuery(page);
    },

    handleExport: function () {
      this.showModal({
        message: '确定要导出吗？',
        onConfirm: () => {
          // 执行导出
          request.post('exwhistory', {
            username: this.username,
            id: this.currentSelected.map(o => o.id)
          }).then(res => {
            const {code} = res;
            if(code === 0) {
              request.download(`download?num=${DOWNLOAD_TYPE.downhole_history}`);
            }
          })
          this.hideModal();
        },
        onCancel: () => {
          // this.log('cancel trigger');
          this.hideModal();
        }
      })
    },
    ...mapActions({
      'showModal': 'showModal',
      'hideModal': 'hideModal',
      'fetchPage': 'mileageHistoryList/fetchPage',
      'fetchRecord': 'mileageHistoryList/fetchRecord'
    })
  },
  computed: {
    formatRows: function () {
      return this.$store.state.mileageHistoryList.list.map(value => {
        // console.log('value :>> ', value);
        return {
          ...value,
          className: value.status
        }
      })
    },

    historyDetailVisible: function () {
      return this.localRecordDetail != null;
    },

    // 分页信息
    pagination: function () {
      return {
        total: this.$store.state.mileageHistoryList.total,
        pageSize: this.$store.state.mileageHistoryList.pageSize,
        currentPage: this.$store.state.mileageHistoryList.currentPage,
      }
    }

  }

}
</script>

<style scoped lang="less">
@import "../../styles/common";
.history-container {
  position: relative;
  z-index: 10;
  width: 100%;
  pointer-events: visible;
  font-size: 0.16rem;
  color: white;

  // 顶部按钮部分

  .function-wrap {
    width: 100%;
    display: flex;
    padding-top: calc(@padding + @navButtonSize);
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .button-wrap {
      .button;
    }
    .search-wrap {
      display: flex;
      flex-direction: row;
      align-items: center;
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
            color: rgba(255,255,255,0.4);
          }
        }
      }
      .button-wrap {
        .button;
      }
    }
    margin-bottom: @padding;
  }
  .table-container {
    // 添加表格背景
    &:before {
      content: '';
      display: block;
      position: absolute;
      z-index: -1;
      width: calc(100% + @padding*2);
      margin-left: -@padding;
      height: calc(100vh - @padding - @navButtonSize);
      background: #7F8D9F88;
    }
    .table {
      height: calc(100vh - @padding - @navButtonSize - @navButtonSize - @padding);
    }
  }

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


}
</style>
