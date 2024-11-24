<template>
  <main>
    <input type="checkbox" :id="item.name" v-model="item.show">
    <label :for="item.name" :class="['checkboxClass', { 'is-disabled': !item.show }]" :style="{height: height}"></label>
  </main>
</template>

<script>
import {cloneDeep} from "lodash-es";

export default {
  name: "Checkbox",
  data() {
    return {
    };
  },
  props: {
    item: {
      type: Object,
      default: () => {},
    },
    height: {
      type: String,
      default: '30px',
    },
    checkboxClass: {
      type: String,
      default: '30px',
    },
  },
  watch: {
    'item.show': {
      handler(val) {
        this.$emit('changeStatus', {
          data: cloneDeep(this.item),
          val,
        });
      },
     deep: true,
    },
  }
}
</script>

<style scoped>
main {
  zoom: 0.8;
}
input {
  display: none;
}

label {
  display: block;
  width: 75px;
  height: 30px;
  border-radius: 30px;
  background: rgb(109, 105, 105);
  border: 1px solid #e6a23c;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

label::before {
  display: block;
  content: '';
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: white;
  position: absolute;
  left: 0px;
  top: 50%;
  transform: translateY(-50%);
  transition: all .3s;
}

label::after {
  display: block;
  content: '';
  width: 0;
  height: 100%;
  background: #F98631;
  transition: all .3s;
  border-radius: 10px;
}

input:checked + label::before {
  left: 45px;
}
.is-disabled {
  border: 1px solid #eee;
}

input:checked + label::after {
  width: 100%;
}
</style>
