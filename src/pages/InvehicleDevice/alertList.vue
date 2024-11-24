<template>
  <main>
    <vector-alert-list
        :page-type="PageTypeEnum.INVEHICLE"
    />
  </main>
</template>

<script>
import VectorAlertList from "@/components/devices/VectorAlertList.vue";

export default {
  name: "alertList.vue",
  components: {
    VectorAlertList,
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
