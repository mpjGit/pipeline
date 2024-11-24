import { request } from "@/utils/http";

const historyList = {
    namespaced: true,
    state: () => {
        return {
            list: [],
            total: 0,
            pageSize: 0,
            currentPage: 0,

            // 详情
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
        }
    },

    actions: {
        fetchPage: function(context, {page, query}) {
            console.log('page :>> ', page);
            console.log('context :>> ', context);
            console.log('query :>> ', query);
            request.post(`getHistoryMileage?${query}`, {
                username: context.rootState.user.username,
                page: page,
            }).then(res => {
                let formatList = [];
                const {list, total, pagesize, currentpage} = res;
                list.map(item => {
                    formatList.push({
                        id: item.id,
                        name: item.nickname,
                        concentration: item.CH4,
                        CH4: item.CH4,
                        resolve: item.resolve,
                        operator: item.implementer,
                        time: item.time,
                        low_alert: item.low_alert,
                        fault: item.fault,
                        alerts: item.alerts,
                        liq: item.liq,
                        manhole: item.manhole,
                        signal: item.signal,
                        position: item.position,
                        temperature: item.temperature,
                        update: item.update,
                        acquire: item.acquire,
                        entrance_pressure: item.entrance_pressure,
                        exit_pressure: item.exit_pressure

                    })
                });
                context.commit('updateData', {
                    currentPage: currentpage,
                    total: total,
                    pageSize: pagesize,
                    list: formatList
                });
            })
        }
    }
};

export default historyList;
