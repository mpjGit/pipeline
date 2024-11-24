<template>
  <div class="map-container"
       id="map-container"
       v-bind:class="{fullscreen: isFullScreen}"
       @fullscreenchange="fullScreenChange"
  >
    <div class="map" id="map" v-bind:class="{blurMap: blurMap}"></div>
    <img v-if="isFullScreen" class="fullscreen-logo" src="../../assets/img/fullscreen_logo.png"/>
    <map-control v-bind:class="{blurMap: blurMap, avoidNav: navExpand}"/>

    <map-component
        v-if="username && useOldMap"
        v-bind:class="{blurMap: blurMap, avoidNav: navExpand}"
        :avoid-nav="navExpand"
        :isFullScreen="isFullScreen"
    />

    <map-monitor-component v-if="username && filterType[0] === PageTypeEnum.MONITOR"
                           v-bind:class="{blurMap: blurMap, avoidNav: navExpand}"
                           :avoid-nav="navExpand"
                           :isFullScreen="isFullScreen"
    ></map-monitor-component>

    <map-new-component v-else-if="username && !(useOldMap)"
                       v-bind:class="{blurMap: blurMap, avoidNav: navExpand}"
                       :avoid-nav="navExpand"
                       :isFullScreen="isFullScreen"
    ></map-new-component>

    <template v-if="isFullScreen">
      <MileageAlert/>
      <MileageFault/>
      <DownholeAlert/>
      <DownholeFault/>
      <InvehicleAlert/>
      <InvehicleFault/>
    </template>
  </div>
</template>

<script>
import MapControl from "@/components/MapControl";
import InvehicleAlert from "@/components/modals/InvehicleAlert.vue";
import InvehicleFault from "@/components/modals/InvehicleFault.vue";
import DownholeAlert from "@/components/modals/DownholeAlert.vue";
import DownholeFault from "@/components/modals/DownholeFault.vue";
import MileageAlert from "@/components/modals/MileageAlert.vue";
import MileageFault from "@/components/modals/MileageFault.vue";
import MapNewComponent from "@/components/map/MapNewComponent.vue";
import MapComponent from "@/components/MapComponent.vue";
import MapMonitorComponent from "@/mixins/monitor/MapMonitorComponent.vue";

export default {
  name: "globalMap.vue",
  components: {
    MapControl,
    InvehicleAlert,
    InvehicleFault,
    DownholeAlert,
    DownholeFault,
    MileageAlert,
    MileageFault,
    MapNewComponent,
    MapComponent,
    MapMonitorComponent,
  },
  props: {
    avoidNav: Boolean,
    blurMap: Boolean,
    navExpand: Boolean,
  },
  computed: {
    filterType: function () {
      return this.$store.state.device.filterType;
    },
    useOldMap() {
      return this.filterType[0] === 'downhole' || this.filterType[0] === PageTypeEnum.MILEAGE;
    },
  },
  beforeDestroy() {
  },
  mounted: function () {
    this.initMap();
  },
  mixins: [],
  methods: {
    turnToDeviceList(e) {
      console.log('e', e)
      if ((Object.keys(window.globalCustomData).length === 0)) {
        this.toast('请选择一个设备');
        return;
      }
      if (!this.$route.path.includes('downhole')) {
        this.toast('目前只支持井下设备跳转详情');
        return;
      }
      let sortRes = [];
      Object.keys(window.globalCustomData).forEach((key) => {
        sortRes.push(window.globalCustomData[key]);
      })
      sortRes = sortRes.sort((before, after) => before.timeStamp > after.timeStamp);
      this.$router.push({
        path: '/downhole/device',
        query: {
          deviceName: sortRes.slice(-1)[0].deviceName,
        },
      });
    },
    initMap: function () {
      let map = new BMapGL.Map("map");
      // var menu = new BMapGL.ContextMenu();
      // var txtMenuItem = [
      // ];
      // for (var i = 0; i < txtMenuItem.length; i++) {
      //   menu.addItem(new BMapGL.MenuItem(txtMenuItem[i].text, txtMenuItem[i].callback, 0));
      // }
      // map.addContextMenu(menu);
      map.addEventListener('rightclick', () => {
        if (this.$router.currentRoute.path.includes('monitor')) {
          this.$store.dispatch('toast/showToast', {message: '监控中心不支持右键跳转'})
        }
      });
      // FIXME: 旧的要想好怎么适配
      Promise.all([this.$store.dispatch('updateDeviceStatus'), this.$store.dispatch('updateNewDeviceStatus'), this.$store.dispatch('updateMileageDeviceStatus')]).then(() => {
        let deviceList = [...this.$store.state.device.devices, ...this.$store.state.device.mileageDevices, ...this.$store.state.device.newDevices];
        if (this.filterType[0] !== PageTypeEnum.MONITOR) {
          deviceList = deviceList.filter((item) =>  this.filterType.indexOf(item.deviceType) > -1);
        }
        this.$bus.$emit('initMapLocation', {
          longitude: deviceList[0]?.position?.[0],
          latitude: deviceList[0]?.position?.[1],
        });
      }).catch((error) => {
        console.log('an error occurred', error);
      });
      // var point = new BMapGL.Point(114.064338, 22.535676);
      // map.centerAndZoom(point, 12);
      // setTimeout(() => {
      //   map.centerAndZoom(point, 15);
      // }, 1000)
      // map.enableScrollWheelZoom(true);
      // 灰色主题
      // map.setMapStyleV2({styleId: "be5a80c2bd327ed748452699714abc95"});
      this.setMap(map);
    },
    fullScreenChange: function () {
      this.$store.dispatch('updateFullScreenStatus');
    }
  }
}
</script>

<style scoped lang="less">

@import "../../styles/common";

.map-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  &.fullscreen {
    .summary-wrap {
      padding-left: @padding !important;
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      grid-template-rows: repeat(2, 1fr);
    }
  }

  .fullscreen-logo {
    width: 3.24rem;
    height: auto;
    position: fixed;
    top: @padding;
    left: 50%;
    margin-left: calc(3.24rem / -2);
  }

  .notification-container {

  }

  .summary-wrap {
    padding: @padding;
    display: grid;
    width: fit-content;
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: 0.2rem;
    grid-row-gap: 0.2rem;
    transition: all 0.5s;

    &.avoidNav {
      padding-left: @navWidth + @padding;
    }
  }

}

#map {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: absolute;
}

</style>
