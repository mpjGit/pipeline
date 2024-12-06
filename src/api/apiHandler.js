import { post, get } from "@/utils/axios"
import { request } from "@/utils/http";


export const getUserIdByName = (params) => {
    return post('/user/JikongSave/getUserId', params)
};

// 获取设备列表
export const getDeviceList = (params) => {
    return post('/user/JikongSave/getDeviceList', {...params})
}

// 获取设备列表 - 井下设备（新）
export const getDeviceJXList = (params) => {
    return request.post_form('/q/corp-device-jxs/browse-page', {...params})
}

// 获取设备报警列表 (新)
export const getDeviceAlarmList = (params) => {
    return request.post_form('/q/corp-device-jx-alarms/browse-page', {...params})
}

// 获取设备故障列表 （新）
export const getDeviceWarnList = (params) => {
    return request.post_form('/q/corp-device-jx-faults/browse-page', {...params})
}

// 获取设备历史记录列表 （新）
export const getDeviceHistList = (params) => {
    return request.post_form('/q/corp-device-jx-historys/browse-page', {...params})
}

// 获取右侧报警列表 (新)
export const getDevAlarmList = (params) => {
    return get(`/q/all-device-infos/get-alarm-list/${params.enterpriseUuid}/${params.distinguish}`)
}

// 静音和取消静音(新)
export const setVoiceStatus = (params) => {
    return get(`/c/corp-device-jx-alarms/update-voice/${params.enterpriseUuid}/${params.voiceStatus}/${params.uuid}`)
}

// 井下设备详情（新）
export const JXDeviceDetail = (params) => {
    return get(`/q/corp-device-jxs/find-by-uuid/${params.uuid}`)
}

// 处理设备报警（新）
export const handleJXAlarm = (params) => {
    return post(`/c/corp-device-jx-alarms/update-alarm-record/${params.uuid}`)
}

// 处理当前设备的所有报警（新）
export const handleJXAlarmAll = (params) => {
    return post(`/c/corp-device-jx-alarms/update-alarm-records/${params.deviceUuid}`)
}

// 获取所有设备（地图点位）(新)
export const fetchAllMapDevice = (data) => {
    return get(`/q/all-device-infos/get-all-devices/${data.enterpriseUuid}/${data.distinguish}`)
}

// 获取设备详情（新）
export const fetchDeviceDetail = (data) => {
    return get(`/q/corp-device-jxs/find-by-uuid/${data.uuid}`)
}

// 获取顶部设备卡片数据
export const getDeviceInfos = (data) => {
    return get(`/q/all-device-infos/get-all-count/${data.enterpriseUuid}/${data.distinguish}`)
}

// 获取开路设备列表
export const getOpenDeviceList = (params) => {
    return post('/user/Jikong/getKaiLuDeviceList', {...params})
}

// 井下设备是否展示液位字段
export const showsDeviceName = (params) => {
    return post('/user/Jikong/showsDeviceName', {...params})
}

// 获取故障列表
export const getFaultList = (params) => {
    Object.keys(params).forEach((key) => {
        if (params[key] === null) {
            params[key] = '';
        }
    });
    return post('/user/Jikong/getDeviceFailure', {...params})
}

// 获取报警信息列表
export const getAlertList = (params) => {
    Object.keys(params).forEach((key) => {
        if (params[key] === null) {
            params[key] = '';
        }
    });
    return post('/user/JikongSave/searchAlert', {...params})
}

// 获取历史报警信息
export const getHistoryList = (params) => {
    return post('/user/JikongAlert/getHistoryAlert', {...params})
}

// 根据用户ID获取全部事件列表
export const getEventById = (params) => {
    return post('/user/JikongEvent/getEventById', {...params})
}

// 根据用户ID和处理状态获取全部报警列表
export const getAlertListByType = (params) => {
    return post('/user/JikongAlert/getAllBjAndGz', {...params})
}

// 根据用户ID和处理状态获取全开路设备报警列表
export const getOpenAlertList = (params) => {
    Object.keys(params).forEach((key) => {
        if (params[key] === null) {
            params[key] = '';
        }
    });
    return post('/user/Jikong/searchGYGW_openwarns', {...params})
}

// 根据用户ID和处理状态获取全开路设备故障列表
export const getOpenFaultList = (params) => {
    Object.keys(params).forEach((key) => {
        if (params[key] === null) {
            params[key] = '';
        }
    });
    return post('/user/Jikong/searchGYGW_openfaults', {...params})
}



// 根据用户ID和处理状态获取全部报警列表
export const getAlertListAll = (params) => {
    return post('/user/JikongAlert/getAllBjAndGzNew', {...params})
}

// 删除开路设备的警报
export const deleteOpenALertInfo = (params) => {
    return post('/user/JikongSave/delAlertForKaiLu', {...params})
}

// 删除除开路设备的警报
export const deleteHandCarALertInfo = (params) => {
    return post('/user/JikongSave/delAlert', {...params})
}


// 删除开路设备的故障
export const deleteOpenFaultInfo = (params) => {
    return post('/user/JikongSave/delGuZhangForKaiLu', {...params})
}

// 删除井下设备的故障
export const delJinxiaGuzhang = (params) => {
    return post('/user/JikongSave/delJinxiaGuzhang', {...params})
}

// 删除井下设备的报警
export const delJinxiaAlert = (params) => {
    return post('/user/JikongSave/delJinxiaAlert', {...params})
}

// 删除井下设备的历史记录
export const delJinxiaLishi = (params) => {
    return post('/user/JikongSave/delJinxiaLishi', {...params})
}



// 删除除开路设备的故障
export const deleteHandCarFaultInfo = (params) => {
    return post('/user/JikongSave/delGuZhang', {...params})
}

// 根据eventId获取巡检路线
export const getTrackPoint = (params) => {
    return post('/user/getTrackPoint', {...params})
}


// 获取开路设备历史记录
export const getOpenHistoryList = (params) => {
    Object.keys(params).forEach((key) => {
        if (params[key] === null) {
            params[key] = '';
        }
    });
    return post('/user/Jikong/searchKailulishi', {...params})
}

// 获取开路设备报警详情
export const getOpenInfoAlert = (params) => {
    return post('/user/Jikong/getKaiLuLiShiXiangQingBj', {...params})
}

// 获取开路设备故障详情
export const getOpenInfoFault = (params) => {
    return post('/user/Jikong/getKaiLuLiShiXiangQingGz', {...params})
}

// 获取开路设备故障详情
export const updatePwd = (params) => {
    return post('/user/updateUserPassword', {...params})
}

// 处理车载的报警和故障
export const handleCarHandAlertWarn = (params) => {
    return post('/user/JikongSave/ResolveAlert', {...params})
}

// 处理开路的报警和故障

export const handleOpenFaults = (params) => {
    return post('/user/Jikong/resolveGYGW_openfaults', {...params})
}

export const handleOpenWarns = (params) => {
    return post('/user/Jikong/resolveGYGW_openwarns', {...params})
}

// 获取当前设备的所有巡检记录
export const getEventList = (params) => {
    return post('/user/Jikong/GetEventList', {...params})
}

// 获取当前用户所有设备的展示字段
export const getDeviceShowProper = (params) => {
    return post('/user/Jikong/getDeviceInfo', {...params})
}

// 登录
export const loginUser = (params) => {
    return post('/q/sys-users/user', {...params})
}

// 设备录入页面功能
export const getKaiLuDeviceList = (params) => {
    return post('/user/Jikong/getKaiLuDeviceList', {...params})
}

// 设备录入页面功能
export const getAdminKailulist = (params) => {
    return post('/user/Jikong/getKailulist', {...params})
}


export const getDownholeDeviceList = (params) => {
    return post('/user/Jikong/getJinxiaDeviceList', {...params})
}

export const getMileageDeviceList = (params) => {
    return post('/user/Jikong/getAllLcz', {...params})
}


// 设备插入
export const InsertKaiLu = (params) => {
    return post('/user/Jikong/InsertKaiLu', {...params})
}

// 设备插入
export const InsertLCZ = (params) => {
    return post('/user/Jikong/InsertLCZ', {...params})
}



// 设备插入
export const InsertJinxia = (params) => {
    return post('/user/Jikong/InsertJinxia', {...params})
}

// 设备更新
export const UpdateKl = (params) => {
    return post('/user/Jikong/UpdateKl', {...params})
}

// 设备更新
export const UpdateJinxia = (params) => {
    return post('/user/Jikong/UpdateJinxia', {...params})
}

// 设备更新
export const UpdateLCZ = (params) => {
    return post('/user/Jikong/UpdateLCZ', {...params})
}



// 左侧列表开放设备
export const insertSupportDevice = (params) => {
    return post('/user/Jikong/insertSupportDevice', {...params})
}


// 左侧列表获取开放设备
export const getLeftSupportDevice = async (params) => {
    //     "jx": 0,  井下
    //     "cz": 0,  手持
    //     "kl": 1,  开路
    //     "sc": 0,  手持
    //     "lcz": 0, 里程桩
    //     "ds": 0,  点式
    //     "yt": 0   云台
    // const res = await get('', {...params});
    // if (!res.detail) {
    //     await insertSupportDevice({ userId: params.userId });
    // }
    return get('/q/corp-device-configs/find-by-enterprise-uuid/' + params.enterpriseUuid);
}

// 获取井下设备所有设备的字段展示情况
export const getAllJinxiaDuopeizhi = (params) => {
    return post('/user/Jikong/getAllJinxiaDuopeizhi', {...params})
}

// 获取全部用户列表数据
export const getAllUser = (params) => {
    return post('/user/JikongAlert/getAllUser', {...params})
}
