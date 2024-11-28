import {request} from "@/utils/http";
import Vue from "vue";
import {
    deleteHandCarALertInfo,
    deleteOpenALertInfo,
    getAlertListAll,
    getAlertListByType,
    deleteOpenFaultInfo,
    deleteHandCarFaultInfo, delJinxiaGuzhang, delJinxiaAlert, delJinxiaLishi
} from "@/api/apiHandler";
import Router from "@/router";

function formatWarnFlag(value, filterType) {
    const {id, deviceId, jid, type, deviceType, deviceTypeWarnFault} = value;
    // 老逻辑直接不动，不敢碰
    if (deviceTypeWarnFault === DOWNHOLE || filterType === DOWNHOLE || filterType === PageTypeEnum.DOWNHOLE) {
        // // 是否是车载设备
        // if (isInVehicle(value)) {
        //     return (id || jid) + INVEHICLE;
        // }
        return (id || jid || deviceId) + DOWNHOLE;
    }

    if (deviceTypeWarnFault === PageTypeEnum.MILEAGE) {
        return (id || jid || deviceId) + PageTypeEnum.MILEAGE;
    }

    return `${id || deviceId}${pageTypeMap[type || deviceType || filterType]}`
}


const moduleNotification = {
    namespaced: true,
    state: () => {
        return {
            warnList: [],
            faultList: [],

            // 报警静音数组
            warnMuteList: [],
            // 错误静音数组
            faultMuteList: [],



            // 所有报警和故障的数据处理
            monitorData: {
                downHoleWarn: [],
                downHoleFault: [],
                mileageWarn: [],
                mileageFault: [],
                otherWarn: [],
                otherFault: [],
                // 车载设备
                chezainum: 0,
                // 开路设备
                kailunum: 0,
                // 手持设备
                shouchinum: 0,
            },
        };
    },
    getters: {
        shouldPlayAlert: function (state, getters, rootState) {
            const [deviceType] = rootState.device.filterType;
            // if (deviceType === PageTypeEnum.MONITOR) {
            const downHoleWarnList = state.monitorData.downHoleWarn;

            const downHoleFaultList = state.monitorData.downHoleFault;

            const otherHoleWarnList = state.monitorData.otherWarn;

            const otherHoleFaultList = state.monitorData.otherFault;

            const alarmArr = [...downHoleWarnList, ...downHoleFaultList, ...otherHoleWarnList, ...otherHoleFaultList].map(value => formatWarnFlag(value, deviceType))

            const filterAlarm = alarmArr.filter(o => state.warnMuteList.indexOf(o) < 0 && state.faultMuteList.indexOf(o) < 0);

            return filterAlarm.length > 0 && !(Router?.history?.current?.path === '/login');
            // }

            // warn提示列表中 包含id 和 jid的返回， 都要考虑
            // format warn flag change value
            // let currentWarnListId = state.warnList.map(value => formatWarnFlag(value, deviceType));
            //
            // let currentFaultListId = state.faultList.map(value => formatWarnFlag(value, deviceType));
            //
            //
            // let needAlarmArray = currentWarnListId.filter(o => state.warnMuteList.indexOf(o) < 0);
            //
            // let needAlarmArray_2 = currentFaultListId.filter(o => state.faultMuteList.indexOf(o) < 0);
            //
            // return needAlarmArray.length > 0 || needAlarmArray_2.length > 0;
        }
    },
    mutations: {
        setMonitorAllNum(state, data) {
            state.monitorData = {
                ...state.monitorData,
                ...data,
            }
        },

        updateWarnList: function (state, warnList) {
            state.warnList = warnList;
        },
        updateFaultList: function (state, faultList) {
            state.faultList = faultList;
        },
        setMonitorDownHoleWarnList: function (state, warnList) {
            warnList.forEach((item) => item.deviceTypeWarnFault = DOWNHOLE)
            Vue.set(state.monitorData, 'downHoleWarn', warnList);
        },
        setMonitorDownHoleFaultList: function (state, faultList) {
            faultList.forEach((item) => item.deviceTypeWarnFault = DOWNHOLE)
            Vue.set(state.monitorData, 'downHoleFault', faultList);
        },

        setMonitorMileageWarnList: function (state, warnList) {
            warnList.forEach((item) => item.deviceTypeWarnFault = PageTypeEnum.MILEAGE)
            Vue.set(state.monitorData, 'mileageWarn', warnList);
        },
        setMonitorMileageFaultList: function (state, faultList) {
            faultList.forEach((item) => item.deviceTypeWarnFault = PageTypeEnum.MILEAGE)
            Vue.set(state.monitorData, 'mileageFault', faultList);
        },

        setMonitorWarnList: function (state, warnList) {
            Vue.set(state.monitorData, 'otherWarn', warnList);
        },
        setMonitorFaultList: function (state, faultList) {
            Vue.set(state.monitorData, 'otherFault', faultList);
        },

        muteWarnItem: function (state, flag) {
            let index = state.warnMuteList.indexOf(flag);
            if (index === -1) {
                state.warnMuteList.push(flag)
            } else {
                state.warnMuteList.splice(index, 1);
            }
        },
        muteFaultItem: function (state, flag) {
            let index = state.faultMuteList.indexOf(flag);
            if (index === -1) {
                state.faultMuteList.push(flag)
            } else {
                state.faultMuteList.splice(index, 1);
            }
        },
        muteAll: function (state) {
            const [deviceType] = this.state.device.filterType;
            // let faultList = state.faultList;
            // let warnList = state.warnList;
            // if (deviceType === PageTypeEnum.MONITOR) {
            let warnList;
            let faultList;
            state.monitorData.downHoleWarn.forEach((item) => item.deviceTypeWarnFault = DOWNHOLE);
            state.monitorData.downHoleFault.forEach((item) => item.deviceTypeWarnFault = DOWNHOLE);
            warnList = [...state.monitorData.downHoleWarn, ...state.monitorData.otherWarn, ...state.monitorData.mileageWarn];
            faultList = [...state.monitorData.downHoleFault, ...state.monitorData.otherFault, ...state.monitorData.mileageFault]
            const mapFaultList = faultList.map(fault => formatWarnFlag(fault, deviceType));
            const mapWarnList = warnList.map(warn => formatWarnFlag(warn, deviceType));
            state.faultMuteList = Array.from(new Set([...mapFaultList, ...state.faultMuteList]))
            state.warnMuteList = Array.from(new Set([...mapWarnList, ...state.warnMuteList]))
        }
    },

    actions: {
        // 删除警报信息
        async deleteAlert(context, {type, ids}) {
            if (type === PageTypeEnum.OPEN) {
                await deleteOpenALertInfo({ id: ids.join('-') });
                return;
            }
            if (type === PageTypeEnum.DOWNHOLE || type === 'downhole') {
                await delJinxiaAlert({ id: ids.join('-') });
                return;
            }
            await deleteHandCarALertInfo({ id: ids.join('-') });
        },
        // 删除故障信息
        async deleteFault(context, {type, ids}) {
            if (type === PageTypeEnum.OPEN) {
                await deleteOpenFaultInfo({ id: ids.join('-') });
                return;
            }
            if (type === PageTypeEnum.DOWNHOLE || type === 'downhole') {
                await delJinxiaGuzhang({ id: ids.join('-') });
                return;
            }
            await deleteHandCarFaultInfo({ id: ids.join('-') });
        },
        // 删除故障信息
        async deleteHistory(context, {type, ids}) {
            if (type === PageTypeEnum.DOWNHOLE || type === 'downhole') {
                await delJinxiaLishi({ id: ids.join('-') });
                return;
            }
        },
        // 监控中心处理除井下设备外的所有列表
        async refreshMonitorWarnFaultList({commit, rootState}) {
            const req = {
                id: rootState.user.userId,
            };
            const {
                success,
                detail,
                chezainum,
                kailunum,
                shouchinum,
            } = await getAlertListAll(req);
            if (!success) {
                console.error('报警数据请求失败');
                return [];
            }
            const warnList = [];
            const faultList = [];
            commit('setMonitorAllNum', {
                chezainum,
                kailunum,
                shouchinum,
            });
            detail.czlistandsclist.forEach((item) => {
                if (item.status === '报警') {
                    item.statusType = 'error';
                    warnList.push(item);
                    return;
                }
                item.statusType = 'warn';
                faultList.push(item);
            });
            detail.bjlsit.forEach((item) => {
                item.statusType = 'error';
                item.userName = item.username;
                item.deviceName = item.devicename;
                item.type = PageTypeEnum.OPEN;
                warnList.push(item);
            });
            detail.gzlsit.forEach((item) => {
                item.statusType = 'warn';
                item.userName = item.username;
                item.deviceName = item.devicename;
                item.type = PageTypeEnum.OPEN;
                faultList.push(item);
            })
            commit('setMonitorFaultList', [...faultList])
            commit('setMonitorWarnList', [...warnList])
        },
        async initNotificationData({ commit }) {
            commit('setMonitorFaultList', []);
            commit('setMonitorWarnList', []);
            commit('setMonitorDownHoleWarnList', []);
            commit('setMonitorDownHoleFaultList', []);
        },
        // 新接口刷新全部的故障和报警数据
        async refreshNewWarnFaultList({commit, rootState}) {
            const [deviceType] = rootState.device.filterType;
            const req = {
                id: rootState.user.userId,
                resolve: 0,
                types: pageTypeMap[deviceType],
            };
            const {success, detail} = await getAlertListByType(req);
            if (!success) {
                console.error('报警数据请求失败');
                return [];
            }
            const warnList = [];
            const faultList = [];
            if ([PageTypeEnum.HAND, PageTypeEnum.INVEHICLE].includes(deviceType)) {
                detail.czlistandsclist.forEach((item) => {
                    if (item.status === '报警') {
                        item.statusType = 'error';
                        warnList.push(item);
                        return;
                    }
                    item.statusType = 'warn';
                    faultList.push(item);
                });
            } else {
                detail.bjlsit.forEach((item) => {
                    item.statusType = 'error';
                    item.userName = item.username;
                    item.deviceName = item.devicename;
                    item.type = PageTypeEnum.OPEN;
                    warnList.push(item);
                });
                detail.gzlsit.forEach((item) => {
                    item.statusType = 'warn';
                    item.userName = item.username;
                    item.deviceName = item.devicename;
                    item.type = PageTypeEnum.OPEN;
                    faultList.push(item);
                })
            }
            commit('setMonitorFaultList', [...faultList])
            commit('setMonitorWarnList', [...warnList])
            // commit('updateFaultList', [...faultList])
            // commit('updateWarnList', [...warnList])
        },

        refreshWarnList: function (context) {
            const page = context.rootState.device.filterType[0]; // 页面类型
            const req = {};
            if (page === PageTypeEnum.MILEAGE) {
                req.deviceType = 'mileage';
            }
            request.post('allwarn', {username: context.rootState.user.username , ...req}).then(res => {
                // context.commit('updateWarnList', [...res])
                // if (context.rootState.device.filterType[0] === PageTypeEnum.MONITOR) {
                context.commit('setMonitorDownHoleWarnList', [...res])
                // }
            });
        },

        refreshFaultList: function (context) {
            const page = context.rootState.device.filterType[0];
            const req = {};
            if (page === PageTypeEnum.MILEAGE) {
                req.deviceType = 'mileage';
            }
            request.post('allfault', {username: context.rootState.user.username , ...req}).then(res => {
                // context.commit('updateFaultList', [...res])
                // if (context.rootState.device.filterType[0] === PageTypeEnum.MONITOR) {
                context.commit('setMonitorDownHoleFaultList', [...res])
                // }
            });
        },


        refreshMileageWarnList: function (context) {
            const page = context.rootState.device.filterType[0];
            const req = {};
            req.deviceType = 'mileage';
            request.post('allwarn', {username: context.rootState.user.username , ...req}).then(res => {
                // context.commit('updateWarnList', [...res])
                // if (context.rootState.device.filterType[0] === PageTypeEnum.MONITOR) {
                context.commit('setMonitorMileageWarnList', [...res])
                // }
            });
        },

        refreshMileageFaultList: function (context) {
            const page = context.rootState.device.filterType[0];
            const req = {};
            req.deviceType = 'mileage';
            request.post('allfault', {username: context.rootState.user.username , ...req}).then(res => {
                // context.commit('updateFaultList', [...res])k
                // if (context.rootState.device.filterType[0] === PageTypeEnum.MONITOR) {
                context.commit('setMonitorMileageFaultList', [...res])
                // }
            });
        },

        clearAllWarnFault({commit}) {
            commit('setMonitorDownHoleFaultList', []);
            commit('setMonitorDownHoleWarnList', []);
            commit('setMonitorWarnList', []);
            commit('setMonitorFaultList', []);
        },

        muteItem: function (context, {notificationType, deviceType, deviceId}) {
            const muteId = formatWarnFlag({
                deviceId,
                deviceType,
            }, deviceType);

            if (notificationType === ERROR) {
                context.commit('muteWarnItem', muteId)
            } else {
                context.commit('muteFaultItem', muteId)
            }
        },
        muteAll: function (context) {
            context.commit('muteAll');
        }
    }

}

export default moduleNotification;
