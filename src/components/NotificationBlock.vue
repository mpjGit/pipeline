<template>
  <div class="notification-container">
    <!-- 按钮信息 -->
    <div class="notification-block">
      <div class="button" v-on:click="toggleNotificationBlock">
        <img src="@/assets/img/notification.svg"/>
      </div>
    </div>

    <transition name="slide-left-right">
      <div id="notification-list-container" class="notification-list-container" v-if="showNotificationBlock"
           v-bind:class="{inFullScreen}">
        <div class="action-part" v-if="hasNotification">
          <!-- 消音按钮 -->
          <div class="button" v-if="!inFullScreen" v-on:click="muteAll">
            全部消音
          </div>
          <!-- 全屏版本的消音按钮 -->
          <div class="button-fullscreen" v-else>
            <span>全部</span>
            <img v-if="true" src="../assets/img/sound.svg"/>
            <img v-else src="../assets/img/mute.svg"/>
          </div>
        </div>
        <div class="notification-list" v-bind:class="{inFullScreen}">
          <template v-if="!inFullScreen">
            <notification v-for="(notification, index) in formatNotificationList" :key="index"
                          :device-id="notification.deviceId"
                          :type="notification.type"
                          :device-type="notification.deviceType"
                          :field-list="notification.fieldList"
                          :device-name="notification.deviceName"
            />
          </template>
          <template v-else>
            <small-notification
                v-for="(notification, index) in formatNotificationList" :key="index"
                :device-id="notification.deviceId"
                :type="notification.type"
                :device-type="notification.deviceType"
                :field-list="notification.fieldList"
                :device-name="notification.deviceName"
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
import Notification from "@/components/Notification";
import calculateDevices from "@/mixins/caculteDevices";
import SmallNotification from "@/components/SmallNotification";
import {mapActions} from "vuex";
import {isFaultMsg, isWarnMsg} from "@/utils/tool";

export default {
  name: "NotificationBlock",
  props: {
    type: {
      type: Array,
      description: '用于筛选通知的类型：error,warn'
    },
    inFullScreen: {
      type: Boolean
    }
  },
  mixins: [calculateDevices],
  data: function () {
    return {
      showNotificationBlock: true,
    }
  },

  mounted() {
    if (this.filterType[0] === PageTypeEnum.MILEAGE) {
      this.refreshMileageWarnList();
      this.refreshMileageFaultList();
    } else if (this.filterType[0] === PageTypeEnum.MONITOR){
      this.refreshMileageWarnList();
      this.refreshMileageFaultList();
      this.refreshWarnList();
      this.refreshFaultList();
    } else {
      this.refreshWarnList();
      this.refreshFaultList();
    }
  },

  methods: {

    ...mapActions({
      'refreshWarnList': 'notification/refreshWarnList',
      'refreshFaultList': 'notification/refreshFaultList',
      'refreshMileageWarnList': 'notification/refreshMileageWarnList',
      'refreshMileageFaultList': 'notification/refreshMileageFaultList',
      'muteAll': 'notification/muteAll'
    }),
    // 显示消息通知
    toggleNotificationBlock: function () {
      this.showNotificationBlock = !this.showNotificationBlock;
    }
  },
  components: {
    SmallNotification,
    Notification
  },
  computed: {
    // 计算通知信息类型
    notificationList: function () {
      // combine all warn list and fault list
      // let warnList = this.$store.state.notification.warnList;
      // let faultList = this.$store.state.notification.faultList;
      // if (this.filterType[0] === PageTypeEnum.MONITOR) {
      const warnList = this.$store.state.notification.monitorData.downHoleWarn;
      const faultList = this.$store.state.notification.monitorData.downHoleFault;
      // }
      const downholeFaultList = faultList.map((value) => {
        let fieldList;
        let deviceType = DOWNHOLE;
        fieldList = [
          {
            name: '浓度',
            value: `${value.CH4}ppm.m`
          },
          {
            name: '故障内容',
            value: FAULT_MAP[value.fault]
          }
        ]
        return {
          deviceId: value.id || value.jid,
          deviceName: value.nickname || value.nickname,
          deviceType: deviceType,
          type: WARN,
          fieldList,
        }
      });
      const downholeWarnList = warnList.map(value => {
        let fieldList;
        let deviceType = DOWNHOLE;
        // 报警
        fieldList = [
          {
            name: '浓度',
            value: `${value.CH4}ppm.m`
          },
          {
            name: '信号强度',
            value: value.signal
          },
          {
            name: '电量',
            value: this.formatPower(value.power),
          },
          {
            name: '报警内容',
            value: FAULT_MAP[value.fault],
          },
        ]
        return {
          deviceId: value.id || value.jid,
          deviceName: value.nickname || value.nickname,
          deviceType: deviceType,
          type: ERROR,
          fieldList,
        }
      })
      const mileageWarn = this.$store.state.notification.monitorData.mileageWarn;
      const mileageFault = this.$store.state.notification.monitorData.mileageFault;
      const mileageWarnList = mileageWarn.map((value) => {
        let fieldList;
        let deviceType = PageTypeEnum.MILEAGE;
        // 报警
        fieldList = [
          {
            name: '浓度',
            value: `${value.CH4}ppm.m`
          },
          {
            name: '信号强度',
            value: value.signal
          },
          {
            name: '电量',
            value: this.formatPower(value.power),
          },
          {
            name: '报警内容',
            value: MILEAGE_FAULT_MAP[value.fault],
          },
        ]
        return {
          deviceId: value.id || value.jid,
          deviceName: value.nickname || value.nickname,
          deviceType: deviceType,
          type: ERROR,
          fieldList,
        }
      })
      const mileageFaultList = mileageFault.map((value) => {
        let fieldList;
        let deviceType = PageTypeEnum.MILEAGE;
        // 报警
        fieldList = [
          {
            name: '浓度',
            value: `${value.CH4}ppm.m`
          },
          {
            name: '故障内容',
            value: MILEAGE_FAULT_MAP[value.fault]
          }
        ]
        return {
          deviceId: value.id || value.jid,
          deviceName: value.nickname || value.nickname,
          deviceType: deviceType,
          type: WARN,
          fieldList,
        }
      })
      const allRes = [ ...downholeFaultList, ...downholeWarnList, ...mileageWarnList, ...mileageFaultList].filter(Boolean);
      return allRes;
    },


    formatNotificationList: function () {
      let notifications = this.notificationList;
      let pageType = null;
      if (this.filterType[0] === PageTypeEnum.MONITOR) {
        pageType = this.notificationTab;
      } else {
        pageType = this.filterType[0];
      }
      const transferDownhole = pageType === PageTypeEnum.DOWNHOLE ? DOWNHOLE : pageType;
      return notifications.filter(o => o.deviceType === transferDownhole);
    },

    hasNotification: function () {
      return this.formatNotificationList.length > 0;
    }


  }
}
</script>

<style scoped lang="less">
@import "../styles/common";

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
