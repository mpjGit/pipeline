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
import updateDeviceSignOnMap from "@/mixins/updateDeviceSignOnMap";
import calcNewDevices from "@/mixins/calcNewDevices";
import ButtonBlock from "@/components/ButtonBlock";
import {mapActions} from "vuex";
import {defaultTabs} from "@/constant/tabConstant";


export default {
  name: "InvehicleDevice",
  components: {ButtonBlock},
  data: function ( ){
    return {
      timer: null
    };
  },
  mixins: [updateDeviceSignOnMap, calcNewDevices],
  beforeDestroy() {
    // console.log("从车载设备主页离开")
    clearInterval(this.timer)
  },
  mounted() {
    this.$store.dispatch('updateNewDeviceStatus');
    this.$store.dispatch('updateFilterType', [PageTypeEnum.INVEHICLE]);
    this.interval();

  },
  methods: {
    ...mapActions({
      'refreshNewWarnFaultList': 'notification/refreshNewWarnFaultList',
      'muteAll':          'notification/muteAll'
    }),
    clearInterval(){
      clearInterval(this.timer)
      console.log('调用了父组件方法')
    },

    interval(){
      this.refreshNewWarnFaultList();
      this.$store.dispatch('updateNewDeviceStatus');
      this.timer = setInterval(() => {
        this.refreshNewWarnFaultList();
        this.$store.dispatch('updateNewDeviceStatus');
      }, 4000);
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
@import "../../styles/common.less";
.invehicle-container {
  padding: @padding;
  height: 100%;
  width: 100%;
  top: 0;
  box-sizing: border-box;
  @import "../../styles/summary";
}
</style>
