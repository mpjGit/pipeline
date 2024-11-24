import {handleCarHandAlertWarn, handleOpenFaults, handleOpenWarns} from "@/api/apiHandler";
import EventBus from "@/utils/eventBus";
import moment from "moment/moment";

const moduleAlert = {
    state: () => ({
        alertMessage: ""
    }),
    getters: {
        alertMessage: state => {
            return state.alertMessage;
        },
    },
    mutations: {
        setAlert(state, message) {
            state.alertMessage = message;
        }
    },
    actions: {
        showAlert(context, message) {
            context.commit('setAlert', message)
        },
        hideAlert(context) {
            context.commit('setAlert', '')
        },
        async handleAlertWarn({ rootState, dispatch }, params) {
            const {
                resolveName,
                id,
                statusType,
            } = params;
            console.log('params', params);
            const pageType = rootState.device.filterType[0];
            const isOpenPage = pageType === PageTypeEnum.OPEN;
            let apiFn = handleCarHandAlertWarn;
            if (isOpenPage) {
                if (statusType === '报警') {
                    apiFn = handleOpenWarns;
                } else {
                    apiFn = handleOpenFaults;
                }
            }
            const req = {
                // ...params,
                id: id,
                resolveName,
                type: statusType,
                resolveTime: moment().format('yyyy-MM-DD HH:mm:ss'),
            };
            const monitorTab = rootState.device.notificationTab;
            if (isOpenPage || monitorTab === PageTypeEnum.OPEN) {
                delete req.resolveTime;
                delete req.type;
            }
            const res = await apiFn(req);
            if (!res.success) {
                console.error('处理警报故障出现异常');
            }
            EventBus.$emit('refreshPage', {});
            dispatch('notification/refreshNewWarnFaultList', {}, { deep: true });
        },
    }
}

export default moduleAlert;
