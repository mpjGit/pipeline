<template>
  <div class="downhole-container">
    <transition name="fade">
      <router-view class="sub-content" :filterType="filterType"></router-view>
    </transition>
    <ButtonBlock :tabs="formatTabs" v-on="{clearInterval:clearInterval,interval:interval}"/>
  </div>
</template>

<script>
import summaryMixin from "@/mixins/summary";
import calculateDevices from "@/mixins/caculteDevices";
import ButtonBlock from "@/components/ButtonBlock";
import {mapActions} from "vuex";
import {defaultTabs} from "@/constant/tabConstant";

export default {
  name: "Mileage",
  data: function () {
    return {
      timer: null,
    }
  },
  components: {ButtonBlock},
  mixins: [summaryMixin, calculateDevices],
  beforeDestroy() {
    clearInterval(this.timer)
  },


  mounted() {
    this.$store.dispatch('updateMileageDeviceStatus');
    this.refreshMileageWarnList();
    this.refreshMileageFaultList();
    this.$store.dispatch('updateFilterType', [PageTypeEnum.MILEAGE]);
    this.interval();
    // this.timer = setInterval(() => {
    //   this.$store.dispatch('updateDeviceStatus');
    // }, 2000);
  },
  methods: {
    ...mapActions({
      'refreshMileageWarnList': 'notification/refreshMileageWarnList',
      'refreshMileageFaultList': 'notification/refreshMileageFaultList',
      'muteAll': 'notification/muteAll'
    }),
    clearInterval() {
      clearInterval(this.timer)
      console.log('调用了父组件方法')
    },

    interval() {
      this.timer = setInterval(() => {
        this.refreshMileageWarnList();
        this.refreshMileageFaultList();
        this.$store.dispatch('updateMileageDeviceStatus');
      }, 5000);
    }
  },
  computed: {
    formatTabs: function () {
      // eslint-disable-next-line no-unused-vars
      return defaultTabs.filter(o => {
        // // 地图模式下 隐藏 地图tab按钮
        // if(o.path === MAP && this.$route.path.endsWith(o.path)) {
        //   return false;
        // }
        // // 设备列表模式下 隐藏设备tab按钮
        // if(o.path === DEVICE && this.$route.path.endsWith(o.path)) {
        //   return false;
        // }

        return true;
      })
    }
  },
}
</script>

<style scoped lang="less">
@import "../styles/common";

.downhole-container {
  padding: @padding;
  height: 100%;
  width: 100%;
  top: 0;
  box-sizing: border-box;
}
</style>
