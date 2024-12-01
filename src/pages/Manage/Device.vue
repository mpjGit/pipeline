<template>
  <div class="aims">
    <el-form label-width="120px" :inline="true" :model="formInline">
      <el-form-item label="设备名称">
        <el-input v-model="formInline.user" placeholder="设备名称"></el-input>
      </el-form-item>
      <el-form-item label="设备类型">
        <el-select v-model="formInline.region" placeholder="设备类型">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "ManageDevice",
  data() {
    return {
      formInline: {
        user: "",
        region: "",
      },
    };
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    },
  },
};
</script>
<style scoped lang="less">
@import "../../styles/common";
.aims {
  padding: 20px;
  ::v-deep .el-form--inline .el-form-item__label {
    float: left;
  }
}
</style>
