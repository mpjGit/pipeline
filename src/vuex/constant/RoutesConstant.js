const routesConstant = [
    // 如果路由有更改需要更新版本号
    {
        index: 100,
        version: '1.2.4',
        name: '版本号',
        type: PageTypeEnum.MONITOR,
        en: 'Monitoring Center1',
        path: '/monitor1',
        icon: 'el-icon-odometer1',
        show: false,
        disabled: true,
    },
    {
        index: 0,
        name: '监控中心',
        type: PageTypeEnum.MONITOR,
        en: 'Monitoring Center',
        path: '/monitor',
        icon: 'el-icon-odometer',
        show: true,
        disabled: true,
    },
    {
        index: 1,
        name: '无线智能终端',
        type: PageTypeEnum.DOWNHOLE,
        en: 'Wireless Intelligent equipment',
        path: '/downhole',
        icon: 'el-icon-bangzhu',
        show: true,
    },
    {
        index: 2,
        name: '车载设备',
        type: PageTypeEnum.INVEHICLE,
        en: 'vehicle-device equipment',
        path: '/invehicle-device',
        icon: 'el-icon-truck',
        show: true,
    },
    {
        index: 3,
        name: '开路设备',
        type: PageTypeEnum.OPEN,
        en: 'open-circuit-device equipment',
        path: '/open-device',
        icon: 'el-icon-coordinate',
        show: true,
    },
    {
        index: 4,
        name: '手持设备',
        type: PageTypeEnum.HAND,
        en: 'handsets-device equipment',
        path: '/hand-device',
        icon: 'el-icon-mobile',
        show: true,
    },
    {
        index: 5,
        name: '无线智能终端（桩式）',
        type: PageTypeEnum.MILEAGE,
        en: 'mileage-pile equipment',
        path: '/mileage-device',
        icon: 'el-icon-location-outline',
        show: true,
    },
    {
        index: 6,
        name: '设备管理中心',
        type: PageTypeEnum.OPEN_MANAGE,
        en: 'PTZ-device equipment',
        path: '/admin-device-manage',
        icon: 'el-icon-admin',
        show: true,
        isAdmin: 1,
    },
    {
        index: 7,
        name: '点式设备',
        type: PageTypeEnum.POINT,
        en: 'point-device equipment',
        path: '/404NotFound',
        icon: 'el-icon-thumb',
        show: true,
    },
    {
        index: 8,
        name: '云台设备',
        type: PageTypeEnum.CLOUD,
        en: 'PTZ-device equipment',
        path: '/404NotFound',
        icon: 'el-icon-cloudy',
        show: true,
    },


    // {
    //   index: 5,
    //   name: '测试设备',
    //   en: 'test-equipment',
    //   path: '/in-vehicle',
    //   show: true,
    // },
];

export const typeMap = {
    jx: PageTypeEnum.DOWNHOLE,
    cz: PageTypeEnum.INVEHICLE,
    kl: PageTypeEnum.OPEN,
    sc: PageTypeEnum.HAND,
    lcz: PageTypeEnum.MILEAGE,
    ds: PageTypeEnum.POINT,
    yt: PageTypeEnum.CLOUD,
    [PageTypeEnum.DOWNHOLE]: 'jx',
    [PageTypeEnum.INVEHICLE]: 'cz',
    [PageTypeEnum.OPEN]: 'kl',
    [PageTypeEnum.HAND]: 'sc',
     [PageTypeEnum.MILEAGE]: 'lcz',
    [PageTypeEnum.POINT]: 'ds',
    [PageTypeEnum.CLOUD]: 'yt',
}

export default routesConstant;