const fullScreenModule = {
    state: () => {
        return {
            fullscreen: !!document.fullscreenElement
        }
    },
    mutations: {
        updateFullScreenStatus(state) {
            state.fullscreen = !!document.fullscreenElement;
        }
    },
    actions: {
        updateFullScreenStatus(context) {
            context.commit('updateFullScreenStatus');
        }
    }
}

export default fullScreenModule;
