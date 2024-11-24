<template>
  <div class="small-notification-item">
    <div class="notification-button"
         v-bind:class="{warn: type==='warn',error: type==='error'}">
      <span>井</span>
      <img v-if="true" src="../assets/img/sound.svg" />
      <img v-else src="../assets/img/mute.svg" />
    </div>

    <!-- 弹出层 -->
    <div class="notification-popup">
      <div class="field-list">
        <div class="field-item" v-for="(item,index) in fieldList" v-bind:key="index">
          <span class="name">{{item.name}} :</span>
          <span class="value">{{item.value}}</span>
        </div>
      </div>
      <div class="button-wrap">
        <div class="button mute"  v-on:click="toggleMute" v-bind:class="{gray: isMute}">
           <span v-if="!isMute">
              消音
            </span>
          <span v-else>取消静音</span>
        </div>
        <div class="button process" v-on:click="handleProcess">处理</div>
      </div>
    </div>

  </div>
</template>

<script>
import notificationMixin from "@/mixins/notification";

export default {
  name: "SmallNotification",
  mixins:[notificationMixin]
}
</script>

<style scoped lang="less">
@import "../styles/common";
  .small-notification-item {
    font-size: 0.14rem;
    padding: 0.1rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    //background: black;
    cursor: pointer;
    //overflow: hidden;
    &:hover {
      background: rgba(0,0,0,0.4);
      overflow: hidden;
    }
    &:last-of-type {
      border-bottom-left-radius: 0.1rem;
    }
    position: relative;
    .notification-button {
      width: 0.6rem;
      height: 0.36rem;
      border-radius: 0.18rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      span {
        margin-right: 0.08rem;
      }
      img {

      }
      &.warn {
        background: linear-gradient(83deg, #FFB521 0%, rgba(255,181,33,0) 100%);
      }
      &.error {
        background: linear-gradient(52deg, #FA5151 5%, rgba(250,81,81,0) 100%);
      }
    }

    &:hover {
      .notification-popup {
        display: block;
      }
    }

    .notification-popup {
      display: none;
      position: fixed;
      right: calc(@padding + @padding + 0.6rem - 0.1rem);
      top: inherit;
      //background-color: rgba(0, 200, 0, 0.3);
      width: 2.55rem;
      height: 0.64rem;
      background-image: url("../assets/img/notification_pop.png");
      background-repeat: no-repeat;
      background-size: contain;
      background-position: left center;
      padding: 0.07rem 0.13rem;
      .field-list {
        display: grid;
        grid-template-rows: repeat(3, 1fr);
        grid-row-gap: auto;
        .field-item {

        }
      }

      .button-wrap {
        position: absolute;
        right: @padding;
        bottom: @padding/2;
        display: flex;
        font-size: 0.14rem;
        color: rgba(23, 23, 23, 1);
        flex-direction: row;
        align-items: center;
        justify-content: center;

        .button {
          width: 0.6rem;
          height: 0.32rem;
          margin-left: 0.05rem;
          border-radius: 0.16rem;
          cursor: pointer;
          color: white;
          text-align: center;
          line-height: 0.32rem;
          background: rgba(23, 23, 23, 0.3);

          &.process {
            background-color: rgba(255, 255, 255, 1);
            color: black;
          }
        }
      }
    }
  }
</style>
