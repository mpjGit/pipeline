let refreshDeviceOnMapMixin = {
    watch: {
        devices: {
            handler: function () {
                this.onMapReady(() => {
                    this.drawDeviceStatus();
                    // if (this.timerInerval) {
                    //     return;
                    // }
                    // this.timerInerval = setInterval(() => {
                    //     this.drawDeviceStatus();
                    // }, 4000);
                });
            },
            immediate: false
        }
    },
    beforeDestroy() {
        // clearInterval(this.timerInerval)
    },
    methods: {
        // 更新所有设备状态
        drawDeviceStatus: function() {
            this.clearMap();
            this.devices.map((value) => {
                let point = new BMapGL.Point(value.position[0], value.position[1]);
                this.createIconMarker({
                    ...value,
                    center: point,
                    title: value.name,
                    iconText: (value.deviceType === DOWNHOLE)?'井':'里',
                    fieldList: value.fieldList,
                    trackPoint: value.trackPoint,
                    video: value.video,
                    id:value.id,//引入id
                    deviceStatus: value.status})
                    //console.log("icon_id : "+value.id)//存在id可用
            })
        },
    }
}

export default refreshDeviceOnMapMixin;
