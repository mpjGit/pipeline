import {request} from "@/utils/http";

export const UNIT_ARRAY = {
    '1': {
        id: '1',
        text: 'ppm',
        transform: (n) => ({
            //value: (n * 10000)
            value: Number(n)
        }),
        transBack: (n) => ({
            //value: (n/10000)
            value: Number(n)
        })
    },
    '2': {
        id: '2',
        text: '% vol',
        transform: (n) => ({
            //value: n,
            value: (Number(n)/10000),
        }),
        transBack: (n) => ({
           // value: n
            value: (Number(n) * 10000)
        })
    },
    '3': {
        id: '3',
        text: '% LEL',
        transform: (n) => ({
            //value: (n * 20)
            value: (Number(n) /500)
        }),
        transBack: (n) => ({
           // value: n/20
            value: (Number(n)*500)
        })
    }
};

const DEFAULT_KEY = '1';

const moduleConfigs = {
    namespaced: true,
    state: () => ({
            defaultUnit: DEFAULT_KEY
        }),
    getters: {
        unitInfo: (state) => {
            return UNIT_ARRAY[Number(state.defaultUnit)];
        }
    },
    mutations: {
        updateUnit: function (state, key) {
            state.defaultUnit = key;
        }
    },
    actions: {
        getCurrentUnit: function (context) {
            request.post('getunit', {
                username: context.rootState.user.username,
            }).then(unitRes => {
                // 更新Unit
                const {result} = unitRes;
                const {unit} = result;
                context.commit('updateUnit', unit.toString());
            })
        },
        setUnit: function(context, {unitId}) {
            request.patch('unit', {
                username: context.rootState.user.username,
                unit: unitId
            }).then(res => {
                console.log(res);
                context.dispatch('getCurrentUnit');
            })
        }
    }
};

export default moduleConfigs;
