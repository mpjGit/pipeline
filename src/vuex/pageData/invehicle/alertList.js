import {request} from "@/utils/http";

const alertList = {
    namespaced: true,
    state: () => {
        return {
            list: [],
            total: 0,
            pageSize: 0,
            currentPage: 0,

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
        updateRecordDetail: function(state, {id,exe_time, remarks, screenshot, implementer, resolve, video}) {
            state.recordDetail = {
                id,
                exe_time,
                implementer,
                video,
                resolve,
                remarks,
                screenshot
            };
        },
        clearRecordDetail: function (state) {
            state.recordDetail = null;
        }
    },

    actions: {
        fetchPage: function(context, {page, query}) {
            request.post(`getcwarn?${query}`, {
                username: context.rootState.user.username,
                page: page,
            }).then(res => {
                let formatList = [];
                const {list, total, pagesize, currentpage} = res;
                list.map(item => {

                    formatList.push({
                        id: item.jid,
                        name: item.deviceName,
                        concentration: item.CH4,
                        resolve: item.resolve,
                        operator: item.implementer,
                        time: item.starttime
                    })
                });
                context.commit('updateData', {
                    currentPage: currentpage,
                    total: total,
                    pageSize: pagesize,
                    list: formatList
                });
            })
        },
        // 获取单条记录
        fetchRecord: function(context, jid) {
            request.post('selcwarn', {
                username: context.rootState.user.username,
                jid
            }).then(res => {
                const item = res.list[0];
                const data = {
                    id: item.jid,
                    exe_time: item.exe_time,
                    remarks: item.remarks,
                    video: item.photoImaPath,
                    resolve: item.resolve,
                    screenshot: item.screenshotImaPath,
                    implementer: item.implementer
                };
                context.commit('updateRecordDetail', data);
            });
        },

        // 处理单条记录
        processRecord: function (context, {id, implementer, remarks}) {
            // {"username":"vset","id":1,"implementer":"张三","resolve":1}
            if(!implementer) {
                alert('请选择操作人员！')
                return false;
            }
            if(!remarks) {
                alert('请输入备注！')
                return false;
            }
            request.patch('execw', {
                username: context.rootState.user.username,
                jid: id,
                remarks,
                implementer: implementer,
                resolve: 1
            }).then(res => {
                console.log(res);
                context.dispatch('fetchPage', {page: context.state.currentPage});
                context.commit('clearRecordDetail');
                context.dispatch('notification/refreshWarnList', {}, {root: true})
                context.dispatch('updateDeviceStatus', {}, {root: true});
            })
        }
    }
};

export default alertList;
