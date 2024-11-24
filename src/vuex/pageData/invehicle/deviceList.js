import {request} from "@/utils/http";

const moduleDownholeList = {
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
        fetchPage: function(context, page) {
            request.post('getcar', {
                username: context.rootState.user.username,
                page: page,
            }).then(res => {
                console.log('res :>> ', res);
                let formatList = [];
                const {list, total, pagesize, currentpage} = res;
                list.map(item => {
                    console.log('getcar车载 :>> ',item)
                    formatList.push({
                        id: item.id,
                        deviceName: item.devicename,
                        nickName: item.nickname,
                        speed: item.nospeed,
                        alerts: item.alerts,
                        fault: item.fault,
                        concentration: item.CH4,
                        countAlert: item.count_alert,
                        countFault: item.count_fault
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

}

export default moduleDownholeList;
