import Vue from 'vue';
import VectorInfoModalVue from './VectorInfoModal.vue';
import store from "@/vuex/store";


const VectorInfoModalConstructor = Vue.extend(VectorInfoModalVue);
let instance;


const initModal = () => {
    instance = new VectorInfoModalConstructor({
        el: document.createElement('div'),
        store,
    });
};

const showModal = (options) => {
    if (!instance) {
        initModal();
    }
    instance.action = '';
    if (instance.visible) {
        instance.closeDialog();
        instance.visible = false;
        initModal();
    }
    Object.keys(options).forEach((prop) => {
        instance[prop] = options[prop];
    });
    try {
        let appDom = document.querySelector('#map-container');
        if (!appDom) {
            appDom = document.body;
        }
        appDom.appendChild(instance.$el);
    } catch (e) {
        console.warn(e);
    } finally {
        document.body.appendChild(instance.$el);
    }

    // instance.$mount();
    Vue.nextTick(() => {
        instance.visible = true;
    });
};

const VectorInfoModal = function (options) {
    if (Vue.prototype.$isServer) return;
    showModal(options)
};

VectorInfoModal.close = () => {
    if (instance) {
        instance.closeDialog();
        instance.visible = false;
    }
};

export default VectorInfoModal;
