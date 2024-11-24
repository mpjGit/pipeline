import Vue from 'vue'
import Vuex from 'vuex'
import moduleAlert from "@/vuex/modules/alert";
import moduleToast from "@/vuex/modules/toast";
import moduleDevice from "@/vuex/modules/device";
import moduleConfirm from "@/vuex/modules/confirm";
import fullScreenModule from "@/vuex/modules/fullscreen";
import moduleUser from "@/vuex/modules/user";
import createPersistedState from 'vuex-persistedstate';

import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import sessionData from "@/vuex/modules/sessionData";


// 井下设备
import moduleDownholeList from "@/vuex/pageData/downhole/deviceList";
import downholeDeviceConfig from "@/vuex/pageData/downhole/deviceConfig";
import downholeFaultList from "@/vuex/pageData/downhole/faultList";
import downholeAlertList from "@/vuex/pageData/downhole/alertList";
import downholeHistoryList from "@/vuex/pageData/downhole/historyList";

// 里程桩设备
import moduleMileageList from "@/vuex/pageData/mileage/deviceList";
import mileageDeviceConfig from "@/vuex/pageData/mileage/deviceConfig";
import mileageFaultList from "@/vuex/pageData/mileage/faultList";
import mileageAlertList from "@/vuex/pageData/mileage/alertList";
import mileageHistoryList from "@/vuex/pageData/mileage/historyList";

// 车载设备
import inVehicleList from "@/vuex/pageData/invehicle/deviceList";
import inVehicleFaultList from "@/vuex/pageData/invehicle/faultList";
import inVehicleAlertList from "@/vuex/pageData/invehicle/alertList";
import modulePlayer from "@/vuex/modules/player";
import moduleNotification from "@/vuex/modules/notification";
import moduleConfigs from "@/vuex/modules/configs";

// 开路设备
import openDeviceConfig from "@/vuex/pageData/open/deviceConfig";

const dataState = createPersistedState({
    paths: ['user', 'device']
})

const sessionDataState = createPersistedState({
    key: 'sessionData',
    storage: window.sessionStorage
})


Vue.use(Vuex);

function getDomText(key, index) {
    return document.querySelector(`#${key}-${index}`)?.innerText || '';
}

const actions = {
    // 前端处理导出功能
    exportFront(context, {tableList, fileName = '导出excel', columns = []}) {
        const filterColumns = columns.filter((item) => item.label !== '操作');
        const excelTableArr = [filterColumns.map((item) => item.label)];
        const excelHeaderKeys = filterColumns.map((item) => item.key);
        tableList.forEach((item) => {
            const arr = [];
            excelHeaderKeys.forEach((key) => {
                const val = getDomText(key, item.index);
                arr.push(val || '');
            })
            excelTableArr.push(arr)
        })
        const sheet = XLSX.utils.aoa_to_sheet(excelTableArr)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, sheet)
        const excelFile = XLSX.write(workbook, {
            bookType: 'xlsx',
            bookSST: true,
            type: 'array'
        })
        try {
            // XLSX.writeFile(workbook, fileName + '.xlsx');
            FileSaver.saveAs(new Blob([excelFile], {type: "application/octet-stream"}), fileName + '.xlsx');
        } catch (e) {
            console.error(e, excelFile, '----->>>')
        }
    },
};

// const _ = require('lodash');
const store = new Vuex.Store({
    plugins: [dataState, sessionDataState],
    modules: {
        alert: moduleAlert,
        toast: moduleToast,
        player: modulePlayer,
        confirm: moduleConfirm,
        device: moduleDevice,
        fullScreen: fullScreenModule,
        user: moduleUser,
        configs: moduleConfigs,

        notification: moduleNotification,

        // 井下设备
        downholeList: moduleDownholeList,
        downholeDeviceConfig: downholeDeviceConfig,
        downholeFaultList: downholeFaultList,
        downholeAlertList: downholeAlertList,
        downholeHistoryList: downholeHistoryList,

        // 里程桩设备
        mileageList: moduleMileageList,
        mileageDeviceConfig,
        mileageFaultList,
        mileageAlertList,
        mileageHistoryList,

        // 车载设备
        inVehicleList: inVehicleList,
        inVehicleFaultList: inVehicleFaultList,
        inVehicleAlertList: inVehicleAlertList,

        openDeviceConfig: openDeviceConfig,
        sessionData: sessionData,
    },
    actions,
})

export default store;
