const moduleConfirm = {
    state: () => ({
        show: false,
        message: '',
        onCancel: Function,
        onConfirm: Function
    }),
    mutations: {
        showModal(state, {message, onConfirm, onCancel}) {
            state.message = message;
            state.show = true;
            state.onConfirm = onConfirm;
            state.onCancel = onCancel;
        },
        hideModal(state) {
            state.message = '';
            state.show = false;
        }
    },
    actions: {
        showModal(context, {message, onConfirm, onCancel}) {
            context.commit('showModal', {message, onConfirm, onCancel})
        },
        hideModal(context) {
            context.commit('hideModal', '')
        }
    }
}

export default moduleConfirm;

