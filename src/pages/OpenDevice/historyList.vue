<template>
  <main>
    <vector-history-list
        :page-type="PageTypeEnum.OPEN"
    />
  </main>
</template>

<script>
import VectorHistoryList from "@/components/devices/VectorHistoryList.vue";

export default {
  name: "alertList.vue",
  components: {
    VectorHistoryList,
  },
  data() {
    return {
    };
  },
  methods: {
  },
}
</script>

<style scoped>

</style>
