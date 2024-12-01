import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import store from './vuex/store'
import {request} from "@/utils/http";
import VectorCheckbox from "@/components/checkbox/Checkbox.vue"
import VectorSwitch from "@/components/checkbox/Switch.vue"
import ImageWrap from "@/components/image/imageWrap.vue";
// import SummaryContent from "@/pages/SummaryContent";
import 'element-ui/lib/theme-chalk/index.css';
import router from '@/router/index'
import VectorInfoModal from "@/components/modals/modalComponents/VectorInfoModal";
import '@/styles/ele-ui-overwrite.css';

import {
    Popover, Button, DatePicker, TimePicker, Tabs, TabPane, Autocomplete, Tooltip, Switch, select, Option,
    OptionGroup, Form, FormItem, Input, Descriptions, DescriptionsItem, Card, Row, Col, Menu, Submenu, MenuItem, MenuItemGroup
} from 'element-ui';
import {cloneDeep} from "lodash-es";
import EventBus from "@/utils/eventBus";


Vue.config.productionTip = false
Vue.use(VueRouter)

// 组件注册
Vue.component('v-image', ImageWrap)
Vue.component('v-checkbox', VectorCheckbox)
Vue.component('v-switch', VectorSwitch)

Vue.component(Popover.name, Popover);
Vue.component(Button.name, Button);
Vue.component(DatePicker.name, DatePicker);
Vue.component(TimePicker.name, TimePicker);
Vue.component(Tabs.name, Tabs);
Vue.component(Autocomplete.name, Autocomplete);
Vue.component(TabPane.name, TabPane);
Vue.component(Tooltip.name, Tooltip);
Vue.component(Tooltip.name, Tooltip);
Vue.component(Form.name, Form);
Vue.component(FormItem.name, FormItem);
Vue.component(Input.name, Input);
Vue.component(Descriptions.name, Descriptions);
Vue.component(DescriptionsItem.name, DescriptionsItem);
Vue.component(Row.name, Row);
Vue.component(Col.name, Col);
Vue.component(Menu.name, Menu);
Vue.component(Submenu.name, Submenu);
Vue.component(MenuItem.name, MenuItem);
Vue.component(MenuItemGroup.name, MenuItemGroup);
Vue.component(Card.name, Card);
Vue.use(select);
Vue.use(Option);
Vue.use(OptionGroup);
Vue.use(Switch);
// 缓存地图未初始化成功时的函数队列
window.ON_MAP_READY_FUNCTION_QUEUE = [];

Vue.prototype.$vModal = VectorInfoModal;

Vue.prototype.$bus = EventBus;

// 注入全局函数
Vue.mixin({
    methods: {
        formatTimeHours(min) {
            if (isNaN(min)) return '输入的分钟数无效。';
            min = Number(min);
            const hours = Math.floor(min / 60);
            const minutes = min % 60;
            if (hours === 0) {
                return `${minutes}分钟`;
            } else {
                return `${hours}小时 ${minutes}分钟`;
            }
        },
        getPressShowByDeviceName(deviceName) {
            if (!deviceName) {
                return false;
            }
            return String(this.allDevicesShowProp[deviceName]?.jinqikouyaliSupport) === '1';
        },
        sleep(ms) { //sleep延迟方法
            const unixtime_ms = new Date().getTime();
            while (new Date().getTime() < unixtime_ms + ms) {
                console.log(1)
            }
        },
        play(url) {
            store.dispatch('playNewVideo', url);
        },
        stop(url) {
            store.dispatch('clearVideo', url);
        },
        getMap() {
            return window._map;
        },
        setMap(map) {
            window._map = map;

            // 运行所有队列内的函数
            let foo = [].concat(window.ON_MAP_READY_FUNCTION_QUEUE);
            window.ON_MAP_READY_FUNCTION_QUEUE = [];
            // this.log("map ready")
            foo.map(value => {
                value && value(map);
            }) // 函数运行结束

        },
        send: function (url, data) {
            return request.get(url, data);
        },

        // 创建设备标点
        createIconMarker: function (value) {
            // 初始化地图
            let map = this.getMap();
            // 创建设备标点
            let marker = new BasicMarker({
                ...value,
                deviceStatus: value.deviceStatus || NORMAL,

            });
            // 将设备标点增加到地图上
            setTimeout(() => {
                map.addOverlay(marker);
            })
            // 返回数据、及部分操作函数
            return {
                remove: () => {
                    map.removeOverlay(marker);
                },
                marker: marker
            }
        },

        // 清空地图
        clearMap: function () {
            // this.log('clear map by function');

            let alloverlays = this.getMap().getOverlays();
            alloverlays.map(value => {
                this.getMap().removeOverlay(value)
            })
        },

        // 地图初始化结束
        onMapReady: function (callback) {
            if (this.getMap()) {
                // 地图初始化成功
                callback && callback();
            } else {
                window.ON_MAP_READY_FUNCTION_QUEUE.push(callback);
            }
        },

        // 带着图片链接获取全部的图片地址
        getWholeOssUrl(url) {
            if (!url) {
                return;
            }
            if (url.slice(-4) === '.mp4') {
                return;
            }
            return `${this.ossUrl}${url}`
        },

        // 故障李彪数据字段名重构
        faultListRefactor(val) {
            const {
                yuanyin: fault_reason,
                deviceName,
                devicename,
                time,
                ch4,
                starttime,
                remarks,
                id,
                userName: implementer,
                resolve,
                longitude,
                latitude,
                nickname,
                username,
                entrance_pressure,
                exit_pressure,
                implementer: openImplementer,
                signal,
                fault,
            } = cloneDeep(val);
            return {
                fault_reason: fault_reason || remarks,
                time: time || starttime,
                id,
                ch4,
                implementer,
                resolve: Number(resolve || 0),
                longitude,
                latitude,
                entrance_pressure,
                exit_pressure,
                deviceName: deviceName || devicename,
                address: nickname,
                openDeviceName: nickname,
                nickname,
                username,
                openImplementer,
                signal,
                fault,
            }
        },

        // 报警列表数据字段名重构
        alertListRefactor(val) {
            const {
                deviceName,
                id,
                ch4: concentration,
                resolve,
                lightIntensity,
                userName: operatorName,
                starttime,
                endtime,
                nospeed,
                type,
                screenshotImaPath,
                photoImaPath,
                longitude,
                latitude,
                temperature,
                signal,
                nickname,
                devicename,
                username,
                implementer: openImplementer,
                time: openTime,
                appLocation,
                fault,
                low_alert,
                high_alert,
                light,
                remarks,
                entrance_pressure,
                exit_pressure,
            } = cloneDeep(val);
            let photoImaPathRes = photoImaPath;
            photoImaPathRes = photoImaPathRes?.split('+++');
            photoImaPathRes = photoImaPathRes?.map((item) => this.getWholeOssUrl(item));
            return {
                id,
                concentration,
                lightIntensity,
                resolve: Number(resolve || 0),
                nospeed,
                operatorName,
                startTime: starttime,
                endTime: endtime,
                type,
                time: starttime || openTime,
                photo: photoImaPathRes,
                screenshot: this.getWholeOssUrl(screenshotImaPath),
                longitude,
                latitude,
                temperature,
                deviceName: deviceName || devicename,
                nickname,
                openDeviceName: nickname,
                openImplementer,
                username,
                openTime,
                signal,
                appLocation,
                fault,
                lowAlert: low_alert,
                highAlert: high_alert,
                light,
                remarks,
                entrance_pressure,
                exit_pressure,
            };
        },
        toast: function (message, duration = 2000) {
            store.dispatch('toast/showToast', {message, duration}).then()
        }

    },
    watch: {
        filterType: {
            handler() {
                this.$store.dispatch('notification/initNotificationData');
            }
        }
    },
    computed: {
        curProjectName() {
            // dalian gz
            return 'gz';
        },
        curEnv() {
          // prod dev
          return 'prod';
        },
        FAULT_MAP() {
            return FAULT_MAP;
        },
        ALL_FAULT_STATUS_MAP() {
            return ALL_FAULT_STATUS_MAP;
        },
        MILEAGE_FAULT_MAP() {
            return MILEAGE_FAULT_MAP;
        },
        formatPower() {
            return function (value) {
                return `${Number(value) / 100}V`;
            };
        },
        getCurDetailPage() {
            return this.filterType[0] === PageTypeEnum.MONITOR ? this.notificationTab : this.filterType[0];
        },
        allDevicesShowProp() {
            return this.$store.getters['deviceShowProper'];
        },
        notificationTab() {
            return this.$store.state.device.notificationTab;
        },
        filterType() {
            return store.state.device.filterType;
        },
        isCarPage() {
            return this.$store.state.device.notificationTab === PageTypeEnum.INVEHICLE
                || this.filterType[0] === PageTypeEnum.INVEHICLE;
        },
        isOpenPage() {
            return this.$store.state.device.notificationTab === PageTypeEnum.OPEN
                || this.filterType[0] === PageTypeEnum.OPEN;
        },
        isHandPage() {
            return this.$store.state.device.notificationTab === PageTypeEnum.HAND
                || this.filterType[0] === PageTypeEnum.HAND;
        },
        username: function () {
            return store.state.user.username;
        },
        userId() {
            return store.state.user.userId;
        },
        token() {
            return store.state.user.token;
        },
        isAdmin() {
            return store.state.user.isAdmin;
        },
        isFullScreen: function () {
            return store.state.fullScreen.fullscreen;
        },
        currentUnit: function () {
            return store.getters["configs/unitInfo"];
        },
        // 图片路径在线域名前缀
        IMG_URL_PREFIX() {
            return 'https://vectorset.oss-cn-beijing.aliyuncs.com/';
        },
        PageTypeEnum() {
            return PageTypeEnum;
        },
        monitorShowRoute() {
            return [PageTypeEnum.HAND, PageTypeEnum.DOWNHOLE, PageTypeEnum.INVEHICLE, PageTypeEnum.OPEN, PageTypeEnum.MILEAGE];
        },
        // 获取oss静态地址
        // TODO：别忘记换成接口请求
        ossUrl() {
            return 'https://vectorset.oss-cn-beijing.aliyuncs.com/';
        },
    }
})

window.globalRouter = router;

window.$vm = new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')
