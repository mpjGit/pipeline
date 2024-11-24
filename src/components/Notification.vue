<template>

  <div class="notification-item" v-bind:class="{
      warn: type==='warn',
      error: type==='error'
    }">

    <div class="title-wrap">
      <div class="left-part">
        <img v-if="deviceType === 'downhole'" src="@/assets/img/downhole.svg" />
        <img v-else src="@/assets/img/car.svg" />
        <div>{{deviceName}}</div>

     </div>
      <div class="right-part" v-on:click="toggleMute">
        <img v-if="isMute" src="@/assets/img/mute.svg" />
        <img v-else src="@/assets/img/sound.svg" />
      </div>
    </div>

    <div class="field-list">
      <div class="field-item" v-for="(item,index) in fieldList" v-bind:key="index">
        <span class="name">{{item.name}}</span>
        <span class="value"> {{item.value}}</span>
      </div>
    </div>

    <div class="button-wrap">
      <div class="button mute" v-on:click="toggleMute" v-bind:class="{gray: isMute}">
        <span v-if="!isMute">
          消音
        </span>
        <span v-else>取消静音</span>
      </div>
      <div
          v-on:click="handleProcess"
          class="button process">
        处理
      </div>
    </div>

  </div>

</template>

<script>
import notificationMixin from "@/mixins/notification";

export default {
  name: "Notification",
  mixins:[notificationMixin]
}
</script>

<style scoped lang="less">

 @paddingV: 0.09rem;
 @paddingH: 0.18rem;

 @keyframes blink {
   0% {
     opacity: 1;
   }
   50% {
     opacity: 0.5;
   }
   100% {
     opacity: 1;
   }
 }

  .notification-item {
    position: relative;
    width: 3.2rem;
    border-radius: 0.1rem;
    overflow: hidden;
    background: rgba(42, 54, 68, 0.3);
    &.error {
      .title-wrap {
        background: linear-gradient(52deg, #FA5151 5%, rgba(250, 81, 81, 0) 100%);
        animation: blink 1s infinite;
        padding-right: 0.1rem;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        .left-part {
        }
        .right-part {
        }
      }
    }
    &.warn {
      .title-wrap {
        padding-right: 0.1rem;
        box-sizing: border-box;
        background: linear-gradient(83deg, #FFB521 0%, rgba(255, 181, 33, 0.3) 100%);
      }
    }
    .title-wrap {
      font-size: 0.14rem;
      color: white;
      position: relative;
      background: linear-gradient(52deg, rgba(0,0,0,0.3) 5%, rgba(255, 255, 255, 0.3) 100%);
      width: 100%;
      height: 0.38rem;
      opacity: 1;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      .left-part {
        display: flex;
        flex-grow: 1;
        flex-direction: row;
        align-items: center;
      }
      .right-part {
        cursor: pointer;
      }
    }
    .field-list {
      padding: @paddingV @paddingH;
      .field-item {
        font-size: 0.14rem;
        color: white;
        .name {
          &:after {
            content: ':';
          }
        }
      }
    }
    .button-wrap {
      position: absolute;
      display: flex;
      right: @paddingH;
      bottom: @paddingV;
      font-size: 0.14rem;
      color: rgba(23, 23, 23, 1);
      flex-direction: row;
      align-items: center;
      justify-content: center;
      .button {
        min-width: 0.6rem;
        padding-left: 0.05rem;
        padding-right: 0.05rem;
        height: 0.32rem;
        margin-left: 0.05rem;
        border-radius: 0.16rem;
        background: #171717;
        cursor: pointer;
        color: white;
        text-align: center;
        line-height: 0.32rem;

        &.process {
          background-color: rgba(255, 255, 255, 1);
          color: black;
        }
        &.gray {
          background-color: white;
          color: gray;
          font-size: 0.12rem;

        }
      }
    }
  }
</style>
