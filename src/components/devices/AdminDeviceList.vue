<template>
  <div class="device-container">

    <div class="search-wrap">
      <div class="button-wrap">
        <div class="button"
             v-on:click="addDevice">
          <span>添加设备</span>
        </div>
      </div>
      <!--      <div class="input-wrap">-->
      <!--        <input placeholder="设备名称" v-model="conditionForm.deviceName"/>-->
      <!--      </div>-->
      <el-select v-model="selectedValue" placeholder="请选择" style="margin-right: 10px">
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>

    </div>


    <div class="table-container">
      <TableComponent :columns="columns" :rows="formatRows" v-on:pageChange="handlePageChange" :checkbox="false"
                      :total="pagination.total" :current-page="pagination.currentPage"
                      :page-size="pagination.pageSize"/>
    </div>
  </div>
</template>

<script>
import TableComponent from "@/components/Table";
import Vue from 'vue'
import PageEventMixin from "@/mixins/pageEvent.mixin";
import formSearching from "@/mixins/formMixin/formSearch";
import {getKaiLuDeviceList, getDownholeDeviceList, getMileageDeviceList, getAdminKailulist} from "@/api/apiHandler";
import {debounce} from "lodash-es";
import {mapActions} from "vuex";
import settingIcon from "@/assets/img/setting.svg";

export default {
  name: "DeviceList",
  components: {
    TableComponent
  },
  mixins: [PageEventMixin, formSearching],
  data: function () {
    return {
      selectedValue: PageTypeEnum.OPEN,
      options: [{
        value: PageTypeEnum.OPEN,
        label: '开路设备'
      }, {
        value: PageTypeEnum.DOWNHOLE,
        label: '无线智能终端'
      },
        {
          value: PageTypeEnum.MILEAGE,
          label: '里程桩设备'
        }
      ],
      // 基础数据信息
      columns: [],
      timer: null,
      // 设备列表
      deviceList: [],
      // 设备列表分页数据
      pagination: {
        currentPage: 1,
        total: 10,
        pageSize: 10,
      },
    };
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  created() {
    this.$store.dispatch('updateFilterType', [PageTypeEnum.OPEN]);
  },
  mounted() {
    this.debounceFetchPage = debounce(this.fetchPage, 200, {leading: true});
    this.fetchPage({});
    this.timer = setInterval(() => {
      if (!this.searchLoading) {
        this.fetchPage({});
      }
    }, 6000);
  },
  props: {
    pageType: {
      type: String,
      default: PageTypeEnum.INVEHICLE,
    },
  },
  methods: {
    ...mapActions({
      'fetchPage': 'downholeList/fetchPage',
      'fetchDeviceConfig': 'downholeDeviceConfig/fetchDeviceConfig',
      'fetchDevicesConfig': 'downholeDeviceConfig/fetchDevicesConfig',
      'clearConfigInfo': 'downholeDeviceConfig/clearConfigInfo'
    }),
    updateDevice(row) {
      console.log('updateDevice', row)
      if (this.selectedValue === PageTypeEnum.OPEN) {
        this.$vModal({
          info: row,
          type: ModalActionEnum.UPDATE_DEVICE_KAILU,
        });
      } else if (this.selectedValue === PageTypeEnum.DOWNHOLE) {
        this.$vModal({
          info: row,
          type: ModalActionEnum.UPDATE_DEVICE_JINGXIA,
        });
      } else if (this.selectedValue === PageTypeEnum.MILEAGE) {
        this.$vModal({
          info: row,
          type: ModalActionEnum.UPDATE_DEVICE_MILEAGE,
        });
      }
    },
    addDevice() {
      if (this.selectedValue === PageTypeEnum.OPEN) {
        this.$vModal({
          // 空对象是一定要传的，要不有缓存数据
          info: {},
          type: ModalActionEnum.ADD_DEVICE_KAILU,
        });
      } else if (this.selectedValue === PageTypeEnum.DOWNHOLE) {
        this.$vModal({
          info: {},
          type: ModalActionEnum.ADD_DEVICE_JINGXIA,
        });
      } else if (this.selectedValue === PageTypeEnum.MILEAGE) {
        this.$vModal({
          info: {},
          type: ModalActionEnum.ADD_DEVICE_MILEAGE,
        });
      }
    },
    sequencePromise(arr) {
      const pro = arr.shift()
      if (pro) {
        pro().then(() => {
          this.sequencePromise(arr)
        })
      }
    },
    // 翻页动作处理
    handlePageChange: function (ev) {
      const {
        page
      } = ev;
      this.pagination.currentPage = page;
      this.debounceFetchPage({page});
    },
    // 获取页面数据
    async fetchPage({page = this.pagination.currentPage, query = this.conditionForm}) {
      this.searchLoading = true;
      try {
        if (page === undefined || page === null) {
          console.error('page需要传值')
          return;
        }
        const req = {
          currentPage: page,
        };
        let res = {};
        if (this.selectedValue === PageTypeEnum.OPEN) {
          res = await getAdminKailulist(req);
          const {success} = res;
          if (!success) {
            alert('getDeviceList接口报错');
            return;
          }

        } else if (this.selectedValue === PageTypeEnum.DOWNHOLE) {
          res = await getDownholeDeviceList({
            ...query,
            currentPage: page,
          });
        } else if (this.selectedValue === PageTypeEnum.MILEAGE) {
          res = await getMileageDeviceList({
            ...query,
            currentPage: page,
          });
        }
        this.pagination = {
          ...this.pagination,
          currentPage: res.currentPage || 1,
          total: res.allSize || 10,
          pageSize: res.pageSize || 10,
        };
        this.deviceList = res.detail || [];
      } catch (e) {
        console.error(e);
      } finally {
        this.searchLoading = false;
      }
    },
  },

  watch: {
    selectedValue: {
      handler(val) {
        this.fetchPage({ page: 1 });
        this.columns = [
          {
            label: '设备名称',
            key: 'devicename',
            width: '5%',
          },

          {
            label: '设备注册地址',
            key: 'position',
            width: '10%',
          },
          {
            label: '经纬度',
            key: 'lalala',
            width: '10%',
            render: (value, row) => {
              return Vue.component('dynamic', {
                render: function (h) {
                  return h('div', {}, [
                    h('span', `(${row.longitude},${row.latitude})`)
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
                        this.updateDevice(row)
                      }
                    }
                  }, [], '');
                }
              });
            }
          }
        ];
      },
      immediate: true,
    },
  },

  computed: {
    hasSelected: function () {
      return this.currentSelected.length > 0;
    },
    formatRows: function () {
      return this.rows.map(value => {
        return {
          ...value,
          // className: value.status
        }
      })
    },
    // 设备列表
    rows: function () {
      return this.deviceList;
    },

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
      width: 100%;
      .button;
      margin-left: 10px;
      margin-bottom: @padding;
    }
  }

  .table-container {
    width: 100%;
  }

}

::v-deep {
  .table-wrap .table-body {
    max-height: 8.1rem;
  }
}

</style>
