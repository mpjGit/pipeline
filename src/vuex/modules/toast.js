const moduleToast = {
    namespaced: true,
    state: () => ({
        message: ""
    }),
    getters: {
        toastMessage: state => {
            return state.message;
        },
    },
    mutations: {
        setToast(state, message) {
            state.message = message;
        }
    },
    actions: {
        showToast(context, {message,duration=2000}) {
            context.commit('setToast', message);
            setTimeout(() => {
                context.commit('setToast', '');
            }, duration)
        }
    }
}

export default moduleToast;
