<template>
  <div class="history-container">
    <div class="function-wrap">
      <div class="button-wrap">
        <div class="button" v-bind:class="{active: hasSelected, disabled: !hasSelected}">
          <span>导出</span>
        </div>
      </div>

      <div class="search-wrap">
        <div class="input-wrap">
          <input placeholder="设备名称" />
        </div>

        <div class="input-wrap">
          <input placeholder="起始时间" type="date" />
        </div>

        <div class="input-wrap">
          <input placeholder="终止时间" type="date" />
        </div>
      </div>

    </div>

    <div class="table-container">

      <TableComponent
          :columns="columns"
          :rows="formatRows"
          :checkbox="true"
          :on-selected-change="onSelectedChange"
      />
    </div>

  </div>

</template>

<script>
import TableComponent from "@/components/Table";
import Vue from 'vue'

const settingIcon = require('../../assets/img/setting.svg');

export default {
  name: "HistoryList",
  components: {TableComponent},
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
                return h('h2', value+' %vol.m');
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
              }
            })
          }
        },
        {
          label: '操作',
          key: 'operator',
          width: '3%',
          // eslint-disable-next-line no-unused-vars
          render: (value) => {
            return Vue.component('test', {
              render: function(h){
                return h('img', {
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
      rows: [
        { id:1, name:"CT710", concentration: '0.2', status: NORMAL, operator: '张三', time: '2022.04.14 12:30:22'},
        { id:1, name:"CT710", concentration: '0.2', status: WARN, operator: '张三', time: '2022.04.14 12:30:22'},
        { id:1, name:"CT710", concentration: '0.2', status: WARN, operator: '张三', time: '2022.04.14 12:30:22'},
        { id:1, name:"CT710", concentration: '0.2', status: NORMAL, operator: '张三', time: '2022.04.14 12:30:22'},
        { id:1, name:"CT710", concentration: '0.2', status: WARN, operator: '张三', time: '2022.04.14 12:30:22'},
        { id:1, name:"CT710", concentration: '0.2', status: NORMAL, operator: '张三', time: '2022.04.14 12:30:22'},
        { id:1, name:"CT710", concentration: '0.2', status: WARN, operator: '张三', time: '2022.04.14 12:30:22'},
        { id:1, name:"CT710", concentration: '0.2', status: NORMAL, operator: '张三', time: '2022.04.14 12:30:22'},
        { id:1, name:"CT710", concentration: '0.2', status: NORMAL, operator: '张三', time: '2022.04.14 12:30:22'},
      ],

      currentSelected: [],
      timer: null
    }
  },
  methods: {
    onSelectedChange: function(value) {
      this.currentSelected = value;
    }
  },
  computed: {
    formatRows: function () {
      return this.rows.map(value => {
        return {
          ...value,
          className: value.status
        }
      })
    },
    hasSelected: function() {
      return this.currentSelected.length > 0;
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
  }


}
</style>
