<template>
  <div class="device-container">

    <div class="function-wrap">
      <div class="button-wrap">
        <div class="button-wrap">
          <div class="button"
               v-on:click="processExport"
               v-bind:class="{active: hasSelected, disabled: !hasSelected}">
            <span>导出</span>
          </div>
          <div class="button"
               v-on:click="processDelete"
               v-bind:class="{disabled: !hasSelected}">
            <span>删除</span>
          </div>
        </div>
      </div>

      <div class="search-wrap">
        <div class="input-wrap">
          <input placeholder="设备名称" v-model="conditionForm.deviceName"/>
        </div>
        <div class="input-wrap">
          <input placeholder="操作人员" v-model="conditionForm.implementer"/>
        </div>

        <div class="input-wrap">
          <input placeholder="起始时间" type="date" v-model="conditionForm.startTime"/>
        </div>

        <div class="input-wrap">
          <input placeholder="终止时间" type="date" v-model="conditionForm.endTime"/>
        </div>
      </div>

    </div>

    <div class="table-container">

      <TableComponent
          class="table"
          :columns="columns"
          :rows="formatRows"
          :checkbox="true"
          :on-selected-change="onSelectedChange"
          :total="pagination.total"
          :page-size="pagination.pageSize"
          v-on:pageChange="handlePageChange"
          :current-page="pagination.currentPage"
      />
    </div>


  </div>

</template>

<script>
import TableComponent from "@/components/Table";
import Vue from 'vue'
import {mapActions} from 'vuex'
import tableSelected from "@/mixins/tableSelected";
import {timeToString} from "@/utils/tool";
import {request} from "@/utils/http";
import formSearching from "@/mixins/formSearching";

const settingIcon = require('../../assets/img/setting.svg');

export default {
  name: "FaultList",
  components: {TableComponent},
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
          label: '故障原因',
          key: 'fault_reason',
          width: '10%',
        },
        {
          label: '操作员',
          key: 'implementer',
          width: '5%'
        },
        {
          label: '事件时间',
          key: 'time',
          width: '10%',
          render: (value) => {
            return Vue.component('dynamic', {
              render: function (h) {
                return h('span', timeToString(parseInt(value)));
              }
            })
          }
        },
        {
          label: '状态',
          key: 'resolve',
          width: '10%',
          render: (value) => {
            let currentStatus = NORMAL;
            let text;
            switch (value) {
              case 1:
                text = '已处理';
                break;
              case 0:
                text = '未处理';
                currentStatus = WARN;
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
              }
            })
          }
        },
        {
          label: '操作',
          key: 'operator',
          width: '10%',
          // eslint-disable-next-line no-unused-vars
          render: (value, row) => {
            return Vue.component('edit', {
              render: (h) => {
                return h('img', {
                  attrs: {
                    src: settingIcon,
                    class: 'icon'
                  },
                  on: {
                    click: () => {
                      this.showFaultRecordDetail(row)
                    }
                  }
                }, [], '');
              }
            });
          }
        }
      ],
      timer: null
    }
  },

  beforeDestroy() {
    clearInterval(this.timer)
  },

  mounted() {
    this.fetchPageWithQuery(1);
    //修改:删除故障报警和历史页的刷新功能
    /*this.timer = setInterval(() => {
      this.fetchPageWithQuery(1);
    }, 4000);*/
  },

  methods: {
    ...mapActions({
      'showModal': 'showModal',
      'hideModal': 'hideModal',
      'fetchPage': 'downholeFaultList/fetchPage',
      'fetchRecord': 'downholeFaultList/fetchRecord',
      'deleteFault': "notification/deleteFault",
    }),

    // 处理翻页
    handlePageChange: function ({page}) {
      this.fetchPageWithQuery(page);
    },

    onConditionChange: function (ev) {
      console.log(ev);
    },


    showFaultRecordDetail: function (record) {
      this.fetchRecord(record.id)
    },

    // 处理删除
    processDelete: function () {
      // 处理删除
      this.showModal({
        message: '是否确认删除？',
        onConfirm: async () => {
          await this.hideModal();
          const ids = this.currentSelected.map((item) => item.id);
          await this.deleteFault({ids, type:  PageTypeEnum.DOWNHOLE});
          this.fetchPageWithQuery();
        },
        onCancel: () => {
          this.hideModal();
        }
      })
    },

  },
  computed: {
    formatRows: function () {
      return this.$store.state.downholeFaultList.list.map(value => {
        return {
          ...value,
          // className: value.status
        }
      })
    },

    // 分页信息
    pagination: function () {
      return {
        total: this.$store.state.downholeFaultList.total,
        pageSize: this.$store.state.downholeFaultList.pageSize,
        currentPage: this.$store.state.downholeFaultList.currentPage,
      }
    }

  },


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
            margin-top: 2px;
            cursor: pointer;
            filter: invert(1);
          }

          &::-webkit-input-placeholder {
            color: rgba(255, 255, 255, 0.4);
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
      width: calc(100% + @padding * 2);
      margin-left: -@padding;
      height: calc(100vh - @padding - @navButtonSize);
      background: #7F8D9F88;
    }

    .table {
      height: calc(100vh - @navButtonSize - @padding - @padding - @navButtonSize);
    }
  }

}
</style>
