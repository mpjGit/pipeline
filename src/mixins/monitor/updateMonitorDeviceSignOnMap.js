const updateDeviceSignOnMap = {
    watch: {
        devices: {
            handler: function () {
                this.onMapReady(() => {
                    this.clearMap();
                    this.drawDeviceStatus();
                    this.drawDownHoleDeviceStatus();
                    // setInterval(() => {
                    //     this.drawDeviceStatus();
                    // }, 4000);
                });
            },
            immediate: false
        },
        downHoleDevices: {
            handler: function () {
                this.onMapReady(() => {
                    this.clearMap();
                    this.drawDeviceStatus();
                    this.drawDownHoleDeviceStatus();
                    // setInterval(() => {
                    //     this.drawDeviceStatus();
                    // }, 4000);
                });
            },
            immediate: false
        },
        mileageDevices: {
            handler: function () {
                this.onMapReady(() => {
                    this.clearMap();
                    this.drawDeviceStatus();
                    this.drawDownHoleDeviceStatus();
                    // setInterval(() => {
                    //     this.drawDeviceStatus();
                    // }, 4000);
                });
            },
            immediate: false
        },
    },
    methods: {
        // 更新所有设备状态
        drawDownHoleDeviceStatus: function() {
            [...this.downHoleDevices, ...this.mileageDevices].map((value) => {
                let point = new BMapGL.Point(value.position[0], value.position[1]);
                // console.log(value)
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
        // 更新所有设备状态
        drawDeviceStatus: function() {
            this.devices.map((value) => {
                console.log("设备item =====》 ", value)
                const point = new BMapGL.Point(value.position[0], value.position[1]);
                const {
                    deviceType,
                    name,
                    fieldList,
                    status,
                    id,
                } = value;
                this.createIconMarker({
                    ...value,
                    center: point,
                    title: name,
                    iconText: deviceType.slice(0, 1),
                    fieldList,
                    // TODO: 问问有没有轨迹点数据
                    // trackPoint: value.trackPoint,
                    id,//引入id
                    deviceStatus: status,
                })
                //console.log("icon_id : "+value.id)//存在id可用
            })
        },
    }
}

export default updateDeviceSignOnMap;
