<template>
  <div class="alert-container">
    <div class="function-wrap">
      <div class="button-wrap">
        <div class="button" v-bind:class="{active: hasSelected, disabled: !hasSelected}"
             v-on:click="processExport"
          >
          <span>导出</span>
        </div>
        <div class="button" v-bind:class="{disabled: !hasSelected}"
             v-on:click="processDelete"
        >
          <span>删除</span>
        </div>
      </div>

      <div class="search-wrap">

        <div class="input-wrap">
          <input placeholder="设备名称" v-model="conditionForm.deviceName" />
        </div>
        <div class="input-wrap">
          <input placeholder="操作人员" v-model="conditionForm.implementer" />
        </div>

        <div class="input-wrap">
          <input placeholder="起始时间" type="date" v-model="conditionForm.startTime"/>
        </div>

        <div class="input-wrap">
          <input placeholder="终止时间" type="date"  v-model="conditionForm.endTime" />
        </div>

      </div>

    </div>

    <div class="table-container">

      <TableComponent
          :columns="columns"
          :rows="formatRows"
          :checkbox="true"
          :on-selected-change="onSelectedChange"
          class="table"
          v-on:pageChange="handlePageChange"
          :total="pagination.total"
          :page-size="pagination.pageSize"
          :current-page="pagination.currentPage"
      />
    </div>

  </div>

</template>

<script>
import TableComponent from "@/components/Table";
import Vue from 'vue'
import tableSelected from "@/mixins/tableSelected";
import {mapActions} from "vuex";
import {request} from "@/utils/http";
import formSearching from "@/mixins/formSearching";

const settingIcon = require('../../assets/img/setting.svg');

export default {
  name: "AlertList",
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
          label: '浓度',
          key: 'concentration',
          width: '10%',
          // eslint-disable-next-line no-unused-vars
          render: function(value) {
            return Vue.component('test', {
              render: function(h) {
                return h('h2', this.currentUnit.transform(value).value+""+this.currentUnit.text);
              }
            })
          }
        },
        {
          label: '操作员',
          key: 'operator',
          width: '5%'
        },
        {
          label: '事件时间',
          key: 'time',
          width: '10%'
        },
        {
          label: '状态',
          key: 'resolve',
          width: '10%',
          render: (value) => {
            let currentStatus = value;
            let text;
            switch (value) {
              case 1:
                text = '已处理';
                currentStatus = NORMAL;
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
            return Vue.component('view-detail', {
              render: (h) => {
                return h('img', {
                  on:{
                    click: () => {
                      this.showAlertRecordDetail(row.id);
                    }
                  },
                  attrs: {
                    src: settingIcon,
                    class: 'icon'
                  }
                }, [
                ], '');
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
    this.fetchPageWithQuery();
    this.timer = setInterval(() => {
      this.fetchPageWithQuery();
    }, 4000);
  },
  methods: {
    ...mapActions({
      'showModal': 'showModal',
      'hideModal': 'hideModal',
      'fetchPage': 'inVehicleAlertList/fetchPage',
      'fetchRecord': 'inVehicleAlertList/fetchRecord'
    }),

    // 处理翻页
    handlePageChange: function({page})  {
      this.fetchPageWithQuery(page);
    },

    showAlertRecordDetail: function(id) {
      this.fetchRecord(id);
    },

    // 处理导出
    processExport: function () {
      this.showModal({
        message: '是否确认导出当前页选中数据？',
        onConfirm: () => {
          // 执行导出
          request.post('excwarn', {
            username: this.username,
            jid: this.currentSelected.map(o => o.id)
          }).then(res => {
            const {code} = res;
            if(code === 0) {
              request.download(`download?num=${DOWNLOAD_TYPE.invehicle_alert}`);
            }
          })
          this.hideModal();
        },
        onCancel: () => {
          this.hideModal();
        }
      })
    },

    // 处理删除
    processDelete: function () {
      this.showModal({
        message: '是否确认删除？',
        onConfirm: () => {
          this.hideModal();
        },
        onCancel: () => {
          this.hideModal();
        }
      })
    },
  },
  computed: {
    formatRows: function () {
      return this.$store.state.inVehicleAlertList.list.map(value => {
        return {
          ...value,
          className: value.status
        }
      })
    },

    // 分页信息
    pagination: function () {
      return {
        total: this.$store.state.inVehicleAlertList.total,
        pageSize: this.$store.state.inVehicleAlertList.pageSize,
        currentPage: this.$store.state.inVehicleAlertList.currentPage,
      }
    },
  },
}
</script>

<style scoped lang="less">
@import "../../styles/common";
.alert-container {
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
      height: calc(100vh - @navButtonSize - @navButtonSize - @padding - @padding);
    }

  }
}
</style>
