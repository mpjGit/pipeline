<template>
  <div class="map-control-container">
    <div class="map-function-wrap">
      <div class="scale-functions">
        <div class="zoom-in button" v-on:click="zoomInMap">
          <img src="@/assets/img/zoom_in.svg" />
        </div>
        <div class="zoom-out button" v-on:click="zoomOutMap">
          <img src="@/assets/img/zoom_out.svg" />
        </div>
        <div class="fullscreen button" v-on:click="fullScreen">
          <img v-if="!isFullScreen" src="@/assets/img/fullscreen.svg" />
          <img v-else src="@/assets/img/exit_fullscreen.svg" />

        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "mapControl",
  data: () => ({
  }),
  methods: {
    // 放大地图
    zoomInMap: function () {
      this.getMap().zoomIn()
    },
    // 缩小地图
    zoomOutMap: function () {
      this.getMap().zoomOut()
    },

    //全屏地图
    fullScreen: function () {
      let mapContainer = document.getElementById("map-container")
      if(!this.isFullScreen) {
        mapContainer.requestFullscreen();
      } else {
        try {
          document.exitFullscreen();
        } catch (e) {
          console.error(e)
        }
      }
    }
  },
  computed: {
    isFullScreen: function () {
      return this.$store.state.fullScreen.fullscreen;
    }
  }
}
</script>

<style scoped lang="less">
@import "../styles/common";
.map-function-wrap {
  pointer-events: visible;
  display: flex;
  position: absolute;
  bottom: @padding;
  right: @padding;
  height: auto;
  width: 1rem;
  flex-direction: column;
  align-items: flex-end;
  z-index: 20;

  .scale-functions {
    width: 1.4rem;
    height: auto;
    display: flex;
    justify-content: space-around;
    align-items: stretch;
    .button {
      cursor: pointer;
      margin-bottom: 0.1rem;
      box-sizing: border-box;
      width: 0.36rem;
      height: 0.36rem;
      border-radius: 50%;
      background-color: rgba(42, 54, 68, 0.3);
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      img {
        width: 0.30rem;
        height: 0.30rem;
        object-fit: contain;
      }
    }
  }
}

</style>
