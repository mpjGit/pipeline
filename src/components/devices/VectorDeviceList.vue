<template>
  <div class="device-container">

    <div class="search-wrap">
      <div class="button-wrap" v-if="pageType === PageTypeEnum.OPEN">
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

    <div class="table-container">
      <TableComponent
          v-on:pageChange="handlePageChange"
          :columns="columns"
          :rows="formatRows"
          :on-selected-change="onSelectedChange"
          :total="pagination.total"
          :current-page="pagination.currentPage"
          :checkbox="pageType === PageTypeEnum.OPEN"
          :page-size="pagination.pageSize"/>
    </div>
    <!-- 设备信息弹窗 -->
    <Modal
        :visible="detailModalVisible"
        :onCloseTrigger="onModalCloseAction"
        class="modal"
        v-if="pageType === PageTypeEnum.OPEN"
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
        <div class="button-wrap" style="margin-bottom: 20px;">
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
import Vue from 'vue'
import Modal from "@/components/Modal";
import PageEventMixin from "@/mixins/pageEvent.mixin";
import formSearching from "@/mixins/formMixin/formSearch";
import {getDeviceList, getOpenDeviceList, getTrackPoint} from "@/api/apiHandler";
import {debounce} from "lodash-es";
import ValueGroup from "@/components/ValueGroup";
import UnitSelect from "../../components/UnitSelect";
import tableSelected from "@/mixins/tableSelected";
import {request} from "@/utils/http";
import {mapActions} from "vuex";

export default {
  name: "DeviceList",
  components: {
    TableComponent,
    Modal,
    ValueGroup,
    UnitSelect,
  },
  mixins: [PageEventMixin, formSearching, tableSelected],
  data: function () {
    return {
      selectImplementer: {name: 'Min'},
      // 基础数据信息
      columns: [{
        label: '设备名称',
        key: 'deviceName',
        width: '10%',
      },
        {
          label: '实时浓度',
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
          label: '光照强度',
          key: 'guangqiang',
          width: '10%',
        },
        {
          label: '温度',
          key: 'temperature',
          width: '10%',
          render: function (value) {
            return Vue.component('speed-block', {
              render: function (h) {
                return h('h2', value + ' ℃');
              }
            })
          }
        },
        {
          label: '状态',
          key: 'status',
          width: '10%',
          render: (value) => {
            const currentStatus = value;
            let statusType;
            switch (value) {
              case '在线':
                statusType = NORMAL;
                break;
              case '巡检中':
                statusType = WARN;
                break;
              case '离线':
                statusType = ERROR;
                break;
            }
            return Vue.component('dynamic', {
              render: function (h) {
                return h('div', {
                  attrs: {
                    class: `${statusType} status`
                  }
                }, [
                  h('span', currentStatus)
                ], '');
                //return `<div class="status ${currentStatus}"><span>${text}</span></div>`
              }
            })
          }
        },
      ],
      timer: null,
      // 设备列表
      deviceList: [],
      deviceDetail: null,
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
    if (this.pageType === PageTypeEnum.INVEHICLE) {
      this.columns.push(
          {
            label: '操作',
            key: 'operator',
            width: '10%',
            // eslint-disable-next-line no-unused-vars
            render: (value, row) => {
              return Vue.component('view-detail', {
                render: (h) => {
                  return h('span', {
                    on: {
                      click: () => {
                        this.showTrackPoint(row);
                      }
                    },
                    attrs: {
                      class: 'warning-text cursor-pointer'
                    }
                  }, '轨迹查看');
                }
              });
            }
          }
      )
    }
    if (this.pageType === PageTypeEnum.OPEN) {
      this.columns = [
        {
          label: '设备名称',
          key: 'nickname',
          width: '15%',
        },
        {
          label: '实时浓度',
          key: 'ch4',
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
          label: '光照强度',
          key: 'light',
          width: '10%',
        },
        {
          label: '位置',
          key: 'position',
          width: '20%',
        },
        {
          label: '生产日期',
          key: 'manuf_date',
          width: '10%',
        },
        {
          label: '状态',
          key: 'status',
          width: '10%',
          render: (value) => {
            const curStatus = this.ALL_FAULT_STATUS_MAP[value] || value;
            let statusType;
            switch (curStatus) {
              case '在线':
              case '正常':
              case String(value).includes('在线'):
                statusType = NORMAL;
                break;
              case '巡检中':
              case '故障':
              case String(value).includes('巡检中'):
                statusType = WARN;
                break;
              case '离线':
              case '报警':
              case String(value).includes('离线'):
              case '该设备未使用':
                statusType = ERROR;
                break;
            }
            return Vue.component('dynamic', {
              render: function (h) {
                return h('div', {
                  attrs: {
                    class: `${statusType} status`
                  }
                }, [
                  h('span', curStatus)
                ], '');
                //return `<div class="status ${currentStatus}"><span>${text}</span></div>`
              }
            })
          }
        },
      ];
    }
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
  },
  props: {
    pageType: {
      type: String,
      default: PageTypeEnum.INVEHICLE,
    },
  },
  methods: {
    ...mapActions({
      'fetchDeviceConfig': 'openDeviceConfig/fetchDeviceConfig',
      'fetchDevicesConfig': 'openDeviceConfig/fetchDevicesConfig',
      'clearConfigInfo': 'openDeviceConfig/clearConfigInfo'
    }),
    onImplementerChange: function ({value}) {
      this.selectImplementer.name = value;
    },
    onModalCloseAction: function () {
      this.clearConfigInfo();
    },
    // 获取设备设置信息
    handleDeviceSetting: function () {
      console.log('currentSelected', this.currentSelected)
      // 获取多个设备名称
      let selectedDevices = this.currentSelected.map(item => {
        return item.devicename;
      });
      this.fetchDevicesConfig(selectedDevices);
    },
    //设置设备信息
    handleSave: function () {
      // 准备上传配置信息
      const data = {
        username: this.username,
        devicename: this.deviceDetail.deviceName,
        low_alert: this.currentUnit.transBack(parseInt(this.deviceDetail.low_alert)), // 转换为vol值
        high_alert: this.currentUnit.transBack(parseInt(this.deviceDetail.high_alert)), // 转换为vol值
      };
      let deviceName = this.configDetailList.map(value => value.deviceName).filter(o => o != null);
      request.post('updateDeviceInfo', {
        ...data,
        devicename: deviceName
      }).then(() => {
        this.clearConfigInfo();
        this.fetchPageWithQuery();
      })
    },
    // 查询车载设备的标记点
    async showTrackPoint(rowData) {
      const {eventId, id} = rowData;
      const res = await getTrackPoint({eventId});
      const [firstPoint] = res;
      this.$store.commit('setDeviceTrackPoint', {data: res, id})
      const map = this.getMap();
      var point = new BMapGL.Point(Number(firstPoint.longitude), Number(firstPoint.latitude));
      map.centerAndZoom(point, 14);
      setTimeout(() => {
        map.centerAndZoom(point, 20);
      }, 1500)
      this.$bus.$emit('drawDeviceStatus');
      this.$router.push({
        path: 'map',
        query: {
          ...rowData,
        },
      }).then(() => {
      });
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
          user_id: this.$store.state.user.userId,
          type: this.pageType,
          currentPage: page,
          ...query,
        };
        let res = {};
        delete req.searchName;
        delete req.startTime;
        delete req.endTime;
        delete req.username;
        if (this.pageType === PageTypeEnum.OPEN) {
          delete req.type;
          req.userid = req.user_id;
          res = await getOpenDeviceList(req);
        } else {
          res = await getDeviceList(req);
        }
        const {success, detail} = res;
        if (!success) {
          alert('getDeviceList接口报错');
          return;
        }
        let formatList = [];
        detail.map(item => {
          const {
            concentration,
            deviceName,
            devicename,
            id,
            statusId,
            wendu,
            status,
            gygw_opens,
            eventId,
            tmpname: nickname,
          } = item;
          formatList.push({
            ...gygw_opens,
            ...item,
            id,
            deviceName: deviceName || devicename,
            concentration,
            // TODO：速度还没有返回
            temperature: wendu,
            status: statusId || status,
            deviceStatusType: statusId,
            eventId,
            nickname,
          })
        });

        this.pagination = {
          ...this.pagination,
          currentPage: res.currentPage,
          total: res.allSize || 10,
          pageSize: res.pageSize || 10,
        };
        this.deviceList = formatList;
      } catch (e) {
        console.error(e);
      } finally {
        this.searchLoading = false;
      }
    },
  },

  computed: {

    detailModalVisible: function () {
      return this.deviceDetail != null;
    },
    // 已加载的设备信息
    configDetail: function () {
      return this.$store.state.openDeviceConfig.configDetail;
    },

    // 已选中的所有设备信息
    configDetailList: function () {
      return this.$store.state.openDeviceConfig.configList;
    },

    // 已选中的所有设备名称
    deviceNames: function () {
      return this.configDetailList.map(value => value.deviceName).join(',');
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
    margin-right: 0.26rem;

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
      width: 100%;
    }
  }

  .table-container {
    width: 100%;
  }

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
