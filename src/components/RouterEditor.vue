<template>
  <main>
    <!-- <el-popover
        placement="right"
        width="200"
        trigger="click">
      <div v-for="(item) in routerList" :key="item.index" v-if="hasAuth(item)">
        <div class="router-item" v-show="item.disabled !== true">
          <span> <i :class="item.icon"></i>{{ item.name }}</span>
          <v-checkbox :id="'checkbox'+item.index" :item="item" @changeStatus="changeStatus"></v-checkbox>
        </div>
      </div>
      <el-button slot="reference" type="warning" icon="el-icon-setting" circle></el-button>
    </el-popover> -->
    <el-button slot="reference" type="warning" @click="toManage">管理平台</el-button>
  </main>
</template>

<script>

import { insertSupportDevice } from "@/api/apiHandler";
import { typeMap } from '@/vuex/constant/RoutesConstant.js';

export default {
  name: "RouterEditor",
  props: {
    routerList: {
      type: Array,
      default: () => [],
    }
  },
  computed: {

  },
  methods: {
    // 跳转管理平台
    toManage() {
      // console.log(window.location.origin + '/#/manage')
      window.open(window.location.origin + '/#/manage', '_blank');// 本地开发
      // window.open(window.location.origin + '/sense/#/manage', '_blank');// 线上环境
      // this.$router.push('/manage');
    },
    // 是否有权限展示路由
    hasAuth(item) {
      if (item.isAdmin) {
        if (Number(this.isAdmin) === 1) {
          return true;
        }
        return false;
      }
      return true;
    },
    changeStatus(context) {
      const {data: {index}, val} = context;
      this.routerList.find((item) => item.index === index).show = val;
      this.$store.commit('setUserRoutes', this.routerList);
      const req = {
        userId: this.userId,
      };
      this.routerList.forEach((item) => {
        if (item.show && !item.disabled && typeMap[item.type]) {
          req[typeMap[item.type]] = Number(item.show);
        }
      });
      insertSupportDevice(req);
    },
  },
}
</script>

<style lang="less" scoped>
.router-item {
  display: flex;
  height: 50px;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 10px;
  border-radius: 6px;
  border: 1px solid #dcdfe6;
}
i {
  margin-right: 5px;
  zoom: 1.3;
}

</style>
