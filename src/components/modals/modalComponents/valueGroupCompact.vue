<template>
  <div class="form-group">
    <div class="name">
      <span>{{name}} : </span>
    </div>
    <div class="value" v-bind:class="{textarea: type==='textarea'}">
      <span v-if="type==='string'">{{value}}</span>
      <select v-else-if="type==='select'" class="select-item" @change="onValueChange">
        <option value="">请选择</option>
        <option v-for="(item, index) in options" :value="item.name" v-bind:key="index">{{item.name}}</option>
      </select>
      <textarea v-else-if="type==='textarea'" readonly class="textarea-item" v-model="value"></textarea>
      <textarea v-else-if="type==='textarea-editable'" class="textarea-item" @change="onValueChange"  v-model="value"></textarea>
      <div v-else-if="type==='status'" class="status">
        <div v-if="value==0" class="normal"></div>
        <div v-else-if="value==1" class="warn"></div>
        <div v-else-if="value==2" class="error"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String
    },
    value: [String, Number],
    type: {
      type: String,
      default: function () {
        return 'string'
      }
    },
    options: {
      type: Array
    }
  },
  name: "ValueGroup",
  methods: {
    onValueChange: function (ev) {
      this.$emit('change', {value: ev.target.value});
    }
  }
}
</script>

<style scoped lang="less">
@import "../../../styles/common";
.form-group {
  color: #222222;
  margin-bottom: 0.1rem;
  display: flex;
  align-items: center;
  .name {
    color: rgba(102, 102, 102, 1);
    font-size: 0.14rem;
  }
  .value {
    &.textarea {
      height: 1.2rem;
    }
    flex: 1;
    font-weight: bold;
    padding-left: 0.1rem;
    box-sizing: border-box;
    position: relative;
    .select-item {
      width: 100%;
      height: 0.6rem;
      border: none;
      outline: none;
      cursor: pointer;
      background-color: transparent;
      background-image: url("../../../assets/img/down_black.svg");
      background-size: 0.25rem;
      background-repeat: no-repeat;
      background-position: right center;
    }
    .textarea-item {
      background: none;
      border: none;
      width: 100%;
      height: 100%;
      font-size: 0.2rem;
      line-height: 0.28rem;
      font-weight: bold;
      padding: @padding/2;
      box-sizing: border-box;
    }
    .status {
      display: block;
      width: 100%;
      height: 100%;
      background-color: white;
      position: absolute;
      margin-left: -0.1rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      .normal {
        &:before {
          content: '';
          width: 0.15rem;
          height: 0.15rem;
          border-radius: 50%;
          background-color: @normalColor;
          display: inline-block;
          margin-right: 0.05rem;
          vertical-align: middle;
        }
        &:after {
          content: '正常';
          vertical-align: middle;
          color: @normalColor;
        }
      }

      .warn {
        &:before {
          content: '';
          width: 0.15rem;
          height: 0.15rem;
          border-radius: 50%;
          background-color: @warnColor;
          display: inline-block;
          margin-right: 0.05rem;
          vertical-align: middle;
        }
        &:after {
          content: '故障';
          vertical-align: middle;
          color: @warnColor;
        }
      }

      .error {
        &:before {
          content: '';
          width: 0.15rem;
          height: 0.15rem;
          border-radius: 50%;
          background-color: @errorColor;
          display: inline-block;
          margin-right: 0.05rem;
          vertical-align: middle;
        }

        &:after {
          content: '报警';
          vertical-align: middle;
          color: @errorColor;
        }
      }
    }
  }
}
</style>
