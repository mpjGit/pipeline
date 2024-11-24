const modulePlayer = {
    state: () => ({
        currentPlayUrl: null
    }),
    mutations: {
        playNewVideo: function (state, url) {
            state.currentPlayUrl = url;
        }
    },
    actions: {
        playNewVideo: function (context, url) {
            context.commit('playNewVideo', url);
        },
        clearVideo: function (context) {
            context.commit('playNewVideo', null);
        }
    }
}

export default modulePlayer;
