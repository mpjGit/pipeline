<template>

  <div class="table-wrap">
    <div class="table-head">
      <div class="table-row">

        <!-- checkbox 部分 -->
        <div class="table-cell" v-if="checkbox">
          <div class="checkbox-wrap">
            <div class="checkbox" v-on:click="onSelectAllClick()" v-bind:class="{checked: isAllSelected}">
            </div>
            <span>全选</span>
          </div>
        </div>

        <div class="table-cell" v-for="(column ,index) in columns" :key="index"
             :style="'width:' + column.width">
          <span>{{ column.label }}</span>
        </div>

      </div>
    </div>

    <div class="table-body">

      <div :class="'table-row ' + getRowClassType(row)" v-for="(row, index) in rows" :key="index">

        <!-- checkbox -->
        <div class="table-cell" v-if="checkbox">
          <div class="checkbox-wrap">
            <div class="checkbox" v-on:click="onItemCheckBoxClick(row, index)"
                 v-bind:class="{checked: isSelected(row) !== false}"></div>
            <span style="opacity: 0">选择</span>
          </div>
        </div>

        <div class="table-cell" v-for="(field, idx) in columns" :key="idx" :style="'width:' + field.width">
          <div v-if="field.hasOwnProperty('render')">
            <component :id="`${field.key}-${index}`" :is="field.render(row[field.key], row)"/>
          </div>
          <div v-else :id="`${field.key}-${index}`">
            {{ row[field.key] }}
          </div>
        </div>
      </div>

    </div>
    <div class="table-footer">
      <div class="pagination-container">
        <div class="page-item prev" v-bind:class="{visibilityH: !prevPageAvailable}"
             v-on:click="handlePageChange(currentPage-1)">
          <span>上一页</span></div>
        <div v-on:click="handlePageChange(item)" class="page-item" v-for="(item, index) in displayPageRange"
             v-bind:key="index" v-bind:class="{active: currentPage === item}">
          <span>{{ item }}</span>
        </div>
        <div class="page-item next" v-bind:class="{visibilityH: !nextPageAvailable}"
             v-on:click="handlePageChange(currentPage+1)">
          <span>下一页</span></div>
        <div class="page-item choose" v-bind:class="{visibilityH: !nextPageAvailable}">
          <input type="number" placeholder="选择页数" v-model="pages"
            style="background: rgba(0, 0, 0, 0);
            border: 0px;
            color: white;
            text-align: center;
            list-style: none;
            padding-left: 15px;"></div>
        <div class="page-item next" v-bind:class="{visibilityH: !nextPageAvailable}"
             v-on:click="handlePageChange(Number(pages))">
          <span>确认</span></div>
      </div>

    </div>
  </div>

</template>

<script>
export default {
  name: "TableComponent",
  props: {
    columns: {
      type: Array,
      require: true
    },
    rows: {
      type: Array,
      require: true
    },
    checkbox: {
      type: Boolean,
      default: function () {
        return false;
      }
    },

    onSelectedChange: {
      type: Function
    },
    total: {
      type: Number,
      default: 100
    },
    pageSize: {
      type: Number,
      default: 10
    },
    currentPage: {
      type: Number,
      default: 20
    }

  },
  data: function () {
    return {
      selectedItem: [],
      pages: 1,
      maxDisplayPageSize: 5
    }
  },
  mounted() {
    console.log(this.currentPage);
  },
  methods: {
    // 选择动作
    onItemCheckBoxClick: function (item, index) {
      if (this.isSelected(item) !== false) {
        this.selectedItem.splice(this.isSelected({ ...item, index }), 1);
      } else {
        this.selectedItem.push({ ...item, index });
      }
    },
    isSelected: function (item) {
      for (let i = 0; i < this.selectedItem.length; i++) {
        if (this.selectedItem[i].id === item.id) {
          return i;
        }
      }
      return false;
    },
    onSelectAllClick: function () {
      let selectedRow = [];
      if (this.selectedItem.length < this.rows.length || this.selectedItem.length == 0) {
        this.rows.map((value, index) => {
          selectedRow.push({ ...value, index });
        })
      }
      this.selectedItem = selectedRow;
    },

    //  翻页动作处理
    handlePageChange: function (page) {
      console.log("page :" + page)
      this.$emit('pageChange', {
        page
      });
    },
    // 获取行样式
    getRowClassType(row) {
      if (row.className) {
        return row.className;
      }
      const typeMap = {
        '报警': 'error',
        '故障': 'warn',
        // '离线': 'error',
        '巡检中': 'warn',
      }
      return typeMap[row.deviceStatusType] || '';
    },
  },
  computed: {
    isAllSelected: function () {
      if (this.rows.length === this.selectedItem.length) {
        for (let i = 0; i < this.rows.length; i++) {
          if (this.selectedItem.indexOf(this.rows[i]) < 0) {
            return false;
          }
        }
        return true;
      }
      return false;
    },

    // pagination associate
    totalPage: function () {
      return Math.ceil(this.total / this.pageSize);
    },
    paginationStartPage: function () {
      let startPage = 1;
      let halfOfMaxDisplayPageSize = Math.ceil(this.maxDisplayPageSize / 2);
      if (this.currentPage > halfOfMaxDisplayPageSize) {
        startPage = this.currentPage - halfOfMaxDisplayPageSize;
      }
      return startPage
    },
    displayPageRange: function () {
      let range = [];
      for (let i = 0; i < this.maxDisplayPageSize && (i + this.paginationStartPage) <= this
          .totalPage; i++) {
        range.push(i + this.paginationStartPage);
      }
      return range;
    },
    nextPageAvailable: function () {
      return !(this.currentPage > (this.totalPage - 1));
    },
    prevPageAvailable: function () {
      console.log(this.currentPage)
      return !(this.currentPage <= 1);
    }
  },
  watch: {
    selectedItem: function (cur) {
      this.onSelectedChange && this.onSelectedChange(cur)
    }
  }


}
</script>

<style scoped lang="less">
@import "../styles/common";

.visibilityH {
  visibility: hidden;
}

.table-wrap {
  box-sizing: border-box;
  width: 100%;
  height: calc(100vh - @padding - @navButtonSize - @padding);
  display: flex;
  flex-direction: column;

  .table-head {
    width: 100%;
    display: flex;
    flex-direction: column;

    .table-row {
      background: transparent;
      padding-right: 42px;
    }
  }

  .table-row {
    width: 100%;
    display: flex;
    flex-direction: row;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 0.1rem;
    margin-bottom: 0.12rem;
    padding-left: 0.24rem;
    padding-right: 0.24rem;
    box-sizing: border-box;

    .table-cell {
      flex-grow: 1;
      flex-shrink: 0;
      height: 0.6rem;
      line-height: 0.6rem;
      font-size: 0.16rem;
      text-align: center;

      .checkbox-wrap {
        display: flex;
        flex-direction: row;
        height: 100%;
        align-items: center;
        justify-content: flex-start;

        .checkbox {
          margin-right: 0.05rem;
          width: 0.14rem;
          cursor: pointer;
          height: 0.14rem;
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 0.02rem;

          &.checked {
            background-color: rgba(255, 135, 49, 1);
            background-image: url("../assets/img/check.png");
            background-repeat: no-repeat;
            border-color: transparent;
            background-size: 80%;
            background-position: center;
          }
        }
      }

      // 需要使用deep 来进行深层绑定
      /deep/ .status {
        &.normal {
          color: @normalColor;

          &:before {
            vertical-align: middle;
            content: '';
            display: inline-block;
            width: 0.14rem;
            height: 0.14rem;
            border-radius: 50%;
            background-color: @normalColor;
            border: 0.02rem solid #007E7E;
            box-sizing: border-box;
            margin-right: 0.05rem;
          }
        }

        &.warn {
          color: @warnColor;

          &:before {
            vertical-align: middle;
            content: '';
            display: inline-block;
            width: 0.14rem;
            height: 0.14rem;
            border-radius: 50%;
            background-color: @warnColor;
            border: 0.02rem solid #CE8F10;
            box-sizing: border-box;
            margin-right: 0.05rem;
          }
        }

        &.error {
          color: @errorColor;


          &:before {
            vertical-align: middle;
            content: '';
            display: inline-block;
            width: 0.14rem;
            height: 0.14rem;
            border-radius: 50%;
            background-color: @errorColor;
            border: 0.02rem solid #C12121;
            box-sizing: border-box;
            margin-right: 0.05rem;
          }
        }

        span {
          vertical-align: middle;
        }
      }

      .icon {
        width: 0.15rem;
        height: 0.15rem;
        cursor: pointer;
        // margin-left: 20px;
      }
    }

    //  根据不同的状态显示不同的背景
    &.warn {
      background: linear-gradient(90deg, #FFB52188 0%, rgba(255, 181, 33, 0) 100%);
    }

    &.error {
      background: linear-gradient(90deg, #FA515188 0%, rgba(250, 81, 81, 0) 96%);
    }
  }

  .table-body {
    flex-grow: 1;
    flex-shrink: 1;
    overflow-y: scroll;
    width: 100%;
    display: flex;
    flex-direction: column;
    // margin-bottom: 0.5rem;
    height: 6.10rem;
    max-height: 6.10rem;
  }


  .table-footer {
    height: 1rem;

    .pagination-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      padding-top: 0.2rem;

      .page-item {
        min-width: 0.35rem;
        cursor: pointer;
        width: auto;
        padding-left: 0.05rem;
        padding-right: 0.05rem;
        height: 0.4rem;
        border: 1px solid white;
        border-radius: 0.05rem;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 0.1rem;
        margin-right: 0.1rem;

        &.active {
          background-color: black;
          color: white;
          border: 1px solid black;
          cursor: auto;
        }
      }
    }
  }
}
</style>
