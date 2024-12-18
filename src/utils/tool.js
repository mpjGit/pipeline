import moment from "moment";
export function timeToString(timestamp) {
    moment.locale('zh-cn');
    let foo = moment(timestamp);
    return foo.format("lll");
}

export function powerToString(power) {
    if(power < 10) {
        return '馈电';
    } else if(power < 30) {
        return '低电';
    } else {
        return '正常';
    }
}

export function isInVehicle(obj) {
    // eslint-disable-next-line no-prototype-builtins
    return obj.hasOwnProperty('placeName') || obj.hasOwnProperty('jid') || obj.type ==='车载';
}

export function isFaultMsg(fault) {
    return Number(fault) >= 1  && Number(fault) <=512;
}

export function isWarnMsg(fault) {
    return Number(fault) >= 1024  && Number(fault) <=131072;
}

export function isMileageWarnMsg(item) {
    return Number(item.CH4) > Number(item.low_alert) || Number(item.fault) >= 1024;
}

export function isMileageFaultMsg(item) {
    return Number(item.fault) >= 1  && Number(item.fault) <=512;
}

export function fault_tostring(fault){
    return FAULT_MAP[fault];
}

// 设备类型转换
export function deviceType_toStr(type) {
    return DEVICE_TYPE[type];
}

// 报警码类型转换
export function alarmCode2type(code) {
    if (code && typeof code === 'string') {
        return ALARM_TYPE[code];
    }
    return '';
}


// 日期字符串转换
export function formatDate(dateString) {
    const date = new Date(dateString); // 将后端返回的日期字符串转为 Date 对象
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 获取月份，注意月份从0开始，+1
    const day = String(date.getDate()).padStart(2, '0'); // 获取日期
    const hours = String(date.getHours()).padStart(2, '0'); // 获取小时
    const minutes = String(date.getMinutes()).padStart(2, '0'); // 获取分钟
    const seconds = String(date.getSeconds()).padStart(2, '0'); // 获取秒

    // 格式化为 "YYYY-MM-DD HH:MM:SS"
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
