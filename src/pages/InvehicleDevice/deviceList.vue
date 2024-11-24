<template>
  <main>
    <vector-device-list
        :page-type="PageTypeEnum.INVEHICLE"
    />
  </main>
</template>

<script>
import VectorDeviceList from "@/components/devices/VectorDeviceList.vue";

export default {
  name: "deviceList.vue",
  components: {
    VectorDeviceList
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
