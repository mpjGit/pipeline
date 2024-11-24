import {request} from "@/utils/http";
import {showsDeviceName} from "@/api/apiHandler";
import {cloneDeep} from "lodash-es";

const alertList = {
    namespaced: true,
    state: () => {
        return {
            list: [],
            total: 0,
            pageSize: 0,
            currentPage: 0,
            currentQuery: '',

            // 当前编辑的详情
            recordDetail: {

            }
        }
    },

    mutations: {
        updateData: function (state, {currentPage, list, total, pageSize}) {
            state.currentPage = currentPage;
            state.list = list;
            state.total = total;
            state.pageSize = pageSize;
        },
        updateRecordDetail: function(state, data) {
            state.recordDetail = cloneDeep(data);
        },
        clearRecordDetail: function (state) {
            state.recordDetail = null;
        }
    },

    actions: {
        fetchPage: function(context, {page , query}) {
            request.post(`getwwarn?${query}`, {
                username: context.rootState.user.username,
                page: page,
            }).then(res => {
                let formatList = [];
                const {list, total, pagesize, currentpage} = res;
                list.map(item => {

                    formatList.push({
                        ...item,
                        id: item.id,
                        name: item.nickname,
                        concentration: item.CH4,
                        resolve: item.resolve,
                        operator: item.implementer,
                        time: item.time
                    })
                });
                context.commit('updateData', {
                    currentPage: currentpage,
                    currentQuery: query,
                    total: total,
                    pageSize: pagesize,
                    list: formatList
                });
            })
        },
        // 获取单条记录
        fetchRecord: function(context, id) {
            request.post('selwwarn', {
                username: context.rootState.user.username,
                id
            }).then(async (res) => {
                const item = res[0];
                const showLiqManholeObj =  await showsDeviceName({ deviceName: item.devicename });
                const {
                    menjinzhuangtaiSupport,
                    nongduSupport,
                    wenduSupport,
                    yeweizhuangtaiSupport,
                } = showLiqManholeObj;
                console.log('showLiqManholeObj', showLiqManholeObj)
                const data = {
                    ...item,
                    id: item.id,
                    acquire: item.acquire,
                    name: item.nickname,
                    deviceName: item.devicename,
                    concentration: item.CH4,
                    temperature: item.temperature,
                    power: item.power,
                    resolve: item.resolve,
                    implementer: item.implementer,
                    time: item.time,
                    position: item.position,
                    update: item.update,
                    entrance_pressure: item.entrance_pressure,
                    exit_pressure: item.exit_pressure,
                    liq: item.liq, // 液位
                    manhole: item.manhole, // 井盖
                    manholeFlag: Number(menjinzhuangtaiSupport),
                    liqFlag: Number(yeweizhuangtaiSupport),
                    temperatureFlag: Number(wenduSupport),
                    concentrationFlag: Number(nongduSupport),
                };
                context.commit('updateRecordDetail', data);
            });
        },

        // 处理单条记录
        processRecord: function (context, {id, implementer}) {
            // {"username":"vset","id":1,"implementer":"张三","resolve":1}
            if(!implementer) {
                alert('请输入操作人员！')
                return false;
            }
            request.patch('exew', {
                username: context.rootState.user.username,
                id,
                implementer: implementer,
                resolve: 1
            }).then(res => {
                console.log(res);
                context.dispatch('fetchPage', {page: context.state.currentPage, query: context.state.currentQuery});
                context.commit('clearRecordDetail');
                context.dispatch('notification/refreshWarnList', {}, {root: true});
                context.dispatch('updateDeviceStatus', {}, {root: true});
            })
        }
    }
};

export default alertList;
