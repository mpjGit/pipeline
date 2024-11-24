const calcNewDevices = {
    data() {
        return {
            searchedDevice: '',
            deviceSearchList: [],
        };
    },
    computed: {
        allDevices() {
            return [...this.devices];
        },
        // 所有设备
        devices: function () {
            return [].concat(this.$store.state.device.newDevices.filter(o => this.filterType.indexOf(o.deviceType) > -1));
        },
        filterType: function () {
            return this.$store.state.device.filterType;
        }
    },
    methods: {
        handleSelect(item) {
            this.searchedDevice = item.name;
            const [longitude, latitude] = item.position;
            let map = this.getMap();
            var point = new BMapGL.Point(Number(longitude), Number(latitude));
            map.centerAndZoom(point, 14);
            setTimeout(() => {
                map.centerAndZoom(point, 20);
            }, 1500)
            map.enableScrollWheelZoom(true);
        },
        handleIconClick() {
            this.searchedDevice = '';
        },
        createFilter(queryString) {
            return (deviceList) => {
                console.log({
                    queryString,
                    deviceList,
                })
                return (deviceList.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        querySearch(queryString, cb) {
            const deviceList = this.allDevices.map((item) => item);
            const results = queryString ? deviceList.filter(this.createFilter(queryString)) : deviceList;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
    },
}

export default calcNewDevices;
