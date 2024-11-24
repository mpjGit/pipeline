<template>
  <main>
    <input type="checkbox" v-model="show">
    <slot></slot>
  </main>
</template>

<script>
export default {
  name: "Checkbox",
  data() {
    return {
      show: false,
    };
  },
  created() {
    this.show = this.value;
  },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
  watch: {
    show(val) {
      this.$emit('input', val);
    },
  },
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
