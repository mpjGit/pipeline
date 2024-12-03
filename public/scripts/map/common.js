const EVENT_WILL_TRIGGER_IN = 300; //ms
const NORMAL_COLOR = 'rgba(7, 185, 185, 1)';
const WARN_COLOR = 'rgba(255, 181, 33, 1)';
const ERROR_COLOR = 'red';
const ERROR = 'error';
const WARN = 'warn';
const NORMAL = 'normal';

const DOWNHOLE = 'downhole';
const MILEAGE = '里程';
const INVEHICLE = 'invehicle';
const PageTypeEnum = {
    INVEHICLE: '车载',
    OPEN: '开路',
    HAND: '手持',
    MONITOR: '监控',
    DOWNHOLE: '井下',
    MILEAGE: '里程',
    POINT: '点式',
    CLOUD: '云台',
    OPEN_MANAGE: '开路设备管理',
};
const DEVICE_TYPE = {
    DEVICE_YT: '云台设备',
    DEVICE_CZ: '车载设备',
    DEVICE_WXZS: '无线智能终端(桩)',
    DEVICE_DS: '点式设备',
    DEVICE_WX: '无线智能终端',
    DEVICE_SC: '手持设备',
    DEVICE_GW: '管网守卫者',
    DEVICE_JX: '井下设备',
    DEVICE_KL: '开路设备',
}

function isFaultMsg(fault) {
    return Number(fault) >= 1 && Number(fault) <= 512;
}

function isWarnMsg(fault) {
    return Number(fault) >= 1024 && Number(fault) <= 131072;
}

const accumulateFaultNum = () => {
    let num = 0;
    return function () {
        const res = Math.pow(2, num)
        num++;
        return res;
    };
}
const accumulateFn = accumulateFaultNum();
const FAULT_MAP = {
    [accumulateFn()]: '通信异常',
    [accumulateFn()]: '激光器内部稳压通信异常',
    [accumulateFn()]: '温度异常',
    [accumulateFn()]: '未标定',
    [accumulateFn()]: '光过弱',
    [accumulateFn()]: '光过强',
    [accumulateFn()]: '吸收峰异常',
    [accumulateFn()]: '操作参数异常',
    [accumulateFn()]: '系统参数异常',
    [accumulateFn()]: '激光器断开连接',
    [accumulateFn()]: '液位报警',
    [accumulateFn()]: '井盖报警',
    [accumulateFn()]: '浓度预警',
    [accumulateFn()]: '浓度预警',
    [accumulateFn()]: 'PT10B温度异常',
    [accumulateFn()]: '电池电量低报警',
    [accumulateFn()]: '气压表0上限报警',
    [accumulateFn()]: '气压表0下限报警',
    [accumulateFn()]: '气压表1上限报警',
    [accumulateFn()]: '气压表1下限报警',
};
const accumulateFn1 = accumulateFaultNum();
const MILEAGE_FAULT_MAP = {
    [accumulateFn1()]: '通信异常',
    [accumulateFn1()]: '激光器内部稳压通信异常',
    [accumulateFn1()]: '温度异常',
    [accumulateFn1()]: '未标定',
    [accumulateFn1()]: '光过弱',
    [accumulateFn1()]: '光过强',
    [accumulateFn1()]: '吸收峰异常',
    [accumulateFn1()]: '操作参数异常',
    [accumulateFn1()]: '系统参数异常',
    [accumulateFn1()]: '激光器断开连接',
    [accumulateFn1()]: '液位报警',
    [accumulateFn1()]: '里程桩倾倒',
    [accumulateFn1()]: '浓度预警',
    [accumulateFn1()]: '浓度预警',
    [accumulateFn1()]: 'PT10B温度异常',
    [accumulateFn1()]: '电池电量低报警',
    [accumulateFn1()]: '气压表0上限报警',
    [accumulateFn1()]: '气压表0下限报警',
    [accumulateFn1()]: '气压表1上限报警',
    [accumulateFn1()]: '气压表1下限报警',
};

const pageTypeMap = {
    '手持': PageTypeEnum.HAND,
    '开路': PageTypeEnum.OPEN,
    '车载': PageTypeEnum.INVEHICLE,
    '井下': PageTypeEnum.DOWNHOLE,
    '里程': PageTypeEnum.MILEAGE,
    '手持设备': PageTypeEnum.HAND,
    '开路设备': PageTypeEnum.OPEN,
    '车载设备': PageTypeEnum.INVEHICLE,
    '井下设备': PageTypeEnum.DOWNHOLE,
    '里程桩设备': PageTypeEnum.MILEAGE,
    [PageTypeEnum.HAND]: '手持',
    [PageTypeEnum.OPEN]: '开路',
    [PageTypeEnum.INVEHICLE]: '车载',
    [PageTypeEnum.MILEAGE]: '里程',
};
const ModalActionEnum = {
    FAULT: '故障弹窗',
    ALERT: '报警弹窗',
    HAND_ALERT: '手持设备的报警弹窗',
    HAND_FAULT: '手持设备的故障弹窗',
    OPEN_ALERT: '开路设备的报警弹窗',
    OPEN_FAULT: '开路设备的故障弹窗',
    OPEN_NORMAL: '开路设备的正常状态弹窗',
    UPDATE_PWD: '修改密码',
    ADD_DEVICE_KAILU: '添加开路设备',
    ADD_DEVICE_JINGXIA: '添加井下设备',
    ADD_DEVICE_MILEAGE: '添加里程桩设备',
    UPDATE_DEVICE_KAILU: '修改开路设备',
    UPDATE_DEVICE_JINGXIA: '修改井下设备',
    UPDATE_DEVICE_MILEAGE: '修改里程桩设备',
    LING_PAI: '输入令牌组件',
    DEVICE_DETAIL: '设备详细信息',
};

const ModalPage = (pageType, status) => {
    if (status === NORMAL) {
        return ModalActionEnum.OPEN_NORMAL;
    }
    let modalType = null;
    switch (pageType) {
        case PageTypeEnum.INVEHICLE:
            modalType = [ModalActionEnum.FAULT, ModalActionEnum.ALERT];
            break;
        case PageTypeEnum.HAND:
            modalType = [ModalActionEnum.HAND_FAULT, ModalActionEnum.HAND_ALERT];
            break;
        case PageTypeEnum.OPEN:
            modalType = [ModalActionEnum.OPEN_FAULT, ModalActionEnum.OPEN_ALERT];
            break;
        default:
            modalType = [ModalActionEnum.FAULT, ModalActionEnum.ALERT];
            break;
    }
    return status === ALERT ? modalType[1] : modalType[0];
};

const NEW_INVEHICLE = '车载';
const FAULT = 'fault';
const HISTORY = 'history';
const ALERT = 'alert';
const MAP = 'map';
const DEVICE = 'device'

const accumulateFn2 = accumulateFaultNum();
const ALL_FAULT_STATUS_MAP = {
    0: '正常',
    '正常': '正常',
    '报警': '报警',
    '故障': '故障',
    '开路报警': '报警',
    '开路故障': '故障',
    '光路异常': '故障',
    '通信异常': '故障',
    '激光器内部稳压通信异常': '故障',
    '温度异常': '故障',
    '未标定': '故障',
    '光过弱': '故障',
    '光过强': '故障',
    '吸收峰异常': '故障',
    '操作参数异常': '故障',
    '系统参数异常': '故障',
    '激光器断开连接': '故障',
    '液位报警': '报警',
    '井盖报警': '报警',
    '浓度预警': '报警',
    '浓度预譬': '报警',
    'PT10B温度异常': '报警',
    '电池电量低报警': '报警',
    '气压表0上限报警': '报警',
    '气压表0下限报警': '报警',
    '气压表1上限报警': '报警',
    '气压表1下限报警': '报警',
    [accumulateFn2()]: '通信异常',
    [accumulateFn2()]: '激光器内部稳压通信异常',
    [accumulateFn2()]: '温度异常',
    [accumulateFn2()]: '未标定',
    [accumulateFn2()]: '光过弱',
    [accumulateFn2()]: '光过强',
    [accumulateFn2()]: '吸收峰异常',
    [accumulateFn2()]: '操作参数异常',
    [accumulateFn2()]: '系统参数异常',
    [accumulateFn2()]: '激光器断开连接',
    [accumulateFn2()]: '液位报警',
    [accumulateFn2()]: '井盖报警',
    [accumulateFn2()]: '浓度预警',
    [accumulateFn2()]: '浓度预警',
    [accumulateFn2()]: 'PT10B温度异常',
    [accumulateFn2()]: '电池电量低报警',
    [accumulateFn2()]: '气压表0上限报警',
    [accumulateFn2()]: '气压表0下限报警',
    [accumulateFn2()]: '气压表1上限报警',
    [accumulateFn2()]: '气压表1下限报警',
};

const POSITION_ICON = '/assets/position.png';

const API_TYPE = {
    invehicle: '车载', handDevice: '',
};


let showlist = []
// 导出的类型常量
const DOWNLOAD_TYPE = {
    downhole_fault: 1, downhole_alert: 2, downhole_history: 3, invehicle_fault: 4, invehicle_alert: 5
}

/** 基础地图设备标点函数 */
function BasicMarker({center, title, iconText, fieldList, deviceStatus = NORMAL, trackPoint, onclick, id,//显示编号
video}) {
    this._div = null;
    this._textMarker = null;
    this._infoWindow = null;
    this._trackLine = null;
    this._beginPoint = null;
    this.id = id//显示编号
    this._center = center;
    this._title = title;
    this._iconText = iconText;
    this._fieldList = fieldList;
    this._deviceStatus = deviceStatus;
    this._trackPoint = trackPoint;
    this._video = video;
    this._statusColor = 'white';
    deviceStatus = ALL_FAULT_STATUS_MAP[deviceStatus] || deviceStatus;
    try {
        const filterNameList = [];
        if (window.globalCustomData.deviceProper[title].chuqikouyaliSupport === '0') {
            filterNameList.push('出气口压强');
        }
        if (window.globalCustomData.deviceProper[title].jinqikouyaliSupport === '0') {
            filterNameList.push('进气口压强');
        }
        if (window.globalCustomData.deviceProper[title].wenduSupport === '0') {
            filterNameList.push('温度');
        }
        if (window.globalCustomData.deviceProper[title].nongduSupport === '0') {
            filterNameList.push('浓度');
        }
        this._fieldList = this._fieldList.filter((item) => !filterNameList.includes(item.name))
    } catch (e) {
        // console.log(e);
    }
    // 待补充
    /*
    yeweizhuangtaiSupport
    menjinzhuangtaiSupport
     */
    switch (deviceStatus) {
        case NORMAL:
        case '离线':
        case '巡检中':
        case '正常':
            this._iconImg = "/assets/white_dot.png"
            this._color = "black";
            this._lineColor = "rgba(7, 185, 185, 1)"; // NORMAL
            this._statusColor = 'rgba(85,197,47,0.96)';
            break;
        case WARN:
        case '故障':
            this._iconImg = "/assets/yellow_dot.png"
            this._color = "white";
            this._lineColor = "rgba(255, 181, 33, 1)";
            this._statusColor = "rgba(255, 181, 33, 1)";
            break;
        case ERROR:
        case '报警':
            this._iconImg = "/assets/red_dot.png"
            this._color = "white";
            this._lineColor = `rgba(${180 + Math.random() * 50} , 0, 0)`; //ERROR_COLOR
            this._statusColor = "red";
            break;
        default:
            this._iconImg = "/assets/white_dot.png"
            this._color = 'black';
            this._lineColor = NORMAL_COLOR;
            this._statusColor = 'rgba(85,197,47,0.96)';
    }

    this._onclick = onclick;
    this._timer = 0;
}

// 继承API的BMap.Overlay
BasicMarker.prototype = new BMapGL.Overlay();


// 实现初始化方法
BasicMarker.prototype.initialize = function (map) {
    // 保存map对象实例
    this._map = map;

    // 创建div元素，作为自定义覆盖物的容器
    let div = document.createElement("div");
    div.style.position = "absolute";
    div.style.width = "60px";
    div.style.height = "auto";
    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.style.alignItems = "center";

    // 设备icon
    let popup = document.createElement("div");
    popup.style.position = "relative";
    popup.style.backgroundImage = "url(" + this._iconImg + ")";
    popup.style.backgroundSize = 'cover';
    popup.style.backgroundPosition = "center";
    popup.style.width = "60px";
    popup.style.height = "60px";

    popup.innerText = "设";
    popup.style.color = this._color;
    popup.style.fontSize = '14px';
    popup.style.alignSelf = 'center';
    popup.style.textAlign = 'center';
    popup.style.lineHeight = '60px';
    popup.style.fontWeight = 'bold';

    this._textMarker = popup;

    // 设备实际座标位置圆点

    let dot = document.createElement("div");
    dot.style.position = "relative";
    dot.style.width = '15px';
    dot.style.height = '15px';
    dot.style.borderRadius = '50%';
    dot.style.background = 'white';
    dot.style.border = '1px solid rgba(0,0,0,0.4)'
    dot.style.boxShadow = '0 0 4px rgba(0,0,0,0.3)'
    dot.setAttribute('deviceName', this._title);


    // 绘制设备轨迹(如果有的话)
    let iconDom = null;
    if (this._trackPoint && this._trackPoint.length) {
        // 绘制起点圆点
        let _point = this._trackPoint[0];
        let beginPoint = new BasicPoint(new BMapGL.Point(_point[0], _point[1]));
        this._beginPoint = beginPoint;
        map.addOverlay(beginPoint);
        let pointPosition = null;
        // 绘制track
        let points = [];
        this._trackPoint.map((value) => {
            const pointP = new BMapGL.Point(value.longitude, value.latitude);
            points.push(pointP);
            // 绘制路线关键节点
            // let deviceStatus = NORMAL;
            // if (['故障', WARN].includes(value.status)) {
            //     deviceStatus = WARN;
            // }
            // if (['报警', ERROR].includes(value.status)) {
            //     deviceStatus = ERROR
            // }
            let icon = null;
            let bgColor = '#fff';
            let size = 10;

            if (value?.pointColor) {
                size = 15;
                pointPosition = pointP;
                // this.hideTextMarker();
                // this.showInfoWindow();
                // showlist[value.id] = 1
                bgColor = value.pointColor;
                icon = POSITION_ICON;
            }
            const pathPointObj = {
                position: new BMapGL.Point(value.longitude, value.latitude),
                size,
                bgColor,
                icon,
                title: this._title,
                deviceStatus: ERROR,
                fieldList: [{
                    name: '浓度', value: value.concentration
                }, {
                    name: '光强', value: value.guangqiang
                }, {
                    name: '温度', value: value.wendu
                }],
                video: value.video
            }
            if (value.fault) {
                pathPointObj.fieldList.push({
                    name: '异常信息', value: value.fault,
                });
            }
            let _pathPoint = new BasicPoint(pathPointObj);
            map.addOverlay(_pathPoint);
        })
        if (pointPosition) {
            if (this._icon) {
                iconDom = document.createElement("div");
                iconDom.style.position = "relative";
                iconDom.style.backgroundSize = '110%';
                iconDom.style.backgroundPosition = "center center";
                iconDom.style.width = "60px";
                iconDom.style.height = "60px";
                // iconDom.style.color = "white";
                iconDom.style.transform = 'translate(calc(-50% + 7px), calc(-50% + 7px))';
                iconDom.style.backgroundImage = "url(" + this._icon + ")";
            }
        }
        let polyline = new BMapGL.Polyline(points, {
            strokeColor: this._lineColor, strokeWeight: 8, strokeOpacity: 1,
        });
        map.addOverlay(beginPoint);
        map.addOverlay(polyline);
        this._trackLine = polyline;
    }
    div.appendChild(popup);
    div.appendChild(dot);
    //默认为不展示信息框
    if (!showlist[this.id]) {
        showlist[this.id] = 0
    }
    //console.log("id "+ showlist[this.id])
    this._beginPoint = dot;
    //console.log("show [id] 为 :"+ showlist)
    div.addEventListener("mousedown", () => {
        this._timer = new Date().getTime();
    });
    div.addEventListener("click", () => {
        //div.addEventListener("online", () => {
        let current = new Date().getTime();
        if ((current - this._timer) < EVENT_WILL_TRIGGER_IN) {
            // 点击后触发的动作
            this._onclick && this._onclick();
            this.hideTextMarker();
            this.showInfoWindow();
            showlist[this.id] = 1
            //console.log("show id 为 :" + showlist[this.id])
        }
    });
    dot.addEventListener("contextmenu", (e) => {
        if (window.globalRouter.currentRoute.path.includes('monitor')) {
            return;
        }
        const {target} = e;
        const deviceName = target.getAttribute('deviceName');
        e.preventDefault();
        // 创建框体
        const box = document.createElement('button');
        box.style.position = 'absolute';
        box.style.top = `${e.clientY}px`;
        box.style.left = `${e.clientX}px`;
        box.style.border = `none`;
        box.style.padding = `10px`;
        box.style.zIndex = 10;
        box.setAttribute('class', 'good-button');
        box.textContent = '跳转到对应位置';
        // 点击按钮跳转到对应位置
        box.addEventListener('click', () => {
            document.body.removeChild(box);
            window.globalRouter.push({
                path: 'device', query: {
                    deviceName,
                },
            });
        });
        // 将框体添加到页面中
        document.body.appendChild(box);
        document.addEventListener('click', (e) => {
            if (!e.target.contains(box)) {
                try {
                    document.body.removeChild(box);
                    // eslint-disable-next-line no-empty
                } catch (e) {

                }
            }
        });

        box.focus();
    });


    map.getPanes().markerPane.appendChild(div);

    // 保存div实例
    this._div = div;
    // 需要将div元素作为方法的返回值，当调用该覆盖物的show、
    // hide方法，或者对覆盖物进行移除时，API都将操作此元素。
    return div;
}

// 隐藏、显示text marker
BasicMarker.prototype.hideTextMarker = function () {
    this._textMarker.style.opacity = 0;
}
BasicMarker.prototype.showTextMarker = function () {
    this._textMarker.style.opacity = 1;
}

BasicMarker.prototype.showInfoWindow = function () {
    if (this._infoWindow) {
        this._map.addOverlay(this._infoWindow);
    } else {
        let infoWindow = new BasicInfoWindow(this.id, this._center, this._title, this._fieldList, this._deviceStatus, () => {
            this.showTextMarker();
            this.hideInfoWindow();
        }, this._video);
        this._map.addOverlay(infoWindow)
        this._infoWindow = infoWindow;
    }
}

BasicMarker.prototype.hideInfoWindow = function () {
    this._map.removeOverlay(this._infoWindow);
    showlist[this.id] = 0;
    //console.log("关闭的i为  :  " + showlist[this.id])
}

// 实现绘制方法
BasicMarker.prototype.draw = function () {
    let zoomLevel = this._map.getZoom();
    if (zoomLevel < 14) {
        // this.hide();
        this._textMarker.style.backgroundImage = 'none';
        this._textMarker.style.opacity = 0;
        this._beginPoint.style.backgroundColor = this._statusColor;
        this._beginPoint.style.zoom = (1 - (14 - zoomLevel) / 13.5);
    } else {
        // show
        this._textMarker.style.backgroundImage = "url(" + this._iconImg + ")";
        this._textMarker.style.opacity = 1;//每次载入地图自动绘制设备图标
        this._beginPoint.style.backgroundColor = this._statusColor;
        this._beginPoint.style.zoom = 1;
        //直接显示信息框
        if (showlist[this.id] == 1) {
            this.hideTextMarker();
            this.showInfoWindow();
            //console.log("置1显示")
        }
    }
    // 根据地理坐标转换为像素坐标，并设置给容器
    let position = this._map.pointToOverlayPixel(this._center);
    this._div.style.left = position.x - 60 / 2 + "px";
    this._div.style.top = position.y - 75 + 7.5 + "px"; // 容器高度 75 ， 让圆球的中点位于七点座标 需要 增加圆的半径；
}
window.globalCustomData = {};

/** 设备信息弹窗 */
function BasicInfoWindow(id, position, deviceName, fieldList, deviceStatus, onClose, video = null) {
    this.id = id;
    this._div = null;
    this._position = position;
    this._deviceName = deviceName;
    if (!window.globalCustomData?.[deviceName]) {
        window.globalCustomData[deviceName] = {
            deviceName, timeStamp: new Date().getTime(),
        };
    }
    this._fieldList = fieldList;
    this._onClose = onClose;
    this._video = video;
    switch (deviceStatus) {
        case NORMAL:
            this._color = NORMAL_COLOR
            break;
        case WARN:
            this._color = WARN_COLOR
            break;
        case ERROR:
            this._color = ERROR_COLOR
            break;
        default:
            this._color = NORMAL_COLOR
    }
}


BasicInfoWindow.prototype = new BMapGL.Overlay();

BasicInfoWindow.prototype.initialize = function (map) {
    this._map = map;
    // 设置容器
    let div = document.createElement('div');
    div.style.width = '502px';
    div.style.position = 'absolute';
    div.style.height = '155px';
    div.style.borderRadius = '5px';
    div.style.boxShadow = '0 0 3px rbga(0,0,0,0.3)';
    // div.style.backgroundImage = "url(/sense/assets/map/popup.png)";
    div.style.backgroundImage = "url(/assets/map/popup.png)";
    div.style.backgroundSize = 'cover';
    div.style.backgroundPosition = 'center';
    div.style.backgroundRepeat = 'no-repeat';
    div.style.padding = '28px';
    div.style.boxSizing = 'border-box';
    div.style.backgroundSize = '502px 160px';

    // 设置关闭按钮
    let closeIcon = document.createElement('div');
    closeIcon.style.width = '15px';
    closeIcon.style.height = '15px';
    closeIcon.style.backgroundImage = "url(/sense/assets/map/close.svg)";
    closeIcon.style.backgroundImage = "url(/assets/map/close.svg)";
    // closeIcon.style.backgroundSize = "80%";
    closeIcon.style.backgroundPosition = 'center';
    closeIcon.style.backgroundRepeat = 'no-repeat';
    closeIcon.style.cursor = 'pointer';
    closeIcon.style.position = 'absolute';
    closeIcon.style.top = "20px";
    closeIcon.style.right = "25px";
    closeIcon.addEventListener("mousedown", () => {
        this._timer = new Date().getTime();
    });
    closeIcon.addEventListener("mouseup", () => {
        let current = new Date().getTime();
        //关闭时对应数组元素置0
        showlist[this.id] = 0
        //console.log("show id 为 :" + showlist[this.id])
        if ((current - this._timer) < EVENT_WILL_TRIGGER_IN) {
            this._map.removeOverlay(this);
            this._onClose && this._onClose();
        }
    });
    div.appendChild(closeIcon);

    // 设置标题
    let titleWrap = document.createElement('div');

    titleWrap.style.Width = '100%';
    titleWrap.innerHTML = `<span>${this._deviceName}</span>`;

    titleWrap.style.display = 'flex';
    titleWrap.style.flexDirection = 'row';
    titleWrap.style.alignItems = 'center';

    titleWrap.style.fontSize = '20px';
    titleWrap.style.marginBottom = '15px';
    titleWrap.style.color = 'rgba(34, 34, 34, 1)';
    titleWrap.style.fontWeight = 'bold';

    // 设置查看详情按钮
    let videoButton = document.createElement('div');
    videoButton.style.backgroundColor = '#4CAF50';
    videoButton.style.marginLeft = '10px';
    videoButton.innerText = '查看详情'
    videoButton.classList.add('detail-btn');

    videoButton.setAttribute('src', '/assets/video.svg')

    videoButton.addEventListener("mouseup", (e) => {
        e.stopPropagation();
        // eslint-disable-next-line no-undef
        $vm.$vModal({
            info: {
                uuid: this.id
            },
            type: ModalActionEnum.DEVICE_DETAIL,
        });
    });

    titleWrap.appendChild(videoButton);

    div.appendChild(titleWrap);

    // 设置字段显示
    let fieldContainer = document.createElement('div');
    fieldContainer.style.width = '100%';
    fieldContainer.style.fontSize = '13px';
    fieldContainer.style.display = 'flex';
    fieldContainer.style.flexDirection = 'row';
    fieldContainer.style.alignItems = 'center';
    fieldContainer.style.flexWrap = 'wrap';

    // 循环注入数据字段
    for (let i = 0; i < this._fieldList.length; i++) {
        let fieldItem = document.createElement("div");
        fieldItem.style.marginBottom = '3px';
        // fieldItem.style.display = 'flex';
        // fieldItem.style.marginRight = '8px';


        let fieldName = document.createElement("div");
        fieldName.style.display = 'inline-block';
        fieldName.innerText = this._fieldList[i]["name"] + "：";
        fieldName.style.marginRight = '5px';
        fieldName.style.color = 'rgba(34, 34, 34, 1)';
        let fieldValue = document.createElement("div");
        fieldValue.style.display = 'inline-block'
        fieldValue.innerText = this._fieldList[i]["value"];
        fieldValue.style.color = this._color;
        fieldItem.appendChild(fieldName);
        fieldItem.appendChild(fieldValue);

        // 添加间隔条
        if (i < this._fieldList.length - 1) {
            let spider = document.createElement('div');
            spider.style.width = '1px';
            spider.style.height = '10px';
            spider.style.backgroundColor = 'rgba(221, 221, 221, 1)';
            spider.style.display = 'inline-block';
            spider.style.marginRight = '8px';
            spider.style.marginLeft = '8px';
            fieldItem.appendChild(spider);
        }
        fieldContainer.appendChild(fieldItem);
    }

    div.appendChild(fieldContainer);
    map.getPanes().markerPane.appendChild(div);
    // 保存div实例
    this._div = div;
    // 需要将div元素作为方法的返回值，当调用该覆盖物的show、
    // hide方法，或者对覆盖物进行移除时，API都将操作此元素。
    return div;
}
// 实现绘制方法
BasicInfoWindow.prototype.draw = function () {
    // 根据地理坐标转换为像素坐标，并设置给容器
    let position = this._map.pointToOverlayPixel(this._position);
    this._div.style.left = position.x - 436 + "px";
    this._div.style.top = position.y - 145 + "px";
}

/**
 *  普通圆点
 */

// {center, title, iconText, fieldList, deviceStatus=NORMAL, trackPoint, onclick}
function BasicPoint({
                        position, size = 15, bgColor = '#fff', title, fieldList = null, deviceStatus, video, icon,
                    }) {
    this._center = position;
    this._map = null;
    this._div = null;
    this._size = size;
    this._bgColor = bgColor;
    this._title = title;
    this._fieldList = fieldList;
    this._icon = icon;
    this._deviceStatus = deviceStatus;
    this._video = video;
}

BasicPoint.prototype = new BMapGL.Overlay();


BasicPoint.prototype.showInfoWindow = function () {
    if (this._infoWindow) {
        this._map.addOverlay(this._infoWindow);
    } else {
        let infoWindow = new BasicInfoWindow(this.id, this._center, this._title, this._fieldList, this._deviceStatus, () => {
            this.hideInfoWindow();
        }, this._video);
        this._map.addOverlay(infoWindow)
        this._infoWindow = infoWindow;
    }
}

BasicPoint.prototype.hideInfoWindow = function () {
    window.globalCustomData = {};
    this._map.removeOverlay(this._infoWindow);
}

BasicPoint.prototype.initialize = function (map) {
    this._map = map;
    // 设置容器
    let div = document.createElement('div');
    div.style.width = this._size + 'px';
    div.style.position = 'absolute';
    div.style.height = this._size + 'px';
    div.style.borderRadius = this._size / 2 + 'px';
    div.style.backgroundColor = this._bgColor;
    div.style.boxShadow = '0 0 3px rbga(0,0,0,0.3)';
    div.style.boxSizing = 'border-box';

    // 绘制设备轨迹(如果有的话)
    let iconDom = null;

    div.addEventListener("mousedown", () => {
        this._timer = new Date().getTime();
    });
    div.addEventListener("mouseup", () => {
        let current = new Date().getTime();
        if ((current - this._timer) < EVENT_WILL_TRIGGER_IN) {
            // 点击后触发的动作
            this.showInfoWindow();

        }
    });

    if (this._icon) {
        iconDom = document.createElement("div");
        iconDom.style.position = "relative";
        iconDom.style.backgroundSize = '110%';
        iconDom.style.backgroundPosition = "center center";
        iconDom.style.width = "30px";
        iconDom.style.height = "30px";
        // iconDom.style.color = "white";
        iconDom.style.transform = 'translate(calc(-50% + 7px), calc(-50% + 7px))';
        iconDom.style.backgroundImage = "url(" + this._icon + ")";
    }
    if (iconDom) {
        div.appendChild(iconDom);
    }

    // map.getPanes().markerPane.appendChild(div);

    this._div = div;
    return div;
}

BasicPoint.prototype.draw = function () {
    let position = this._map.pointToOverlayPixel(this._center);
    this._div.style.left = position.x - this._size / 2 + "px";
    this._div.style.top = position.y - this._size / 2 + "px";
}
