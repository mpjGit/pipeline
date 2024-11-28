const calcMonitorDevices = {
    computed: {
        // 所有设备
        devices: function () {
            return [].concat(this.$store.state.device.newDevices.filter(() => true));
        },
        filterType: function () {
            return this.$store.state.device.filterType;
        },
        // 所有设备
        downHoleDevices: function () {
            return [].concat(this.$store.state.device.devices.filter(o => o.deviceType === DOWNHOLE));
        },
        mileageDevices: function () {
            return [].concat(this.$store.state.device.mileageDevices);
        },
    }
}

export default calcMonitorDevices;
