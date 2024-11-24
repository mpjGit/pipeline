<template>
  <div class="modal-container">
    <div class="modal" v-bind:class="size">
      <div class="header">
        <slot name="header"></slot>
        <div class="close-button" v-on:click="onCloseTrigger">
          <img src="../../../assets/img/close_white.svg" />
        </div>
      </div>
      <div class="body">
        <slot name="body"></slot>
      </div>
      <div class="footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Modal",
  props: {
    onCloseTrigger: {
      type: Function,
      default: function () {
        return () => true;
      }
    },
    size: {
      type: String,
      default: function () {
        return 'normal';
      }
    }
  }
}
</script>

<style scoped lang="less">
@import "../../../styles/common";
@modalPadding: 0.3rem;
.modal-container {
  font-size: 0.16rem;
  &:before {
    content: '';
    display: block;
    background: rgba(0, 0 ,0, 0.3);
    width: calc(100% + @padding*2);
    height: 100vh;
    position: absolute;
    left: 0;
    top: 0;
    margin-left: -@padding;
    margin-top: -@padding;
    z-index: 10;
  }
  width: 100%;
  top: 0;
  left: 0;
  height: 100%;
  position: absolute;
  z-index: 50;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .modal {
    z-index: 11;
    background: white;
    width: 10rem;
    max-height: 80vh;
    max-width: 80%;
    height: auto;
    border-radius: 0.1rem;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    &.big {
      height: 80vh;
      width: 80%;
    }
    &.small {
      width: 5.4rem;
      .header {
        height: 0.64rem;
        line-height: 0.64rem;
      }
    }
    .header {
      width:100%;
      box-sizing: border-box;
      height: 0.8rem;
      line-height: 0.8rem;
      font-size: 0.16rem;
      color: white;
      padding-left: @padding;
      background: linear-gradient(224deg, #171717 8%, #303030 99%);
      position: relative;
      .close-button {
        position: absolute;
        top: 0;
        right: 0;
        width: 0.8rem;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        img {
          width: 0.15rem;
          height: 0.15rem;
        }
      }
    }
    .body {
      height: auto;
      max-height: calc(100% - 0.8rem);
      overflow-y: scroll;
      padding: @modalPadding;
      box-sizing: border-box;
      flex-grow: 1;
    }
    .footer {
      flex-shrink: 0;
      flex-grow: 0;
    }
  }
}
</style>
