<template>
  <div class="invehicle-container">
    <router-view class="sub-content" :filterType="filterType"></router-view>
    <ButtonBlock
        :tabs="formatTabs"
        v-on="{clearInterval:clearInterval,interval:interval}"
    />
<!--    <NotificationBlock :type="filterType" />-->
  </div>
</template>

<script>
import refreshDeviceOnMapMixin from "@/mixins/refreshHoleDeviceOnMap";
import calculateDevices from "@/mixins/caculteDevices";
import ButtonBlock from "@/components/ButtonBlock";
import {mapActions} from "vuex";
import {defaultTabs} from "@/constant/tabConstant";


export default {
  name: "InVehicle",
  components: {ButtonBlock},
  data: function ( ){
    return {
      timer: null
    };
  },
  mixins: [refreshDeviceOnMapMixin, calculateDevices],
  beforeDestroy() {
    // console.log("从车载设备主页离开")
    clearInterval(this.timer)
  },
  mounted() {
    this.$store.dispatch('updateDeviceStatus');
    this.$store.dispatch('updateFilterType', [INVEHICLE]);
    this.interval();

  },
  methods: {
    ...mapActions({
      'refreshWarnList' : 'notification/refreshWarnList',
      'refreshFaultList': 'notification/refreshFaultList',
      'muteAll':          'notification/muteAll'
    }),
    clearInterval(){
      clearInterval(this.timer)
    },

    interval(){
      this.timer = setInterval(() => {
        this.refreshWarnList();
        this.refreshFaultList();
        this.$store.dispatch('updateDeviceStatus');
      }, 2000);
    }
  },
  computed: {
    formatTabs: function () {
      // eslint-disable-next-line no-unused-vars
      return defaultTabs.filter(o=>true)
    }
  },

}
</script>

<style scoped lang="less">
@import "../styles/common.less";
.invehicle-container {
  padding: @padding;
  height: 100%;
  width: 100%;
  top: 0;
  box-sizing: border-box;
  @import "../styles/summary";
}
</style>
