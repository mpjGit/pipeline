<template>
  <div class="image-wrap">
    <img v-if="url && show && !Array.isArray(url)" :src="url" alt="图片加载失败..." @error="() => show = false"/>
    <img v-else-if="url && show && Array.isArray(url)" v-for="(item, index) in url" :key="index" :src="item" alt="图片加载失败..." @error="() => show = false"/>
    <div v-else class="error-image">暂无图片</div>
  </div>
</template>

<script>
export default {
  name: "imageWrap",
  props: {
    url: {
      type: [String, Array],
      default: '',
    },
  },
  watch: {
    url() {
      this.show = true;
    },
  },
  data() {
    return {
      show: true,
    }
  },
}
</script>

<style lang="less" scoped>
.image-wrap {
  margin-top: 0.2rem;

  img {
    width: 100%;
    height: auto;
    border-radius: 0.1rem;
  }
}

.error-image {
  text-align: center;
  width: 100%;
  line-height: 50px;
  color: #696969;
  font-size: 16px;
}
</style>
