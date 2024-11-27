import {request} from "@/utils/http";
import {getEventById, getDeviceShowProper, fetchAllMapDevice} from "@/api/apiHandler";
import {isWarnMsg, isFaultMsg, isMileageWarnMsg, isMileageFaultMsg} from "@/utils/tool";
import EventBus from "@/utils/eventBus";
import Login from "@/pages/Login.vue";


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
        // 设置设备
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
        // 
        setNewDeviceStatus(state, deviceList) {
            const page = state.filterType[0];
            if (page === PageTypeEnum.MONITOR) {
                const showDevice = this.state.user.routes.map((item) => {
                    if (item.show) {
                        return item.type;
                    }
                    return false;
                }).filter(Boolean);
                deviceList = deviceList.filter((item) => {
                    return showDevice.includes(item.deviceType)
                });
            }
            // 更新除了井上设备的设备列表
            state.newDevices = deviceList;
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
            const {
                success,
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
            if (!success) {
                return;
            }
            const formatDeviceList = [];
            const pageType = rootState.device.filterType[0];
            detail.forEach((item) => {
                const {
                    type: deviceType,
                    statusId: deviceStatus,
                    latitude: lat,
                    longitude: lng,
                    deviceName,
                    id,
                } = item;

                let fieldList = default_field(item);
                if ([pageType, item.type].includes(PageTypeEnum.OPEN)) {
                    fieldList = open_field(item);
                }
                if ([pageType, item.type].includes(PageTypeEnum.HAND)) {
                    fieldList = hand_field(item);
                }
                fieldList.forEach((item) => {
                   if (item.name === '浓度') {
                       const currentUnit = this.getters["configs/unitInfo"];
                       item.value =`${currentUnit.transform(item.value).value}${currentUnit.text}`;
                   }
                });
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
            commit('setNewDeviceStatus', formatDeviceList);
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
        updateDeviceStatus({ rootState, context }) {
            fetchAllMapDevice({
                distinguish: rootState.user.data.distinguish,
                enterpriseUuid: rootState.user.enterpriseUuid
            }).then(res => {
                // console.log(res)
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
                                name: '浓度',
                                value: value.CH4 || '未知'
                            },
                            {
                                name: '信号强度',
                                value: value.signal || '未知'
                            },
                            {
                                name: '电量',
                                // value: `${Number(value.power) / 100}V`
                                value: '未知'
                            },
                            {
                                name: '进气口压强',
                                value: value.entrance_pressure || '未知',
                            },
                            {
                                name: '出气口压强',
                                value: value.exit_pressure || '未知',
                            }
                        ].filter(Boolean);

                        // 井下设备格式化
                        formatDeviceList.push({
                            fault: value.fault,
                            name: value.nickname  || '未知',
                            fieldList,
                            deviceType: DOWNHOLE,
                            status: deviceStatus,
                            position: [lng, lat],
                            id: value.uuid
                        })
                    });
                    context.commit('updateDeviceStatus', formatDeviceList);
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
        updateFilterType(context, filterTypes) {
            context.commit('updateFilterType', filterTypes);
        },
    }
}

export default moduleDevice;
