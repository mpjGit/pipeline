import Router from 'vue-router';
import Home from "@/pages/Main.vue";
import MonitorCenter from "@/pages/MonitorCenter.vue";
// import InVehicle from "@/pages/InVehicle.vue";
import Login from "@/pages/Login.vue";

// import Downhole from "@/pages/Downhole.vue";
// import DeviceListDownhole from "@/pages/Downhole/DeviceList";
// import FaultListDownhole from "@/pages/Downhole/FaultList";
// import AlertListDownhole from "@/pages/Downhole/AlertList";
// import HistoryListDownhole from "@/pages/Downhole/HistoryList";

// import Mileage from "@/pages/Mileage.vue";
// import DeviceListMileage from "@/pages/Mileage/DeviceList";
// import FaultListMileage from "@/pages/Mileage/FaultList";
// import AlertListMileage from "@/pages/Mileage/AlertList";
// import HistoryListMileage from "@/pages/Mileage/HistoryList";


// import FaultList from "@/pages/Invehicle/FaultList";
// import HistoryList from "@/pages/Invehicle/HistoryList";
// import AlertList from "@/pages/Invehicle/AlertList";
// import DeviceList from "@/pages/Invehicle/DeviceList";

import AdminDeviceList from "@/components/devices/AdminDeviceList.vue";

// 开路设备组件引入
// const OpenDevice = () => import('@/pages/OpenDevice');
// const OpenDeviceList = () => import('@/pages/OpenDevice/deviceList.vue');
// const OpenFaultList = () => import('@/pages/OpenDevice/faultList.vue');
// const OpenAlertList = () => import('@/pages/OpenDevice/alertList.vue');
// const OpenHistoryList = () => import('@/pages/OpenDevice/historyList.vue');

// // 手持设备组件引入

// const HandDevice = () => import('@/pages/HandDevice');
// const HandDeviceList = () => import('@/pages/HandDevice/deviceList.vue');
// const HandFaultList = () => import('@/pages/HandDevice/faultList.vue');
// const HandAlertList = () => import('@/pages/HandDevice/alertList.vue');
// const HandHistoryList = () => import('@/pages/HandDevice/historyList.vue');

// // 车载设备组件引入
// const InvehicleDevice = () => import('@/pages/InvehicleDevice');

// const InvehicleDeviceList = () => import('@/pages/InvehicleDevice/deviceList.vue');
// const InvehicleFaultList = () => import('@/pages/InvehicleDevice/faultList.vue');
// const InvehicleAlertList = () => import('@/pages/InvehicleDevice/alertList.vue');
// const InvehicleHistoryList = () => import('@/pages/InvehicleDevice/historyList.vue');

const Manage = () => import('@/pages/Manage');
const ManageDevice = () => import('@/pages/Manage/Device.vue');


const routes = [
    {
        path: '/',
        component: Home,
        children: [
            {
                path: '',
                redirect: () => {
                    return {
                        path: 'deviceall'
                    }
                }
            },
            {
                path: 'deviceall',
                component: MonitorCenter
            },
            {
                path: 'monitor',
                component: MonitorCenter
            },
            {
                path: 'downhole',
                component: MonitorCenter
            },
            {
                path: 'mileage-device',
                component: MonitorCenter
            },
            {
                path: 'in-vehicle',
                component: MonitorCenter
            },
            {
                path: 'vehicle-end',
                component: MonitorCenter
            },
            {
                path: 'admin-device-manage',
                component: AdminDeviceList,
            },
            // {
            //     path: 'invehicle-device',
            //     component: InvehicleDevice,
            //     children: [
            //         {
            //             path: '',
            //             redirect: () => {
            //                 return {
            //                     path: MAP,
            //                 }
            //             }
            //         },
            //         {
            //             // 地图
            //             path: MAP,
            //             // component: SummaryContent
            //         },
            //         {
            //             // 设备列表
            //             path: DEVICE,
            //             component: InvehicleDeviceList
            //         },
            //         {
            //             // 故障列表
            //             path: FAULT,
            //             component: InvehicleFaultList
            //         },
            //         {
            //             // 报警列表
            //             path: ALERT,
            //             component: InvehicleAlertList
            //         },
            //         {
            //             path: HISTORY,
            //             component: InvehicleHistoryList
            //         },
            //     ]
            // },
            // {
            //     path: 'open-device',
            //     component: OpenDevice,
            //     children: [
            //         {
            //             path: '',
            //             redirect: () => {
            //                 return {
            //                     path: MAP,
            //                 }
            //             }
            //         },
            //         {
            //             // 地图
            //             path: MAP,
            //             // component: SummaryContent
            //         },
            //         {
            //             // 设备列表
            //             path: DEVICE,
            //             component: OpenDeviceList,
            //         },
            //         {
            //             // 设备列表
            //             path: FAULT,
            //             component: OpenFaultList
            //         },
            //         {
            //             // 报警列表
            //             path: ALERT,
            //             component: OpenAlertList
            //         },
            //         {
            //             path: HISTORY,
            //             component: OpenHistoryList
            //         },
            //     ]
            // },
            // {
            //     path: 'hand-device',
            //     component: HandDevice,
            //     children: [
            //         {
            //             path: '',
            //             redirect: () => {
            //                 return {
            //                     path: MAP,
            //                 }
            //             }
            //         },
            //         {
            //             // 地图
            //             path: MAP,
            //             // component: SummaryContent
            //         },
            //         {
            //             // 设备列表
            //             path: DEVICE,
            //             component: HandDeviceList,
            //         },
            //         {
            //             // 设备列表
            //             path: FAULT,
            //             component: HandFaultList
            //         },
            //         {
            //             // 报警列表
            //             path: ALERT,
            //             component: HandAlertList
            //         },
            //         {
            //             path: HISTORY,
            //             component: HandHistoryList
            //         },
            //     ]
            // }
            {
                path: 'invehicle-device',
                component: MonitorCenter
            },
            {
                path: 'open-device',
                component: MonitorCenter
            },
            {
                path: 'hand-device',
                component: MonitorCenter
            }
        ]
    },
    {
        path: '/manage',
        component: Manage,
        children: [
            {
                path: '',
                redirect: () => {
                    return {
                        path: 'device',
                    }
                }
            },
            {
                // 设备管理
                path: 'device',
                component: ManageDevice
            },
        ]
    },
    {path: '/login', component: Login},
]
const router = new Router({
    routes,
});
export default router;
