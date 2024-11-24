<template>
  <div class="spinner-container">
    <img src="@/assets/img/spinner.gif" />
    <div class="text">加载中 请稍候</div>
  </div>
</template>

<script>
export default {
name: "Spinner"
}
</script>

<style scoped lang="less">
.spinner-container {
  width: 100%;
  height: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;

  img {
    width: 1.5rem;
    height: 1.5rem;
    object-fit: contain;
  }
  .text {
    font-size: 0.24rem;
    color: #909090;
  }
}
</style>
