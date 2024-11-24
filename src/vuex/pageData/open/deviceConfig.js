import {request} from "@/utils/http";



const deviceConfig = {
    namespaced: true,
    state: () => {
        return {
            // 当前设置的设备信息
            configDetail: null,
            configList: [],
        }
    },
    getters: {
        // 10%LEL = 5000ppm = 0.5%VOL

    },
    mutations: {
        updateDeviceConfig: (state, {
            deviceName,
            type,
            body_version, //组件版本
            camera_version, // 探头版本
            manufacture_date, // 生产日期
            low_alert, //低报警
            high_alert, // 高报警
            update, // 上传周期
            acquire // 采集周期
        }) => {
            state.configDetail = {
                deviceName,
                type,
                body_version, //组件版本
                camera_version, // 探头版本
                manufacture_date, // 生产日期
                low_alert, //低报警
                high_alert, // 高报警
                update, // 上传周期
                acquire // 采集周期
            }
        },
        updateConfigList: (state, list) => {
            state.configList = list;
        },
        clearConfigInfo: (state) => {
            state.configDetail = null
        }
    },
    actions: {
        // 获取设备的信息
        fetchDeviceConfig: function(context, deviceName) {
            request.post('openSet', {
                username: context.rootState.user.username,
                devicename: deviceName
            }).then(res => {
                if(res && res.length) {
                    const data = res[0];

                    context.commit('updateDeviceConfig', {
                        deviceName,
                        type: data.type,
                        body_version: data.body_version, //组件版本
                        camera_version:data.camera_version, // 探头版本
                        manufacture_date: data.manuf_date, // 生产日期
                        low_alert: data.low_alert, //低报警
                        high_alert: data.high_alert, // 高报警
                        update:data.update , // 上传周期
                        acquire: data.acquire // 采集周期
                    });

                }

            })
        },

        // 获取设备的名字
        fetchDevicesConfig: function(context, deviceName) {

            request.post('openSetMultiDevices', {
                username: context.rootState.user.username,
                devicename: deviceName
            }).then(res => {
                console.log(res);
                let configList = [];
                res.map(data => {
                    configList.push({
                        deviceName: data.devicename,
                        type: data.type,
                        body_version: data.body_version, //组件版本
                        camera_version:data.camera_version, // 探头版本
                        manufacture_date: data.manuf_date, // 生产日期
                        low_alert: data.low_alert, //低报警
                        high_alert: data.high_alert, // 高报警
                        update:data.update , // 上传周期
                        acquire: data.acquire // 采集周期
                    })
                });

                context.commit('updateDeviceConfig', configList[0]);
                context.commit('updateConfigList', configList);
            });
        },

        clearConfigInfo(context) {
            context.commit('clearConfigInfo');
        }
    }
}

export default deviceConfig;
