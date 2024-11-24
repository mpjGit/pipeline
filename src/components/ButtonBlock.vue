<template>
  <div class="button-block right-container">
    <router-link class="button" v-for="(tab, index) in tabs" :key="index" :to="tab.path" v-bind:class="{active: isActive(tab.path)}" @click.native="isPath(tab.path)">
      <span>
        {{tab.name}}
      </span>
    </router-link>
  </div>
</template>

<script>
// import func from 'vue-editor-bridge';
export default {
  name: "ButtonBlock",
  props: {
    tabs: Array
  },
  data: function () {
    return {
    }
  },
  methods: {
    isActive: function(path) {
      return this.$route.path.endsWith(path);
    },

    isPath: function(path){
      if(!(path=='map')){
        this.$emit("clearInterval");
      }else{
        this.$emit("interval");
      }
    }
  }
}
</script>

<style scoped lang="less">
@import "../styles/common";
.button-block {
  pointer-events: auto;
  position: absolute;
  z-index: 20;
  right: @padding + @navButtonSize + @padding;
  top: @padding;
  display: flex;
  flex-direction: row;
  align-items: center;
  .button {
    cursor: pointer;
    margin-left: 0.1rem;
    width: 1.28rem;
    height: @navButtonSize;
    border-radius: 1rem;
    background-color: white;
    box-shadow: 0rem 0rem 0.15rem 0rem rgba(0,0,0,0.0500);
    font-size: 0.2rem;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(22, 22, 22, 1);
    font-weight: bold;
    &.active {
      background: #F98631;
      color: black;
    }
  }
}
</style>
