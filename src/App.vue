<template>
  <div id="app">
    <transition :name="transitionName" :duration="300">
      <router-view v-slot="{ Component }" class="main-container">
        <component :is="Component" />
      </router-view>
    </transition>

    <template v-if="!isFullScreen">
      <DownholeAlert />
      <DownholeFault />
      <MileageAlert/>
      <MileageFault/>
      <InvehicleAlert />
      <InvehicleFault />
    </template>

    <!-- 全局提示框 -->
    <transition name="fade" duration="500">
      <div class="popMask" v-if="alertMessage">
        <div class="inner">
          <div class="h2">提示</div>
          <div class="p">{{alertMessage}}</div>
          <div class="buttonRow">
            <div class="confirmBtn" @click="hideAlert">好的</div>
          </div>
        </div>
      </div>
    </transition>
    <!-- 全局询问框 -->
    <ConfirmModal />
    <!-- 全局播放器 -->
    <div class="video-container" v-if="showPlayer">
      <div class="close-btn" v-on:click="handleCloseVideo">
        <img class="icon" src="./assets/img/close_white.svg" />
      </div>
      <video-player
          class="video-player-box"
          ref="videoPlayer"
          :options="playerOptions"
      />

    </div>

    <!-- 音频提示播放实例 -->
    <audio v-if="shouldPlay" ref="audioPlayer" src="./assets/audio/alert.mp3" autoplay="autoplay" loop="loop" />

    <!-- 全局toast提示狂 -->
      <Toast />
  </div>
</template>

<script>
import Modal from "@/components/Modal";
import ConfirmModal from "@/components/ConfirmModal";
import 'video.js/dist/video-js.css'
import 'video.js/dist/video-js.css'
import moment from "moment";
import { videoPlayer } from 'vue-video-player'
import DownholeAlert from "@/components/modals/DownholeAlert";
import DownholeFault from "@/components/modals/DownholeFault";
import InvehicleAlert from "@/components/modals/InvehicleAlert";
import InvehicleFault from "@/components/modals/InvehicleFault";
import MileageAlert from "@/components/modals/MileageAlert.vue";
import MileageFault from "@/components/modals/MileageFault.vue";
import Toast from "./components/Toast";
import RoutesConstant from "@/vuex/constant/RoutesConstant";

export default {
  name: 'App',
  components: {
    Toast,
    InvehicleFault,
    InvehicleAlert,
    DownholeFault,
    DownholeAlert,
    ConfirmModal,
    MileageAlert,
    MileageFault,
    Modal,
    videoPlayer
  },
  data: function () {
    return {
      transitionName: '',
      idx: 0,
    }
  },
  created() {
    this.initRouterBaseInfo();
    window.token = this.$store.state.user.token;
    // console.log(this.$store.state.user.username)
    if(this.$store.state.user.username==''){
      this.$router.replace('/login')
    }
  },
  mounted() {
    window.alert = (message) => {
      this.$store.dispatch('showAlert', message);
    }
  },
  methods: {
    // 初始化路由基本信息
    initRouterBaseInfo() {
      this.$store.commit('setUserRoutes', RoutesConstant);
    },
    hideAlert() {
      this.$store.dispatch('hideAlert');
    },

    handleCloseVideo: function () {
      this.$store.dispatch('clearVideo');
    }
  },
  watch: {
    '$route': {
      handler(to, from) {
        if (this.isAdmin && !this.$store.getters['adminLogin']) {
          this.$store.state.user.username=='';
          this.$router.replace('/login')
        }
        // console.log(this.$store.state.user.username)
        if(this.$store.state.user.username==''){
          this.$router.replace('/login')
        }else{
          const toDepth = to.path.length
          const fromDepth = from.path.length
          this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
        }
      },
      immediate: true,
    },
    username: {
      immediate: true,
      handler: function() {
          window.token = this.$store.state.user.token;
        // this.$store.dispatch('configs/getCurrentUnit')
      }
    },
    watch: {
      currentUnit: function(cur) {
        this.toast('当前单位为: ' + cur.text)
      }
    }
  },
  computed: {
    alertMessage() {
      return this.$store.state.alert.alertMessage
    },
    getCurrentTime() {
      return moment().format('yyyy-MM-DD HH:mm:ss');
    },
    showPlayer: function () {
      return this.$store.state.player.currentPlayUrl
    },
    playerOptions: function () {
      return {
        // videojs options
        muted: true,
            width: 600,
            height: 340,
            language: 'en',
            playbackRates: [0.7, 1.0, 1.5, 2.0],
            sources: [{
          type: "video/mp4",
          src: this.$store.state.player.currentPlayUrl
        }],
            poster: "/static/images/author.jpg",
      }
    },
    shouldPlay: function () {
      return this.$store.getters["notification/shouldPlayNew"];
    },
    currentUnit:  function () {
      return this.$store.getters["configs/unitInfo"];
    }
  }

}
</script>

<style lang="less" >
@import "styles/popmask";
@import "styles/common";
body {
  font-family: -apple-system,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Microsoft YaHei,Source Han Sans SC,Noto Sans CJK SC,WenQuanYi Micro Hei,sans-serif;
}

/*
  Enter and leave animations can use different
  durations and timing functions.
*/
body{
	overflow: hidden!important;
}
#app{
	overflow: hidden;
	width: 100%;
	//max-width: 7.5rem;
  margin: 0 auto;
	height: 100%;
  position: absolute;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
}
.main-container {
  width: 100%;
  top: 0;
  left: 0;
  position: absolute;
  height: 100%;
  &:after {
    content: '';
    display: block;
    width: 100%;
    height: 1.5rem;
  }
}
.confirm-modal-container {
  z-index: 51 !important;
  .confirm-body {
    font-size: 0.24rem;
    font-weight: bold;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    .icon-wrap {
      padding-right: 0.1rem;
    }
  }
  .button-wrap {
    padding: 0 @padding @padding;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    .button;
  }
}

.video-container {
  background-color: rgba(0,0,0,0.3);
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 101;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  .video-player-box {
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 0 9px rgba(255,255,255,0.3);
  }

  .close-btn {
    cursor: pointer;
    width: 0.2rem;
    height: 0.2rem;
    border: 1px solid white;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -0.1rem;
    margin-top: -0.1rem;
    z-index: 99;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    transform: translateX(300px) translateY(-170px);
    .icon {
    }
  }

}

</style>
