<template>
  <div class="history-container">
    <div class="function-wrap">
      <div class="button-wrap">
        <div class="button" v-bind:class="{active: hasSelected, disabled: !hasSelected}" v-on:click="processExport">
          <span>导出</span>
        </div>
      </div>

      <div class="search-wrap">
        <div class="input-wrap">
          <input placeholder="设备名称" v-model="conditionForm.deviceName"/>
        </div>

        <div class="input-wrap">
          <el-date-picker
              v-model="conditionForm.startTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              prefix-icon="123"
              placeholder="起始时间">
          </el-date-picker>
        </div>

        <div class="input-wrap">
          <el-date-picker
              v-model="conditionForm.endTime"
              type="datetime"
              prefix-icon="123"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="终止时间">
          </el-date-picker>
        </div>
      </div>

    </div>

    <div class="table-container">

      <TableComponent
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
import tableSelected from "@/mixins/tableSelected";
import PageEventMixin from "@/mixins/pageEvent.mixin";

import {
  getHistoryList,
  getOpenHistoryList,
} from "@/api/apiHandler";
import formSearching from "@/mixins/formMixin/formSearch";
import {mapActions} from "vuex";
import {cloneDeep} from "lodash-es";

const settingIcon = require('../../assets/img/setting.svg');

export default {
  name: "VectorHistoryList",
  components: {TableComponent},
  mixins: [tableSelected, formSearching, PageEventMixin],
  props: {
    pageType: {
      type: String,
      default: PageTypeEnum.INVEHICLE,
    },
  },
  data: function () {
    return {
      // 基础数据信息
      columns: [
        {
          label: '设备名称',
          key: 'deviceName',
          width: '10%',
        },
        {
          label: '浓度',
          key: 'concentration',
          width: '10%',
          // eslint-disable-next-line no-unused-vars
          render: function (value) {
            return Vue.component('test', {
              render: function (h) {
                return h('h2', this.currentUnit.transform(value).value + "" + this.currentUnit.text);
              }
            })
          }
        },
        {
          label: '事件时间',
          key: 'time',
          width: '15%'
        },
        {
          label: '状态类型',
          key: 'statusType',
          width: '10%',
          render: (value, row) => {
            let currentStatus = this.ALL_FAULT_STATUS_MAP[row.fault || row.status] || '故障';
            const text = currentStatus;
            switch (currentStatus) {
              case '解决':
              case '正常':
              case '开路解决':
                currentStatus = NORMAL;
                break;
              case '报警':
              case '开路报警':
                currentStatus = ERROR;
                break;
              case '故障':
              case '开路故障':
                currentStatus = WARN;
                break;
            }
            return Vue.component('dynamic1', {
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
          label: '状态',
          key: 'resolve',
          width: '10%',
          render: (value) => {
            let currentStatus = value;
            let text;
            switch (Number(value)) {
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
          width: '3%',
          // eslint-disable-next-line no-unused-vars
          render: (value, row) => {
            return Vue.component('test1', {
              render: (h) => {
                return h('img', {
                  attrs: {
                    src: settingIcon,
                    class: 'icon'
                  },
                  on: {
                    click: () => {
                      this.showFaultRecordDetail(row)
                    },
                  },
                }, [], '');
              }
            });
          }
        }
      ],
      timer: null,
      // 分页信息
      pagination: {},
      // 故障列表
      historyList: [],
    }
  },
  methods: {
    ...mapActions({
      'showModal': 'showModal',
      'hideModal': 'hideModal',
    }),
    // 处理翻页
    handlePageChange: function ({page}) {
      this.fetchPage({page});
    },

    // 处理导出
    processExport: function () {
      this.showModal({
        message: '是否确认导出当前页选中数据？',
        onConfirm: () => {
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


    async fetchPage({page = this.pagination.currentPage, query = this.conditionForm}) {
      this.searchLoading = true;

      try {
        if (page === undefined || page === null) {
          console.error('page需要传值')
          return;
        }
        const {userId} = this.$store.state.user;
        const req = {
          id: userId,
          type: this.pageType,
          currentPage: page,
          username: '',
          ...query,
        };
        let res = {};
        if (this.pageType === PageTypeEnum.OPEN) {
          delete req.type;
          req.userId = this.userId;
          req.username = this.username;
          res = await getOpenHistoryList(req);
        } else {
          res = await getHistoryList(req);
        }

        const {success, detail} = res;
        if (!success) {
          alert('getHistoryList接口报错');
          return;
        }
        let formatList = [];
        detail.map(item => {
          const {
            deviceName,
            starttime,
            time,
            ch4: concentration,
            id,
            resolve,
            nickname,
            status,
            type: openStatusType,
            typeId,
          } = item;
          // 两个页面的字段不统一，所以使用这样的方法进行覆盖
          let resRefactor = {};
          switch (status) {
            case '报警':
              resRefactor = this.alertListRefactor(item);
              break;
            case '故障':
              resRefactor = this.faultListRefactor(item);
              break;
          }
          formatList.push({
            ...item,
            deviceName,
            time: starttime || time,
            concentration,
            id,
            nickname,
            resolve: resolve || 0,
            statusType: status || openStatusType,
            typeId,
            ...resRefactor,
          })
        });
        this.pagination = {
          ...this.pagination,
          currentPage: res.currentPage,
          total: res.allSize || 10,
          pageSize: res.pageSize || 10,
        };
        this.historyList = formatList;
      } catch (e) {
        console.error(e);
      } finally {
        setTimeout(() => {
          this.searchLoading = false;
        });
      }
    },

    // 显示详情弹窗
    async showFaultRecordDetail(record) {
      let {statusType} = record;
      console.log('record', record)
      let resRefactor = cloneDeep(record);
      if (this.pageType === PageTypeEnum.OPEN) {
        statusType = ALL_FAULT_STATUS_MAP[record.fault] || '故障';
        resRefactor = {
          ...resRefactor,
          resolve: 1,
          showOperateName: false,
        };
      }
      let curStatusType = statusType.includes('报警') ? ALERT : FAULT;
      if (statusType === '正常') {
        curStatusType = NORMAL;
      }
      const statusValMap = {
        [NORMAL]: 0,
        [FAULT]: 1,
        [ALERT]: 2,
      };
      resRefactor.statusType = statusValMap[curStatusType];
      console.log('statusType', resRefactor.statusType)
      this.$vModal({
        info: resRefactor,
        type: ModalPage(this.getCurDetailPage, curStatusType),
      });
    },

  },
  beforeDestroy() {
    clearInterval(this.timer)
  },

  mounted() {
    this.fetchPage({page: 1});
    if (this.pageType === PageTypeEnum.OPEN) {
      // const filterColumns = this.columns.filter((item) => !['状态类型'].includes(item.label));
      this.columns = [{
        label: '设备名称',
        key: 'nickname',
        width: '10%',
      }, ...this.columns.slice(1).filter(item => item.label !== '状态')];
    }
    // this.timer = setInterval(() => {
    //   this.fetchPage({page: 1});
    // }, 4000);
  },
  computed: {
    formatRows: function () {
      return this.historyList.map(value => {
        return {
          ...value,
        }
      })
    },
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
  }


}
</style>
