<template>
  <div class="manage-view">
    <el-row>
        <el-col :span="4">
            <h5 style="font-size: 20px; border-right: 1px solid #eee">管理平台</h5>
        <el-menu
          default-active="1-1"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>设备管理</span>
            </template>
            <el-menu-item index="1-1">设备列表</el-menu-item>
            <el-menu-item index="1-2">历史记录</el-menu-item>
            <el-menu-item index="1-2">报警记录</el-menu-item>
            <el-menu-item index="1-2">故障记录</el-menu-item>
          </el-submenu>
        </el-menu>
        </el-col>
        <el-col :span="20">
            <router-view class="sub-content"></router-view>
        </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Manage",
  data: function () {
    return {
      timer: null,
    };
  },
  mounted() {},
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
};
</script>

<style scoped lang="less">
@import "../../styles/common.less";
.manage-view {
  width: 100%;
  height: 100%;
  padding: 10px;
}
</style>
