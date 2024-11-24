import {request} from "@/utils/http";

const moduleMileageList = {
    namespaced: true,
    state: {
        list: [],
        total: 0,
        pageSize: 0,
        currentPage: 0,
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
        fetchPage: function(context, { page, query }) {
            if(!page) {
                page = context.state.currentPage||1
            }
            request.post(`getMileage?${query}`, {
                username: context.rootState.user.username,
                page: page,
            }).then(res => {
                let formatList = [];
                const {list, total, pagesize, currentpage} = res;
                list.map(item => {
                    formatList.push({
                        ...item,
                        id: item.id,
                        deviceName: item.devicename,
                        nickName: item.nickname,
                        alerts: item.alerts,
                        fault: item.fault,
                        concentration: item.CH4
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
        }

    }

}

export default moduleMileageList;
