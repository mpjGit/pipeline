import {request} from "@/utils/http";
//临时添加fault to string
const faultList = {
    namespaced: true,
    state: () => {
        return {
            list: [],
            total: 0,
            pageSize: 0,
            currentPage: 0,
            currentQuery: '',

            // 当前条件
            // conditions: {
            //     nickName: '',
            //     startTime: 0,
            //     endTime: 0,
            //     implementer: ''
            // },

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

        updateRecordDetail: function (state, data) {
            state.recordDetail = {
               ...data,
            };
        },
        clearRecordDetail: function(state) {
            state.recordDetail = null;
        }

    },

    actions: {
        fetchPage: function(context, {page, query}) {
            console.log('query :>> ', query);
            request.post(`getFaultMileage?${query}`, {
                username: context.rootState.user.username,
                page: page,
            }).then(res => {
                let formatList = [];
                const {list, total, pagesize, currentpage} = res;
                list.map(item => {
                    formatList.push({
                        ...item,
                        id: item.id,
                        // name: item.devicename,
                        name: item.nickname,
                        //fault_reason: item.fault,
                        fault_reason: MILEAGE_FAULT_MAP[Number(item.fault)],
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
            request.post('mileageFaultByUsername', {
                username: context.rootState.user.username,
                id
            }).then(res => {
                const item = res[0];
                const data = {
                    ...item,
                    id: item.id,
                    // name: item.devicename,
                    name: item.nickname,
                    fault_reason: item.fault,
                    resolve: item.resolve,
                    implementer: item.implementer,
                    time: item.time,
                    position: item.position
                };
                console.log('data', data)
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
            request.patch('handleMileageFault', {
                username: context.rootState.user.username,
                id,
                implementer: implementer,
                resolve: 1
            }).then(res => {
                console.log(res);
                context.dispatch('fetchPage', {page: context.state.currentPage, query: context.state.currentQuery});
                context.commit('clearRecordDetail');
                context.dispatch('notification/refreshMileageFaultList', {}, {root: true})
                context.dispatch('updateDeviceStatus', {}, {root: true});
            })
        }
    }
};

export default faultList;
