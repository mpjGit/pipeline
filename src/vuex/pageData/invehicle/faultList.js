import {request} from "@/utils/http";

const faultList = {
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
        updateData: function (state, {currentPage, list, total, pageSize, query}) {
            state.currentPage = currentPage;
            state.currentQuery = query;
            state.list = list;
            state.total = total;
            state.pageSize = pageSize;
        },

        updateRecordDetail: function (state, {id, name, fault_reason, resolve, implementer, time, position}) {
            state.recordDetail = {
                id,
                name,
                fault_reason: fault_reason.toString(),
                resolve,
                implementer,
                time,
                position
            };
        },
        clearRecordDetail: function(state) {
            state.recordDetail = null;
        }

    },

    actions: {
        fetchPage: function(context, {page, query}) {
            request.post(`getwfault?${query}`, {
                username: context.rootState.user.username,
                page: page,
            }).then(res => {
                let formatList = [];
                const {list, total, pagesize, currentpage} = res;
                list.map(item => {
                    formatList.push({
                        id: item.id,
                        name: item.devicename,
                        nickname: item.nickname,
                        fault_reason: item.fault,
                        resolve: item.resolve,
                        implementer: item.implementer,
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
            request.post('selwfault', {
                username: context.rootState.user.username,
                id
            }).then(res => {
                const item = res[0];
                const data = {
                    id: item.id,
                    name: item.devicename,
                    fault_reason: item.fault,
                    resolve: item.resolve,
                    implementer: item.implementer,
                    time: item.time,
                    position: item.position
                };
                context.commit('updateRecordDetail', data);
            });
        },

        // 处理单条记录
        processRecord: function (context, {id, implementer}) {
            // {"username":"vset","id":1,"implementer":"张三","resolve":1}
            if(!implementer) {
                alert('请选择操作人员！')
                return false;
            }
            request.patch('exef', {
                username: context.rootState.user.username,
                id,
                implementer: implementer,
                resolve: 1
            }).then(res => {
                console.log(res);
                context.dispatch('fetchPage', {page:context.state.currentPage, query: context.state.currentQuery});
                context.commit('clearRecordDetail');
                context.dispatch('notification/refreshFaultList', {}, {root: true})
                context.dispatch('updateDeviceStatus', {}, {root: true});
            })
        }
    }
};

export default faultList;
