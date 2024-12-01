<template>
  <div class="homeContainer">
    <!-- 全局地图组件 -->
    <global-map :blurMap="blurMap" :navExpand="navExpand"></global-map>

    <!-- 左侧导航 -->
    <div class="left-nav" v-bind:class="{ expand: navExpand }">
      <div class="top-part">
        <!--<div class="logo-wrap">
          <img src="../assets/home/nav-logo.png" />
        </div>-->
        <div class="menu-wrap">
          <div
            class="menu-item"
            v-for="item in formatRoutes"
            :key="item.distinguish"
            :class="{ active: item.active }"
            @click="switchRoute(item.path, item.distinguish)"
          >
            <span class="hans">{{
              item.distinguish === "DEVICE_ALL"
                ? "监控中心"
                : deviceType_toStr(item.distinguish)
            }}</span>
            <span class="en">{{ item.createAt }}</span>
          </div>
        </div>
      </div>
      <div class="bottom-part">
        <div class="router-editor-wrap">
          <router-editor :routerList="routes"></router-editor>
        </div>
        <div class="info-wrap">
          <div class="avatar-wrap">
            <img src="../assets/img/avatar.png" />
          </div>

          <div class="username-wrap">
            <div
              class="dropdown-wrap"
              v-on:click="showUserMenu = !showUserMenu"
            >
              <div class="name ellipsis w-100">{{ username }}</div>
              <div class="dropdown"></div>
            </div>
            <div class="permission-wrap">管理员权限</div>
          </div>
        </div>
        <div class="menu-wrap" v-show="showUserMenu">
          <div class="menu-item" @click="updateUsername">修改用户名</div>
          <div class="menu-item" @click="updatePwd">修改密码</div>
          <div class="menu-item" @click="logout">退出登录</div>
        </div>
      </div>
      <!-- 收起按钮-->
      <div class="expand-button" v-on:click="navExpand = !navExpand">
        <img
          class="expand"
          v-bind:class="{ show: !navExpand }"
          src="@/assets/img/nav_expand.svg"
        />
        <img
          class="closed"
          v-bind:class="{ show: navExpand }"
          src="@/assets/img/nav_hide.svg"
        />
      </div>
    </div>

    <div
      class="sub-view"
      v-bind:class="{ expand: navExpand, 'blur-bg': blurMap }"
    >
      <router-view></router-view>
    </div>

    <div v-if="showTrackViewFlag" class="track-view track-view-top">
      <!--      <div class="img-container">-->
      <!--        <img src="@/assets/img/car-1.png" alt="">-->
      <!--      </div>-->
      <div class="text">当前设备：{{ curDeviceInfo.deviceName }}</div>
      <div class="text">巡检路线量：{{ eventList.length }}</div>
      <div @click="clearTrackView" class="text button">关闭巡检模式</div>
    </div>

    <div v-if="showTrackViewFlag" class="track-view track-view-list">
      <el-tooltip
        class="item"
        effect="dark"
        :content="item.startTime"
        placement="top"
        v-for="(item, key) in eventList"
        :key="key"
      >
        <div
          :class="['item', { 'item-active': curEvent.id === item.id }]"
          @click="changeEvent(item)"
        >
          第{{ eventList.length - key }}次巡检
        </div>
      </el-tooltip>
    </div>

    <transition
      name="fade"
      enter-active-class="animated tada"
      leave-active-class="animated bounceOutRight"
    >
      <div
        v-if="showTrackViewFlag && rightListShow"
        class="track-view track-view-right-list"
      >
        <div class="close-container">
          <i
            class="el-icon-close"
            style="cursor: pointer"
            @click="
              () => {
                rightListShow = false;
              }
            "
          ></i>
        </div>
        <div
          :class="['item', { 'item-active': trackPoint.id === item.id }]"
          @click="changeTrackPoint(item)"
          v-for="(item, key) in trackPointList"
          :key="key"
        >
          <div class="icon-container">
            <i class="el-icon-s-promotion"></i>
          </div>
          <div>浓度:{{ item.concentration }}ppm.m</div>
          <div>温度:{{ item.wendu }}℃</div>
          <div>车速:5km/h</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
// import MapControl from "@/components/MapControl";

import GlobalMap from "@/components/map/globalMap.vue";
import RouterEditor from "@/components/RouterEditor.vue";
import { debounce, once } from "lodash-es";
import { getEventList, getTrackPoint } from "@/api/apiHandler";
import { deviceType_toStr } from "@/utils/tool";
import index from "vuex";

export default {
  name: "Home",
  components: { RouterEditor, GlobalMap },
  props: {},
  data: function () {
    return {
      selected: false,
      navExpand: false, // true is close , false is open
      showUserMenu: false,
      showTrackViewFlag: false,
      routes: [],
      eventList: [],
      curEvent: {},
      trackPoint: {},
      rightListShow: false,
      trackPointList: [],
      curDeviceInfo: {},
      enterpriseUuid: this.$store.state.user.enterpriseUuid, // 请求id
    };
  },
  beforeDestroy() {
    this.$bus.$off("logout", this.logout);
    this.$bus.$off("showTrackView", this.showTrackView);
    this.clearMap();
  },
  watch: {
    async navExpand() {
      await this.$nextTick();
      setTimeout(() => {
        this.refreshTrackViewTop();
      }, 500);
    },
    $route: {
      handler(newVal) {
        this.showTrackViewFlag = Boolean(newVal?.query?.id);
        //判断newVal有没有值监听路由变化
        this.curDeviceInfo = newVal.query;
        if (this.showTrackViewFlag) {
          this.refreshTrackViewTop();
          return;
        }
        this.$store.commit("clearDeviceTrackPoint");
        this.$bus.$emit("drawDeviceStatus");
      },
      deep: true,
    },
  },
  created: async function () {
    this.$bus.$on("logout", this.logout);
    const onceLocationMap = once(this.locationMap);
    this.$bus.$on("locationMap", onceLocationMap);
    this.$bus.$on("initMapLocation", this.locationMap);
    // this.$once('hook:beforeDestory',()=>{
    //   this.$bus.$off('locationMap', onceLocationMap);
    //   this.$bus.$off('initMapLocation', this.locationMap);
    // })
    this.$bus.$on("showTrackView", this.showTrackView);
    this.$store.dispatch("updateDeviceShowProper");
    const refreshTrackViewTop = debounce(this.refreshTrackViewTop, 50);
    window.addEventListener("resize", refreshTrackViewTop);

    // 左侧列表的具体数据设置
    this.routes = await this.$store.dispatch("getUserRoutes");
  },
  mounted() {
    if (this.$route?.query?.id) {
      this.showTrackViewFlag = true;
      this.curDeviceInfo = this.$route.query;
      this.refreshTrackViewTop();
    }
    setTimeout(() => {
      this.refreshTrackViewTop();
    }, 500);
  },
  methods: {
    deviceType_toStr(type) {
      return deviceType_toStr(type);
    },
    locationMap({ longitude, latitude } = {}) {
      const userData = this.$store.state.user.data;
      const { lon, lat } = userData;
      if (!longitude || !latitude) {
        console.error("请传递正确的坐标值");
      }
      longitude = lon;
      latitude = lat;
      let map = this.getMap();
      var point = new BMapGL.Point(
        Number(longitude || 114.064338),
        Number(latitude || 22.535676)
      );
      map.centerAndZoom(point, 8);
      setTimeout(() => {
        map.centerAndZoom(point, 16);
      }, 1500);
      map.enableScrollWheelZoom(true);
    },
    clearTrackView() {
      this.showTrackViewFlag = false;
      this.$router.replace("map");
    },
    changeTrackPoint(val) {
      this.trackPoint = val;
      const { id: curClickId } = val;
      const { longitude, latitude } = val;

      let map = this.getMap();
      var point = new BMapGL.Point(Number(longitude), Number(latitude));
      if (this.$route.query.id) {
        const { id } = this.$route.query;
        const trackPointList = this.$store.getters["deviceTrackPoint"]?.[id];
        trackPointList.forEach((item) => {
          item.pointColor = null;
          if (item.id === curClickId) {
            item.pointColor = "blue";
          }
        });
        this.$store.commit("setDeviceTrackPoint", { data: trackPointList, id });
        this.$bus.$emit("drawDeviceStatus", {
          icon: POSITION_ICON,
        });
        map.centerAndZoom(point, 17);
      }
      setTimeout(() => {
        map.centerAndZoom(point, 20);
      }, 500);
    },
    async changeEvent(val) {
      this.rightListShow = false;
      this.trackPointList = [];
      this.curEvent = val;
      const { eventId } = val;
      const res = await getTrackPoint({ eventId });
      const { id } = this.$route.query;
      this.$store.commit("setDeviceTrackPoint", { data: res, id });
      this.$bus.$emit("drawDeviceStatus");
      this.trackPointList = res;
      if (!this.trackPointList?.length) {
        return;
      }
      this.rightListShow = true;
    },
    async refreshTrackViewTop(num = 1) {
      if (!this.showTrackViewFlag) {
        return;
      }
      const { detail } = await getEventList({
        userId: this.userId,
        deviceId: this.curDeviceInfo.deviceId,
      });
      this.eventList = detail;
      const rightConDom = document.querySelector(".right-container");
      if (!rightConDom) {
        num++;
        num < 10 && this.refreshTrackViewTop(num);
        return;
      }
      const trackViewList = document.querySelector(".track-view-list");
      trackViewList.style.left = "0.26rem";
      if (this.navExpand) {
        trackViewList.style.left = "2.66rem";
      }
      const summaryDom = document.querySelector(".summary-container");
      const selfDom = document.querySelector(".track-view-top");
      const rx = rightConDom.getBoundingClientRect().x;
      const sx = summaryDom.getBoundingClientRect().x;
      const sw = summaryDom.getBoundingClientRect().width;
      const selfWidth = selfDom.getBoundingClientRect().width;
      selfDom.style.transform = `translateX(${
        (rx + sw + sx) / 2 - selfWidth / 2
      }px)`;
    },
    showTrackView(data) {
      this.showTrackViewFlag = data;
    },
    switchRoute(path, distinguish) {
      const stopSwitchUrl = ["/404NotFound"];
      if (stopSwitchUrl.includes(path)) {
        alert("页面暂未开放");
        return;
      }
      path && this.$router.push({
        path,
        query: {
          type: distinguish
        }
      });
    },
    updateUsername() {
      alert("暂未开放功能");
    },
    updatePwd() {
      this.$vModal({
        type: ModalActionEnum.UPDATE_PWD,
      });
    },
    logout() {
      window.token = null;
      sessionStorage.clear();

      this.$store.commit("setUserInfo", {});
      this.$router.replace("/login");
      window.location.reload();
    },
  },
  computed: {
    index() {
      return index;
    },
    filterType: function () {
      return this.$store.state.device.filterType;
    },
    getShowRoutes() {
      return this.routes.filter((item) => !!item.distinguish);
    },
    blurMap: function () {
      return false;
      // return (this.currentPath.indexOf('map') < 0) && (this.currentPath.indexOf('monitor') < 0);
    },
    currentPath: function () {
      return this.$route.path;
    },
    formatRoutes: function () {
      const filterRoute = this.getShowRoutes.filter((item) => {
        // 如果是管理员才能看的模块，需要当前身份是管理员才可以查看
        if (item.isAdmin) {
          if (Number(this.isAdmin) === 1) {
            return true;
          }
          return false;
        }

        return true;
      });

      // 菜单高亮
      let foo = filterRoute.map((value) => {
        return {
          ...value,
          active: this.currentPath.startsWith(value.path),
        };
      });
      return foo;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "../styles/common.less";

* {
  box-sizing: border-box;
}

.homeContainer {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;

  .left-nav {
    width: @navWidth;
    z-index: 20;
    height: 100%;
    background: rgba(22, 22, 22, 1);
    position: absolute;
    left: 0;
    top: 0;
    font-size: 0.24rem;
    color: white;
    display: flex;
    flex-direction: column;

    .top-part {
      flex-grow: 1;

      .logo-wrap {
        margin: 0 auto;
        width: 100%;
        height: auto;
        padding-top: 0.26rem;
        padding-bottom: 0.26rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        img {
          width: 1.6rem;
          height: auto;
        }
      }

      .menu-wrap {
        width: 100%;

        .menu-item {
          cursor: pointer;
          width: 100%;
          height: 1rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          &.active {
            background-image: url("../assets/home/menu_active_bg.png");
            background-size: cover;

            .en {
              color: white;
              opacity: 1;
            }
          }

          .hans {
            font-size: 0.2rem;
            color: white;
            display: block;
            margin-bottom: 0.04rem;
          }

          .en {
            display: block;
            font-size: 0.12rem;
            color: white;
            opacity: 0.3;
          }
        }
      }
    }

    .bottom-part {
      position: relative;

      .router-editor-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .info-wrap {
        padding: 0.3rem;
        width: 100%;
        height: auto;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        .avatar-wrap {
          margin-right: 0.15rem;

          img {
            width: 0.48rem;
            height: 0.48rem;
            border-radius: 50%;
          }
        }

        .username-wrap {
          .dropdown-wrap {
            margin-bottom: 0.01rem;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            cursor: pointer;

            .name {
              font-size: 0.16rem;
              margin-right: 0.15rem;
            }

            .dropdown {
              width: 0.2rem;
              height: 0.2rem;
              background-image: url("../assets/img/down.svg");
              background-size: contain;
            }
          }

          .permission-wrap {
            font-size: 0.12rem;
            color: white;
            opacity: 0.3;
          }
        }
      }

      .menu-wrap {
        width: 1.4rem;
        position: absolute;
        right: 0;
        transform: translateX(calc(100% + 0.2rem));
        background-color: rgba(22, 22, 22, 1);
        z-index: 10;
        bottom: 0.2rem;
        font-size: 0.14rem;
        border-radius: 0.1rem;
        overflow: hidden;

        .menu-item {
          height: 0.4rem;
          text-align: center;
          line-height: 0.4rem;

          &:hover {
            cursor: pointer;
            background: rgba(209, 108, 36, 0.8);
          }
        }
      }
    }

    transition: all 0.3s;
    transform: translateX(-100%);

    &.expand {
      transform: translateX(0%);
    }
  }

  .sub-view {
    box-sizing: border-box;
    position: relative;
    width: 100%;
    height: 100%;
    border: 2px solid black;
    pointer-events: none;
    z-index: 10;
    transition: all 0.5s;
    padding-left: 0;

    &.expand {
      padding-left: @navWidth;
    }

    &.blur-bg {
      background: linear-gradient(
        180deg,
        rgba(109, 131, 159, 0.9) 0%,
        rgba(49, 50, 65, 0.9) 100%
      );
    }
  }

  .expand-button {
    cursor: pointer;
    width: 0.4rem;
    height: 0.4rem;
    border-radius: 50%;
    background-color: rgba(42, 54, 1, 0.7);
    margin-right: -0.2rem;
    box-shadow: 0 0 3px rgba(255, 255, 255, 0.8);
    z-index: 10;
    position: absolute;
    right: 0;
    top: 50%;
    margin-top: -0.2rem;
    display: flex;

    .show {
      display: block;
    }

    img {
      display: none;
    }

    &:hover {
      background-color: rgba(42, 54, 68, 0.5);
      box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
    }
  }
}

.blurMap {
  filter: blur(5px);
  pointer-events: none;
}

.hide {
  display: none;
}

.fade-enter {
  opacity: 0;

  transform: translateX(-100px);
}

.fade-leave-to {
  opacity: 0;

  transform: translateX(100px);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 2s;
}

.track-view {
  background: #222a3644;
  position: fixed;
  z-index: 18;
  color: white;
  font-size: 0.16rem;
  border-radius: 0.16rem;
  transition: all 0.5s linear;
}

.track-view-right-list {
  padding: 12px;
  top: 1.1rem;
  height: 76vh;
  overflow-y: auto;
  right: calc(0.26rem + 350px);

  .close-container {
    text-align: right;
    margin-bottom: 5px;
    margin-top: -5px;
  }

  .item {
    background-color: rgba(42, 54, 68, 0.3);
    border-radius: 0.1rem;
    min-width: 1.38rem;
    //width: 188px;
    text-align: left;
    padding: 0 5px;
    padding-left: 50px;
    position: relative;
    line-height: 0.44rem;
    cursor: pointer;
    margin-bottom: 10px;

    .icon-container {
      content: "";
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 1px;
      margin: 0 10px;
      border-radius: 50%;
    }

    > div {
      height: 24px;
      line-height: 24px;
    }

    &-active {
      color: #ffaa6c;
    }

    &:hover {
      color: #ffaa6c;
    }
  }
}

.track-view-list {
  top: calc(0.26rem + 184px);
  padding: 12px;
  display: flex;
  width: 9.8rem;
  overflow: auto;
  white-space: nowrap;

  .item {
    background-color: rgba(42, 54, 68, 0.3);
    border-radius: 0.22rem;
    flex: 1;
    min-width: 1.18rem;
    height: 0.44rem;
    text-align: center;
    line-height: 0.44rem;
    cursor: pointer;

    &-active {
      color: #ffaa6c;
    }

    &:hover {
      color: #ffaa6c;
    }
  }

  > div {
    margin-right: 5px;

    &:last-of-type {
      margin-right: 0;
    }
  }
}

.track-view-top {
  top: 0.26rem;
  padding: 12px;
  height: 132px;

  .text {
    //margin-left: 160px;
    height: 30px;
    line-height: 30px;

    &.button {
      background-color: rgba(42, 54, 68, 0.3);
      border-radius: 0.22rem;
      text-align: center;
      cursor: pointer;

      &:hover {
        color: white;
        background: linear-gradient(to right, #6bcbb4, #ff8134);
      }
    }
  }

  > div {
    &:first-of-type {
      font-size: 0.2rem;
    }

    &:nth-of-type(2) {
      margin-top: 10px;
    }

    margin-bottom: 10px;
  }

  .img-container {
    width: 90px;
    height: 90px;
    float: left;
    margin-top: 10px;

    > img {
      height: 100%;
      width: 100%;
    }
  }
}
</style>
