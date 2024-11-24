const updateDeviceSignOnMap = {
    watch: {
        devices: {
            handler: function () {
                this.onMapReady(() => {
                    this.clearMap();
                    this.drawDeviceStatus();
                    // setInterval(() => {
                    //     this.drawDeviceStatus();
                    // }, 4000);
                });
            },
            immediate: false
        }
    },
    created() {
        this.$bus.$on('drawDeviceStatus', this.drawDeviceStatus);
    },
    beforeDestroy() {
        this.$bus.$off('drawDeviceStatus', this.drawDeviceStatus);
    },
    methods: {
        // 更新所有设备状态
        drawDeviceStatus: function(option) {
            let icon = null;
            if (option) {
                icon = option.icon;
            }
            this.clearMap();
            this.devices.map((value) => {
                const point = new BMapGL.Point(value.position[0], value.position[1]);
                const {
                    deviceType,
                    name,
                    fieldList,
                    status,
                    id,
                } = value;
                const trackPoint = this.$store.getters['deviceTrackPoint']?.[id];
                this.createIconMarker({
                    ...value,
                    center: point,
                    title: name,
                    iconText: deviceType.slice(0, 1),
                    fieldList,
                    icon,
                    trackPoint,
                    id,//引入id
                    deviceStatus: status,
                })
                //console.log("icon_id : "+value.id)//存在id可用
            })
        },
    }
}

export default updateDeviceSignOnMap;
