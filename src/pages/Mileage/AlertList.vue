<template>
  <div class="alert-container">
    <div class="function-wrap">
      <div class="button-wrap">
        <div class="button"
             v-on:click="processExport"
             v-bind:class="{active: hasSelected, disabled: !hasSelected}">
          <span>导出</span>
        </div>
        <!--<div class="button"
             v-on:click="processDelete"
             v-bind:class="{disabled: !hasSelected}">
          <span>删除</span>
        </div>-->
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

    <!-- 报警记录 -->
    <div class="table-container">

      <TableComponent
          class="table"
          :columns="columns"
          :rows="formatRows"
          :checkbox="true"
          :on-selected-change="onSelectedChange"
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
import {mapActions} from 'vuex'
import tableSelected from "@/mixins/tableSelected";
// import Modal from "@/components/Modal";
// import ValueGroup from "@/components/ValueGroup";
import {timeToString} from "@/utils/tool";
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
          width: '10%',
          render: (value) => {
            return Vue.component('dynamic', {
              render: function (h) {
                return h('span', {
                }, timeToString(parseInt(value)));
              }
            })
          }
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
                text = '已解决';
                currentStatus = NORMAL;
                break;
              case 0:
                text = '未解决';
                currentStatus = WARN
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
                      this.showAlertRecordDetail(row.id)
                    }
                  }
                }, [
                ], '');
              }
            });
          }

        }

      ],
      localRecordDetail: null,
      selectImplementer: null,
      timer: null
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  created() {
  },
  mounted() {
    this.fetchPageWithQuery();
   /* this.timer = setInterval(() => {
      this.fetchPageWithQuery();
    }, 4000);*/
  },
  methods: {
    ...mapActions({
      'showModal': 'showModal',
      'hideModal': 'hideModal',
      'fetchPage': 'mileageAlertList/fetchPage',
      'fetchRecord': 'mileageAlertList/fetchRecord',
      'processRecord': 'mileageAlertList/processRecord'
    }),

    showAlertRecordDetail: function (id) {
      this.fetchRecord(id);
    },

    // 处理翻页
    handlePageChange: function({page})  {
      this.fetchPageWithQuery(page);
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
      return this.$store.state.mileageAlertList.list.map(value => {
        const { devicename } = value;
        const showPress = this.getPressShowByDeviceName(devicename);
        return {
          ...value,
          showPress,
          className: value.status
        }
      })
    },

    // 分页信息
    pagination: function () {
      return {
        total: this.$store.state.mileageAlertList.total,
        pageSize: this.$store.state.mileageAlertList.pageSize,
        currentPage: this.$store.state.mileageAlertList.currentPage,
      }
    },
  }
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
      height: calc(100vh - @navButtonSize - @navButtonSize - @padding - @padding)
    }
  }


  .alert-detail-modal {
    .grid {
      display: grid;
      grid-template-areas:
          'a b b c'
          'd d d e'
          'f g h i'
          'j k l m';
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: repeat(4, 1fr);
      grid-column-gap: 0.2rem;
      .area-address {
        grid-area: d;
      }
      .area-device-name {
        grid-area: b;
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

}
</style>
