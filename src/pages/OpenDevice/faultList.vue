<template>
  <main>
    <vector-fault-list
        :page-type="PageTypeEnum.OPEN"
    />
  </main>
</template>

<script>
import VectorFaultList from "@/components/devices/VectorFaultList.vue";

export default {
  name: "faultList.vue",
  components: {
    VectorFaultList,
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
