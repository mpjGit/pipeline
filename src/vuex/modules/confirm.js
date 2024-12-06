const moduleConfirm = {
    state: () => ({
        show: false,
        message: '',
        onCancel: Function,
        onConfirm: Function,
        confirmMsg: '确定',
        cancelMsg: '取消'
    }),
    mutations: {
        showModal(state, {message, onConfirm, onCancel, confirmMsg, cancelMsg}) {
            state.message = message;
            state.show = true;
            state.onConfirm = onConfirm;
            state.onCancel = onCancel;
            state.confirmMsg = confirmMsg;
            state.cancelMsg = cancelMsg;
        },
        hideModal(state) {
            state.message = '';
            state.show = false;
        }
    },
    actions: {
        showModal(context, {message, onConfirm, onCancel, confirmMsg, cancelMsg}) {
            context.commit('showModal', {message, onConfirm, onCancel, confirmMsg, cancelMsg})
        },
        hideModal(context) {
            context.commit('hideModal', '')
        }
    }
}

export default moduleConfirm;

