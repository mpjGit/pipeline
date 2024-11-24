<template>
  <div class="notification-container">
    <!-- 按钮信息 -->
    <div class="notification-block">
      <div class="button" v-on:click="toggleNotificationBlock">
        <img src="@/assets/img/notification.svg"/>
      </div>
    </div>

    <transition name="slide-left-right">
      <div id="notification-list-container" class="notification-list-container" v-if="showNotificationBlock" v-bind:class="{inFullScreen}">
        <div class="action-part" v-if="hasNotification">
          <!-- 消音按钮 -->
          <div class="button" v-if="!inFullScreen" v-on:click="muteAll">
            全部消音
          </div>
          <!-- 全屏版本的消音按钮 -->
          <div class="button-fullscreen" v-else>
            <span>全部</span>
            <img v-if="true" src="../../assets/img/sound.svg"/>
            <img v-else src="../../assets/img/mute.svg"/>
          </div>
        </div>
        <div class="notification-list" v-bind:class="{inFullScreen}">
          <template v-if="!inFullScreen">
            <new-notification-item v-for="(notification, index) in formatNotificationList" :key="index"
                          :device-id="notification.deviceId"
                          :type="notification.type"
                          :device-type="notification.deviceType"
                          :field-list="notification.fieldList"
                          :device-name="notification.nickname || notification.devicename"
                          :dataItem="notification.data"
            />
          </template>
          <template v-else>
            <new-small-notification
                v-for="(notification, index) in formatNotificationList" :key="index"
                :device-id="notification.deviceId"
                :type="notification.type"
                :device-type="notification.deviceType"
                :field-list="notification.fieldList"
                :device-name="notification.nickname || notification.deviceName"
                :dataItem="notification.data"
            />
          </template>

          <div v-if="!hasNotification" class="empty-list">
            暂无通知
          </div>
        </div>
      </div>
    </transition>
    <!--  通知信息结束 -->
  </div>

</template>

<script>
import NewNotificationItem from "@/components/map/NewNotificationItem.vue";
import NewSmallNotification from "@/components/map/NewSmallNotification";
import {mapActions} from "vuex";

export default {
  name: "NewNotificationBlock",
  props: {
    type: {
      type: Array,
      description: '用于筛选通知的类型：error,warn'
    },
    inFullScreen: {
      type: Boolean
    }
  },
  data: function () {
    return {
      showNotificationBlock: true,
    }
  },

  mounted() {
    if (this.isMonitorPage) {
      this.refreshMonitorWarnFaultList();
      return;
    }
    this.refreshNewWarnFaultList();
  },
  watch: {
    type() {
      if (this.isMonitorPage) {
        this.refreshMonitorWarnFaultList();
        return;
      }
      this.refreshNewWarnFaultList();
    },
  },
  methods: {
    ...mapActions({
      'refreshNewWarnFaultList': 'notification/refreshNewWarnFaultList',
      'refreshMonitorWarnFaultList': 'notification/refreshMonitorWarnFaultList',
      'muteAll': 'notification/muteAll'
    }),
    // 显示消息通知
    toggleNotificationBlock: function () {
      this.showNotificationBlock = !this.showNotificationBlock;
    }
  },
  components: {
    NewSmallNotification,
    NewNotificationItem,
  },
  computed: {
    isMonitorPage() {
      return this.filterType[0] === PageTypeEnum.MONITOR;
    },

    // 计算通知信息类型
    notificationList: function () {
      // combine all warn list and fault list
      let warnList = this.$store.state.notification.monitorData.otherWarn;
      let faultList = this.$store.state.notification.monitorData.otherFault;
      let filterType = this.filterType[0];
      if (this.isMonitorPage) {
        filterType = this.$store.state.device.notificationTab;
      }
      const warnListFilter = warnList.filter((item) => item.type === filterType);
      const faultListFilter = faultList.filter((item) => item.type === filterType);
      let allNotification = [].concat(warnListFilter).concat(faultListFilter);
      return allNotification.map(value => {
        let fieldList;

        const deviceType = value.type;


        // 报警
        if (deviceType === PageTypeEnum.INVEHICLE) {
          // 车载设备
          fieldList = [
            {
              name: '浓度',
              value: `${value.ch4}ppm.m`
            },
            {
              name: '车速',
              value: `${value.nospeed}km/h`
            },
            {
              name: '温度',
              value: `${value.temperature}℃`
            },
            {
              name: '报警内容',
              value: '浓度预警'
            }
          ]
        }


        if (deviceType === PageTypeEnum.OPEN) {
          fieldList = [
            {
              name: '时间',
              value: value.time,
            },
            {
              name: '浓度',
              value: `${value.ch4}ppm.m`,
            },
            {
              name: '类型',
              value: value.fault
            },
          ]
        }

        if (deviceType === PageTypeEnum.HAND) {
          fieldList = [
            {
              name: '浓度',
              value: `${value.ch4}ppm.m`,
            },
            {
              name: '光线强度',
              value: value.lightIntensity,
            },
            {
              name: '温度',
              value: `${value.temperature}℃`
            },
            {
              name: '报警内容',
              value: '浓度预警'
            }
          ]
        }
        if(value.status === '故障') {
          fieldList = [
            {
              name: '浓度',
              value: `${value.ch4 || value.CH4 || 0}ppm.m`
            },
            {
              name: '故障内容',
              value: FAULT_MAP[value.fault || 1],
            }
          ]
        }
        return {
          deviceId: value.id,
          deviceName: value.deviceName || value.devicename,
          devicename: value.deviceName || value.devicename,
          deviceType: value.type,
          nickname: value.nickname,
          type: value.statusType,
          fieldList,
          data: value,
        }
      })
    },

    filterType() {
      return this.$store.state.device.filterType;
    },

    formatNotificationList: function () {
      let notifications = this.notificationList;
      return notifications.filter(o => true)
    },

    hasNotification: function () {
      return this.formatNotificationList.length > 0;
    }


  }
}
</script>

<style scoped lang="less">
@import "../../styles/common";

@radius: 0.1rem;
.notification-block {
  pointer-events: visible;
  position: absolute;
  z-index: 24;

  top: @padding;
  right: @padding;

  .button {
    cursor: pointer;
    width: @navButtonSize;
    height: @navButtonSize;
    border-radius: 50%;
    background-color: white;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    img {
      width: 0.24rem;
      height: 0.24rem;
      object-position: center;
      object-fit: contain;
    }
  }
}

.notification-list-container {
  pointer-events: visible;
  position: absolute;
  z-index: 21;
  right: @padding;
  width: auto;
  max-height: calc(100vh - @navButtonSize - @padding - @padding - 3rem);
  display: flex;
  flex-direction: column;
  border-radius: @radius;
  height: auto;
  color: white;
  background-color: rgba(42, 54, 68, 0.3);
  top: @padding + @navButtonSize + @padding + 0.8rem;
  .action-part {
    flex-shrink: 0;
    padding: 0.2rem;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    box-sizing: border-box;

    .button {
      cursor: pointer;
      font-size: 0.16rem;
      color: rgba(255, 255, 255, 1);
      width: 1.48rem;
      height: 0.44rem;
      border-radius: 0.22rem;
      background-color: rgba(42, 54, 68, 0.3);
      text-align: center;
      line-height: 0.44rem;

      &.inFullScreen {
        width: auto;
        padding: 0;
      }
    }

    .button-fullscreen {
      font-size: 0.12rem;
      background: rgba(42, 54, 68, 0.3);
      border-radius: 0.22rem;
      height: 0.44rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      padding: 0.1rem;
      box-sizing: border-box;
      width: auto;

      span {
        margin-right: 0.06rem;
      }
    }
  }

  .notification-list {
    overflow-y: scroll;
    flex: 1;
    padding: @padding/2;

    .notification-item {
      margin: 0 auto;
      margin-bottom: 0.13rem;
    }

    &.inFullScreen {
      padding: 0;
    }
  }

  .empty-list {
    text-align: center;
    padding: @padding;
    font-size: 0.18rem;
  }

  //  全屏情况下的样式修正
  &.inFullScreen {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    margin-right: -@padding;
  }


}
</style>
