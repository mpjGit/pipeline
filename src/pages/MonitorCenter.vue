<template>
  <div class="monitor-center">
    
  </div>
</template>

<script>
// import Summary from "@/components/Summary";
// import NotificationBlock from "@/components/NotificationBlock";
import summaryMixin from "@/mixins/map/deviceSummary";
import refreshDeviceOnMapMixin from "@/mixins/refreshHoleDeviceOnMap";
import calculateDevices from "@/mixins/caculteDevices";
import { mapActions } from "vuex";

export default {
  name: "MonitorCenter",
  data: function () {
    return {
      timer: null
    }
  },
  components: {
    // NotificationBlock,
    // summaryBlock: Summary
  },
  mixins: [summaryMixin, refreshDeviceOnMapMixin, calculateDevices],

  beforeDestroy() {
    clearInterval(this.timer)
    clearInterval(this.timer1)
  },
  created() {
    this.$store.dispatch('updateFilterType', [PageTypeEnum.MONITOR]);
    this.refreshWarnList();
    this.refreshFaultList();
    this.refreshMileageWarnList();
    this.refreshMileageFaultList();
    this.refreshMonitorWarnFaultList();
    this.$store.dispatch('updateDeviceStatus');
    this.$store.dispatch('updateMileageDeviceStatus');
    this.$store.dispatch('updateNewDeviceStatus');
  },

  mounted() {
    // FIXME: 旧的要想好怎么适配
    // Promise.all([this.$store.dispatch('updateDeviceStatus'), this.$store.dispatch('updateNewDeviceStatus'), this.$store.dispatch('updateMileageDeviceStatus')]).then(() => {
    //   const deviceList = [...this.$store.state.device.devices, ...this.$store.state.device.mileageDevices, ...this.$store.state.device.newDevices];
    //   this.$bus.$emit('locationMap', {
    //     longitude: deviceList[0]?.position?.[0],
    //     latitude: deviceList[0]?.position?.[1],
    //   });
    // }).catch((error) => {
    //   console.log('an error occurred', error);
    // });
    // 由于默认是井上设备所以需要直接获取除了井上设备的设备

    this.timer = setInterval(() => {
      this.refreshWarnList();
      this.refreshFaultList();
      this.refreshMileageWarnList();
      this.refreshMileageFaultList();
      this.refreshMonitorWarnFaultList();
    }, 4 * 1000);

    this.timer1 = setInterval(() => {
      this.$store.dispatch('updateDeviceStatus');
      this.$store.dispatch('updateMileageDeviceStatus');
      this.$store.dispatch('updateNewDeviceStatus');
    }, 10 * 1000);



    // 当前组件展示通知的设备类型数组： 当前只展示井下设备(DOWNHOLE) 与 车载设备(INVEHICLE)
    //this.$store.dispatch('updateFilterType', [DOWNHOLE, INVEHICLE]);
  },

  methods: {
    ...mapActions({
      'refreshWarnList': 'notification/refreshWarnList',
      'refreshFaultList': 'notification/refreshFaultList',
      'refreshMileageWarnList': 'notification/refreshMileageWarnList',
      'refreshMileageFaultList': 'notification/refreshMileageFaultList',
      'refreshMonitorWarnFaultList': 'notification/refreshMonitorWarnFaultList',
      'muteAll': 'notification/muteAll'
    }),
  },
  computed: {}
}
</script>

<style scoped lang="less">
@import "../styles/common.less";

@buttonWidth: 0.58rem;
@radius: 0.1rem;
.monitor-center {
  padding: @padding;
  height: 100%;
  width: 100%;
  top: 0;
  box-sizing: border-box;
  @import "../styles/summary";


}
</style>
