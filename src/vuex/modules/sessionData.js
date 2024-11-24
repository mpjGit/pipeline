const sessionData = {
    state: () => ({
        adminLogin: false,
    }),
    getters: {
        adminLogin(state) {
            return state.adminLogin;
        },
    },
    mutations: {
        updateAdminLogin(state, data) {
            state.adminLogin = data;
        }
    },
}

export default sessionData;
