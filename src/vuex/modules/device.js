import {request} from "@/utils/http";
import {getEventById, getDeviceShowProper, fetchAllMapDevice, getDeviceInfos} from "@/api/apiHandler";
import {isMileageWarnMsg, isMileageFaultMsg, deviceType_toStr} from "@/utils/tool";
// import EventBus from "@/utils/eventBus";
// import Login from "@/pages/Login.vue";


const default_field = ({concentration, speed, wendu}) => [
    {
        name: '浓度',
        value: concentration,
    },
    {
        name: '速度',
        value: speed || 0,
    },
    {
        name: '温度',
        value: wendu || 0,
    }
];
const open_field = ({guangqiang, statusId, concentration}) => [
    {
        name: '光强',
        value: guangqiang,
    },
    {
        name: '状态',
        value: statusId || 0,
    },
    {
        name: '浓度',
        value: concentration || 0,
    }
];
const hand_field = ({guangqiang, statusId, wendu}) => [
    {
        name: '光强',
        value: guangqiang,
    },
    {
        name: '状态',
        value: statusId || 0,
    },
    {
        name: '温度',
        value: wendu || 0,
    }
];

const moduleDevice = {
    state: {
        //    设备列表
        devices: [],
        mileageDevices: [],
        // 除了井上设备的设备列表
        newDevices: [],
        filterType: [],
        // 监控中心页面下的右侧报警列表
        notificationTab: PageTypeEnum.DOWNHOLE,
        monitorEventNum: {
            chezaizhengchang: 0,
            chezaiguzhang: 0,
            chezaibaojing: 0,
            shouchizhengchang: 0,
            shouchiguzhang: 0,
            shouchibaojing: 0,
            kailuzhengchang: 0,
            kailuguzhang: 0,
            kailubaojing: 0,
            lichengzhuangzhengchang: 0,
            lichengzhuangguzhang: 0,
            lichengzhuangbaojing: 0,
        },
        deviceTrackPoint: {},
        // 设备列表展示字段
        deviceShowProper: {},
    },

    getters: {
        devices: state => {
            return state.devices;
        },
        newDevices: state => {
            return state.newDevices;
        },
        monitorEventNum: state => {
            return state.monitorEventNum;
        },
        deviceTrackPoint(state) {
            return state.deviceTrackPoint;
        },
        deviceShowProper(state) {
            return state.deviceShowProper;
        },
    },

    mutations: {
        // 设置设备 (旧)
        updateDeviceStatus(state, deviceList) {
            const page = state.filterType[0];
            if (page === PageTypeEnum.MONITOR) {
                const showDevice = this.state.user.routes.map((item) => {
                    if (item.show) {
                        return item.type;
                    }
                    return false;
                }).filter(Boolean);
                if (!(showDevice.includes(PageTypeEnum.DOWNHOLE))) {
                    deviceList = [];
                }
            }
            state.devices = deviceList;
        },

        // 设置设备 （新）
        setNewDeviceStatus(state, deviceList) {
            // const page = state.filterType[0];
            // if (page === PageTypeEnum.MONITOR) {
            //     const showDevice = this.state.user.routes.map((item) => {
            //         if (item.show) {
            //             return item.type;
            //         }
            //         return false;
            //     }).filter(Boolean);
            //     deviceList = deviceList.filter((item) => {
            //         return showDevice.includes(item.deviceType)
            //     });
            // }
            // 更新除了井上设备的设备列表
            state.newDevices = deviceList;
        },
        // 设置Mileage设备数据
        updateMileageDeviceStatus(state, deviceList) {
            const page = state.filterType[0];
            if (page === PageTypeEnum.MONITOR) {
                const showDevice = this.state.user.routes.map((item) => {
                    if (item.show) {
                        return item.type;
                    }
                    return false;
                }).filter(Boolean);
                if (!(showDevice.includes(PageTypeEnum.MILEAGE))) {
                    deviceList = [];
                }
            }
            state.mileageDevices = deviceList;
        },

        // 设置车载轨迹
        setDeviceTrackPoint(state, {id, data}) {
            state.deviceTrackPoint[id] = data;
        },

        clearDeviceTrackPoint(state) {
            state.deviceTrackPoint = {};
        },

        setMonitorEventNum(state, data) {
            state.monitorEventNum = data;
        },

        updateFilterType(state, filterTypes) {
            state.filterType = filterTypes;
        },

        setNotificationTab(state, data) {
            state.notificationTab = data;
        },
        setDeviceShowProper(state, data) {
            state.deviceShowProper = data;
        },
    },

    actions: {

        async updateDeviceShowProper({rootState, state}) {
            const userId = rootState.user.userId;
            const res = await getDeviceShowProper({
                userId,
            });
            window.globalCustomData.deviceProper = {};
            res.forEach((item) => {
                window.globalCustomData.deviceProper[item.deviceName] = item;
                state.deviceShowProper[item.deviceName] = item;
            });
        },

        // 更新除了井上设备的值
        async updateNewDeviceStatus({commit, rootState}) {
            const userId = rootState.user.userId;

            // 获取全部事件列表 (顶部的事件数据)
            let {
                chezaizhengchang,
                chezaiguzhang,
                chezaibaojing,
                shouchizhengchang,
                shouchiguzhang,
                shouchibaojing,
                kailuzhengchang,
                kailuguzhang,
                kailubaojing,
                lichengzhuangzhengchang,
                lichengzhuangguzhang,
                lichengzhuangbaojing,
                detail,
            } = await getEventById({id: userId});

            const { code } = await getDeviceInfos({
                enterpriseUuid: rootState.user.enterpriseUuid,
                distinguish: 'DEVICE_ALL'
            })

            if (code != '200') {
                return;
            }

            const formatDeviceList = [];
            const pageType = rootState.device.filterType[0]; // 当前页面

            detail.forEach((item) => {
                const {
                    type: deviceType,
                    statusId: deviceStatus,
                    latitude: lat,
                    longitude: lng,
                    deviceName,
                    id,
                } = item;

                // 点击 overLay 的数据展示（三种类型，在不同的页面展示不同的类型）
                let fieldList = default_field(item);
                if ([pageType, item.type].includes(PageTypeEnum.OPEN)) {
                    fieldList = open_field(item);
                }
                if ([pageType, item.type].includes(PageTypeEnum.HAND)) {
                    fieldList = hand_field(item);
                }

                // 浓度数据的处理
                fieldList.forEach((item) => {
                   if (item.name === '浓度') {
                       const currentUnit = this.getters["configs/unitInfo"];
                       item.value =`${currentUnit.transform(item.value).value}${currentUnit.text}`;
                   }
                });

                // 装载数据
                formatDeviceList.push({
                    fault: item.fault,
                    name: deviceName,
                    fieldList,
                    deviceType,
                    status: deviceStatus,
                    position: [lng, lat],
                    id,
                });
            });
            // commit('setNewDeviceStatus', formatDeviceList); // 设置设备位置数据

            // 设置顶部报警数据
            commit('setMonitorEventNum', {
                chezaizhengchang,
                chezaiguzhang,
                chezaibaojing,
                shouchizhengchang,
                shouchiguzhang,
                shouchibaojing,
                kailuzhengchang,
                kailuguzhang,
                kailubaojing,
                lichengzhuangzhengchang,
                lichengzhuangguzhang,
                lichengzhuangbaojing
            });
        },
        // 设置井下设备位置信息
        updateDeviceStatus({ rootState, commit }) {
            fetchAllMapDevice({
                distinguish: 'DEVICE_ALL',
                enterpriseUuid: rootState.user.enterpriseUuid
            }).then(res => {
                let formatDeviceList = [];
                const positions = res.data || [];
                if (Array.isArray(positions)) {
                    positions.map((value) => {
                        // 设备状态的格式化
                        let deviceStatus = NORMAL;
                        // if (isFaultMsg(value.fault)) {
                        //     deviceStatus = WARN;
                        // }
                        // if (isWarnMsg(value.fault)) {
                        //     deviceStatus = ERROR
                        // }
                        // 设备的位置信息
                        let lat = value.lat;
                        let lng = value.lon;
                        const fieldList = [
                            {
                                name: '状态',
                                value: '正常'
                            },
                            {
                                name: '电池电压',
                                value: '220v'
                            },
                            {
                                name: '上传时间',
                                value: '2024-06-12'
                            },
                            {
                                name: '浓度',
                                value: '32(18 - 45)'
                            },
                            {
                                name: '信号强度',
                                value: '112'
                            },
                            {
                                name: '电量',
                                // value: `${Number(value.power) / 100}V`
                                value: '未知'
                            },
                            {
                                name: '进气口压强',
                                value: '124(115 - 150)',
                            },
                            {
                                name: '出气口压强',
                                value: '331(240 - 320)',
                            },

                        ].filter(Boolean);

                        // 井下设备格式化
                        // formatDeviceList.push({
                        //     fault: value.fault,
                        //     name: value.nickname  || '未知',
                        //     fieldList,
                        //     deviceType: DOWNHOLE,
                        //     status: deviceStatus,
                        //     position: [lng, lat],
                        //     id: value.uuid
                        // })

                        // 装载数据
                        formatDeviceList.push({
                            fault: value.fault,
                            name: `${value.name}4AMfft098`  || '未知',
                            fieldList,
                            deviceType: value.distinguish,
                            status: deviceStatus,
                            position: [lng+'', lat+''],
                            id: value.uuid,
                            iconText: deviceType_toStr(value.distinguish)[0]
                        });
                    });
                    // context.commit('updateDeviceStatus', formatDeviceList);
                    commit('setNewDeviceStatus', formatDeviceList); // 设置设备位置数据
                }
            })
        },
        updateMileageDeviceStatus(context) {
            request.post('getposition', {
                username: context.rootState.user.username,
                deviceType: 'mileage',
            }).then(res => {
                // console.log(res)
                let formatDeviceList = [];
                const positions = res.result;
                if (Array.isArray(positions)) {
                    positions.map((value) => {
                        // 设备状态的格式化
                        let deviceStatus = NORMAL;
                        if (isMileageFaultMsg(value)) {
                            deviceStatus = WARN;
                        }
                        if (isMileageWarnMsg(value)) {
                            deviceStatus = ERROR
                        }
                        // 设备的位置信息
                        let lat = value.latitude;
                        let lng = value.longitude;
                        const fieldList = [
                            {
                                name: '浓度',
                                value: value.CH4
                            },
                            {
                                name: '信号强度',
                                value: value.signal
                            },
                            {
                                name: '电量',
                                value: `${Number(value.power) / 100}V`
                            },
                        ].filter(Boolean);
                        if (deviceStatus === ERROR) {
                            fieldList.push({
                                name: '报警信息',
                                value: value.fault,
                            });
                        }
                        if (deviceStatus === WARN) {
                            fieldList.push({
                                name: '故障信息',
                                value: value.fault,
                            });
                        }
                        // 里程碑设备格式化
                        formatDeviceList.push({
                            fault: value.fault,
                            name: value.nickname,
                            fieldList,
                            deviceType: PageTypeEnum.MILEAGE,
                            status: deviceStatus,
                            position: [lng, lat],
                            id: value.id
                        })
                    });
                    context.commit('updateMileageDeviceStatus', formatDeviceList);
                }
            })
        },
        // 设置页面类型
        updateFilterType(context, filterTypes) {
            context.commit('updateFilterType', filterTypes);
        },
    }
}

export default moduleDevice;
