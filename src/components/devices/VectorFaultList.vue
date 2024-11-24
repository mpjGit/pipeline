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
          <input placeholder="操作人员" v-model="conditionForm.searchName"/>
        </div>

        <div class="input-wrap">
          <el-date-picker
              v-model="conditionForm.startTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              prefix-icon="123"
              placeholder="起始时间">
          </el-date-picker>
          <!--          <input placeholder="起始时间" type="date" v-model="conditionForm.startTime"/>-->
        </div>

        <div class="input-wrap">
          <el-date-picker
              v-model="conditionForm.endTime"
              type="datetime"
              prefix-icon="123"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="终止时间">
          </el-date-picker>
          <!--          <input placeholder="终止时间" type="date" v-model="conditionForm.endTime"/>-->
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
import {getFaultList, getOpenFaultList} from '@/api/apiHandler';
import tableSelected from "@/mixins/tableSelected";
import formSearching from "@/mixins/formMixin/formSearch";
import PageEventMixin from "@/mixins/pageEvent.mixin";

const settingIcon = require('../../assets/img/setting.svg');

export default {
  name: "VectorFaultList.vue",
  components: {TableComponent},

  mixins: [tableSelected, formSearching, PageEventMixin],

  data: function () {
    return {
      // TODO: 这里需要根据新的接口就适配
      // 基础数据信息
      columns: [
        {
          label: '设备名称',
          key: 'deviceName',
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
        },
        {
          label: '状态',
          key: 'resolve',
          width: '10%',
          render: (value) => {
            let currentStatus = NORMAL;
            let text;
            switch (Number(value)) {
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
      localRecordDetail: null,
      selectImplementer: null,
      timer: null,
      // 分页信息
      pagination: {},
      // 故障列表
      faultList: [],
      // 选中表格列表
      selectedList: [],
    }
  },

  beforeDestroy() {
    clearInterval(this.timer)
  },

  created() {
    if (this.pageType === PageTypeEnum.OPEN) {
      const addColumns = [
        {
          label: '设备名称',
          key: 'nickname',
          width: '10%',
        },
        {
          label: '故障内容',
          key: 'fault',
          width: '10%',
        },
        {
          label: '操作员',
          key: 'openImplementer',
          width: '10%',
        },
      ];
      this.columns = [...addColumns, ...this.columns.slice(3)]
    }
  },

  mounted() {
    this.fetchPage({page: 1});
    // this.timer = setInterval(() => {
    //   this.fetchPage({page: 1});
    // }, 4000);
  },

  methods: {
    ...mapActions({
      'showModal': 'showModal',
      'hideModal': 'hideModal',
      'deleteFault': "notification/deleteFault",
    }),

    // 处理翻页
    handlePageChange: function ({page}) {
      this.fetchPage({page});
    },

    // 表格条件变化
    conditionChange: function (ev) {
      console.log(ev);
    },

    async fetchPage({page = this.pagination.currentPage, query = this.conditionForm}) {
      if (page === undefined || page === null) {
        console.error('page需要传值')
        return;
      }
      const req = {
        id: this.userId,
        type: this.pageType,
        currentPage: page,
        username: '',
        ...query,
      };

      let success = false;
      let detail = [];
      let res = null;
      if (this.pageType === PageTypeEnum.OPEN) {
        delete req.type;
        req.username = this.username;
        res = await getOpenFaultList(req);
      } else {
        res = await getFaultList(req);
      }
      success = res.success;
      detail = res.detail;
      if (!success) {
        this.toast('getFaultList接口报错');
        return;
      }
      let formatList = [];
      detail.map(item => {
        formatList.push(this.faultListRefactor(item));
      });
      this.pagination = {
        ...this.pagination,
        currentPage: res.currentPage,
        total: res.allSize || 10,
        pageSize: res.pageSize || 10,
      };
      this.faultList = formatList;
    },

    showFaultRecordDetail: function (record) {
      this.$vModal({
        info: record,
        type: ModalPage(this.getCurDetailPage, FAULT),
      });
    },

    // 处理导出
    processExport: function () {
      this.showModal({
        message: '是否确认导出当前页选中数据？',
        onConfirm: () => {
          // 执行导出
          this.$store.dispatch('exportFront', {
            tableList: this.currentSelected,
            columns: this.columns,
          });
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
        onConfirm: async () => {
          await this.hideModal();
          const ids = this.currentSelected.map((item) => item.id);
          await this.deleteFault({ids, type: this.pageType});
          this.fetchPage({}).then();
        },
        onCancel: () => {
          this.hideModal();
        }
      })
    },

  },
  computed: {
    formatRows: function () {
      return this.faultList.map(value => {
        return {
          ...value,
          // className: value.status
        }
      })
    },
  },
  props: {
    pageType: {
      type: String,
      default: PageTypeEnum.INVEHICLE,
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
