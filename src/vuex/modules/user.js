// import CryptoJS from 'crypto';
import {request} from "@/utils/http";
import {getLeftSupportDevice, getUserIdByName, loginUser} from "@/api/apiHandler";
import RoutesConstant, {typeMap} from "@/vuex/constant/RoutesConstant";
import VectorInfoModal from "@/components/modals/modalComponents/VectorInfoModal";
import EventBus from "@/utils/eventBus";
const CryptoJS = require("crypto-js");

const moduleUser = {
    state: () => ({
        userId: 1,
        username: "",
        isAdmin: 0,
        token: null,
        errorMessage: '',
        data: {},
        enterpriseUuid: '',
        routes: RoutesConstant, // 拿到设置的所有的路由
    }),
    mutations: {
        setUserInfo(state, {username, data, isAdmin}) {
            state.username = username;
            state.isAdmin = isAdmin;
            state.data = data;
        },
        setUserId(state, userId) {
            state.enterpriseUuid = userId;
        },
        setUserRoutes(state, data) {
            state.routes = data;
        },
        setErrorMessage(state, {errorMessage}) {
            state.errorMessage = errorMessage;
        }
    },
    getters: {
        getShowRoutes(state) {
            if (RoutesConstant[0].version !== state.routes[0].version) {
                state.routes = RoutesConstant;
            }
            return state.routes.filter((item) => item.show);
        },
        getShowRoutesType(state) {
            return state.routes.filter((item) => item.show).map(item => item.type);
        },
    },
    actions: {
        // 获取左侧导航列表
        async getUserRoutes({state}) {
            const { routes, enterpriseUuid } = state;
            if (!enterpriseUuid) {
                return;
            }
            const routeData = [
                {
                    createAt: "2024-11-19 14:57:17",
                    deviceUuid: "",
                    distinguish: "DEVICE_ALL",
                    enterpriseUuid: "",
                    path: '/deviceall',
                    sort: 2,
                    uuid: ''
                }
            ];
            const { code, data } = await getLeftSupportDevice({ enterpriseUuid: enterpriseUuid });
            if (code !== 200) {
                return;
            }


            // 设置对应的路由path
            if (data.length) {
                for (let i = 0; i < data.length; i++) {
                    data[i].path = routes[i + 1].path;
                    data[i].en = routes
                    routeData.push(data[i]);
                }
            }
            
            // Object.keys(detail).forEach((key) => {
            //     if (key === 'userId') {
            //         return;
            //     }
            //     const pageType = typeMap[key];
            //     routes.find((item) => item.type === pageType).show = detail[key];
            // });
            return routeData.length ? routeData : [];
        },
        login(context, {username, password}) {
            // 密码 md5 加密
            const psw = CryptoJS.MD5(password);
            // 进行网络请求
            loginUser({
                username,
                encryption: psw.toString(),
            }).then(res => {
                const {code, message, data} = res;
                if (code === 200) {
                    EventBus.$emit('handleLoginDialog', true);
                    context.commit('setUserInfo', {
                        username: username,
                        data: data,
                        isAdmin: Number(data.is_admin),
                    });
                    // 管理员登录需要标识
                    if (Number(data.is_admin)) {
                        VectorInfoModal.close();
                        this.commit('updateAdminLogin', true);
                    }
                    context.commit('setUserId', data.enterpriseUuid);
                } else {
                    if (message === '令牌错误') {
                        VectorInfoModal({
                            info: {username, password},
                            type: ModalActionEnum.LING_PAI,
                        });
                        return;
                    }
                    context.commit('setErrorMessage', {
                        errorMessage: '用户名或密码错误'
                    })
                }
            })

        },
        setErrorMessage(context, errorMessage) {
            context.commit('setErrorMessage', {
                errorMessage
            });
        }

    }
}

export default moduleUser;
