// 公共变量
const EVENT_WILL_TRIGGER_IN = 300; //ms
const NORMAL_COLOR = 'rgba(7, 185, 185, 1)';
const WARN_COLOR = 'rgba(255, 181, 33, 1)';
const ERROR_COLOR = 'red';
const ERROR = 'error';
const WARN = 'warn';
const NORMAL = 'normal';

const DOWNHOLE = 'downhole';
const INVEHICLE = 'invehicle';
//显示框设置
/*let showlist = [];
let devicelist = [];
let i = 0 ;
showlist[i] = 1;*/
// 路由相关

const FAULT = 'fault';
const HISTORY = 'history';
const ALERT = 'alert';
const MAP = 'map';
const DEVICE = 'device'

// 导出的类型常量
const DOWNLOAD_TYPE = {
    downhole_fault: 1,
    downhole_alert: 2,
    downhole_history: 3,
    invehicle_fault: 4,
    invehicle_alert: 5
}

/** 基础地图设备标点函数 */
function BasicMarker({
    center,
    title,
    iconText,
    fieldList,
    deviceStatus = NORMAL,
    trackPoint,
    onclick,
    //显示信息框
   /* show = showlist[i],
    //计算临时设备名称位置
    tmpposition = i,*/
    video
}) {
    this._div = null;
    this._textMarker = null;
    this._infoWindow = null;
    this._trackLine = null;
    this._beginPoint = null;

    this._center = center;
    this._title = title;
    this._iconText = iconText;
    this._fieldList = fieldList;
    this._deviceStatus = deviceStatus;
    this._trackPoint = trackPoint;
    this._video = video;
    //显示框
    //this.show = show;
    this.tmpposition = tmpposition

    this._statusColor = 'white';

    switch (deviceStatus) {
        case NORMAL:
            this._iconImg = "/assets/white_dot.png"
            this._color = "black";
            this._lineColor = "rgba(7, 185, 185, 1)"; // NORMAL
            this._statusColor = 'white';
            break;
        case WARN:
            this._iconImg = "/assets/yellow_dot.png"
            this._color = "white";
            this._lineColor = "rgba(255, 181, 33, 1)";
            this._statusColor = "rgba(255, 181, 33, 1)";
            break;
        case ERROR:
            this._iconImg = "/assets/red_dot.png"
            this._color = "white";
            this._lineColor = `rgba(${180+Math.random()*50} , 0, 0)`; //ERROR_COLOR
            this._statusColor = "red";
            break;
        default:
            this._iconImg = "/assets/map/white_dot.png"
            this._color = NORMAL_COLOR;
            this._lineColor = NORMAL_COLOR;
    }

    this._onclick = onclick;
    this._timer = 0;
}
// 继承API的BMap.Overlay
BasicMarker.prototype = new BMapGL.Overlay();

// 实现初始化方法
BasicMarker.prototype.initialize = function(map) {
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
    popup.style.backgroundSize = '110%';
    popup.style.backgroundPosition = "top";
    popup.style.width = "60px";
    popup.style.height = "60px";

    popup.innerText = this._iconText;
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

    // 绘制设备轨迹(如果有的话)

    if (this._trackPoint && this._trackPoint.length) {
        // 绘制起点圆点
        let _point = this._trackPoint[0];
        let beginPoint = new BasicPoint(new BMapGL.Point(_point[0], _point[1]));
        this._beginPoint = beginPoint;
        map.addOverlay(beginPoint);

        // 绘制track
        let points = [];
        this._trackPoint.map((value, index) => {
            points.push(new BMapGL.Point(value.longitude, value.latitude));
            // 绘制路线关键节点
            let deviceStatus = NORMAL;
            if (value.fault != 0) {
                deviceStatus = WARN;
            }
            if (value.alerts != 0) {
                deviceStatus = ERROR
            }

            if (deviceStatus != NORMAL || index == 0) {
                let _pathPoint = new BasicPoint({
                    position: new BMapGL.Point(value.longitude, value.latitude),
                    size: 10,
                    bgColor: '#fff',
                    title: this._title,
                    deviceStatus,
                    fieldList: [{
                            name: '浓度',
                            value: value.CH4
                        },
                        {
                            name: '速度',
                            value: value.nospeed
                        },
                        {
                            name: '温度',
                            value: value.temperature
                        }
                    ],
                    video: value.video
                });
                map.addOverlay(_pathPoint);
            }
        })

        let polyline = new BMapGL.Polyline(points, {
            strokeColor: this._lineColor,
            strokeWeight: 8,
            strokeOpacity: 1
        });
        map.addOverlay(polyline);
        this._trackLine = polyline;
    }
    //结合show和list
    /*let k = 0
    for(let j =0;j<i;j++){
        if(this,fieldList.devicename == devicelist[j]){
            this.tmpposition = j
            k = 1
        }
    }
    if(k == 0){
        i++;
        this,fieldList.devicename == devicelist[i]
        console.log("i   : "+i)
    }*/


    div.appendChild(popup);
    div.appendChild(dot);

    this._beginPoint = dot;

    div.addEventListener("mousedown", () => {
        this._timer = new Date().getTime();
    });
    div.addEventListener("mouseup", () => {
    //div.addEventListener("online", () => {
        let current = new Date().getTime();
        if ((current - this._timer) < EVENT_WILL_TRIGGER_IN) {
            // 点击后触发的动作
            this._onclick && this._onclick();

            this.hideTextMarker();
            this.showInfoWindow();

        }
    });
    //new 直接显示信息框
    //if(this.show == 1){
        //this.showInfoWindow();
    //}

    map.getPanes().markerPane.appendChild(div);

    // 保存div实例
    this._div = div;
    // 需要将div元素作为方法的返回值，当调用该覆盖物的show、
    // hide方法，或者对覆盖物进行移除时，API都将操作此元素。
    return div;
}

// 隐藏、显示text marker
BasicMarker.prototype.hideTextMarker = function() {
    this._textMarker.style.opacity = 0;
}
BasicMarker.prototype.showTextMarker = function() {
    this._textMarker.style.opacity = 1;
}

BasicMarker.prototype.showInfoWindow = function() {
    if (this._infoWindow) {
        this._map.addOverlay(this._infoWindow);
    } else {
        let infoWindow = new BasicInfoWindow(this._center, this._title, this._fieldList, this._deviceStatus, () => {
            this.showTextMarker();
            this.hideInfoWindow();
        }, this._video);
        this._map.addOverlay(infoWindow)
        this._infoWindow = infoWindow;
    }
}

BasicMarker.prototype.hideInfoWindow = function() {
    this._map.removeOverlay(this._infoWindow);
    //this.showlist[i] = 0;
    console.log("关闭的i为  :  "+i)
}

// 实现绘制方法
BasicMarker.prototype.draw = function() {
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
        this._textMarker.style.opacity = 1;
        this._beginPoint.style.backgroundColor = 'white';
        this._beginPoint.style.zoom = 1;
    }
    // 根据地理坐标转换为像素坐标，并设置给容器
    let position = this._map.pointToOverlayPixel(this._center);
    this._div.style.left = position.x - 60 / 2 + "px";
    this._div.style.top = position.y - 75 + 7.5 + "px"; // 容器高度 75 ， 让圆球的中点位于七点座标 需要 增加圆的半径；
}

/** 设备信息弹窗 */
function BasicInfoWindow(position, deviceName, fieldList, deviceStatus, onClose, video = null) {
    this._div = null;
    this._position = position;
    this._deviceName = deviceName;
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

BasicInfoWindow.prototype.initialize = function(map) {
    this._map = map;
    // 设置容器
    let div = document.createElement('div');
    div.style.width = '502px';
    div.style.position = 'absolute';
    div.style.height = '120px';
    div.style.borderRadius = '5px';
    div.style.boxShadow = '0 0 3px rbga(0,0,0,0.3)';
    div.style.backgroundImage = "url(/sense/assets/map/popup.png)";
    div.style.padding = '28px';
    div.style.boxSizing = 'border-box';
    div.style.backgroundSize = '100%';

    // 设置关闭按钮
    let closeIcon = document.createElement('div');
    closeIcon.style.width = '15px';
    closeIcon.style.height = '15px';
    closeIcon.style.backgroundImage = "url(/sense/assets/map/close.svg)";
    closeIcon.style.backgroundSize = "80%";
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

    // 设置视频播放按钮
    if (this._video != null) {
        let videoButton = document.createElement('img');
        videoButton.style.width = '20px';
        videoButton.style.height = 'auto';
        videoButton.style.marginLeft = '10px';

        videoButton.setAttribute('src', '/assets/video.svg')

        videoButton.addEventListener("mousedown", () => {
            this._timer = new Date().getTime();
        });
        videoButton.addEventListener("mouseup", () => {
            let current = new Date().getTime();
            if ((current - this._timer) < EVENT_WILL_TRIGGER_IN) {
                // eslint-disable-next-line no-undef
                $vm.$store.dispatch('playNewVideo', this._video);
            }
        });

        titleWrap.appendChild(videoButton);
    }

    div.appendChild(titleWrap);

    // 设置字段显示
    let fieldContainer = document.createElement('div');
    fieldContainer.style.width = '100%';
    fieldContainer.style.fontSize = '13px';
    fieldContainer.style.display = 'flex';
    fieldContainer.style.flexDirection = 'row';
    fieldContainer.style.alignItems = 'center';

    // 循环注入数据字段
    for (let i = 0; i < this._fieldList.length; i++) {
        let fieldItem = document.createElement("div");
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
BasicInfoWindow.prototype.draw = function() {
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
    position,
    size = 15,
    bgColor = '#fff',
    title,
    icon,
    fieldList = null,
    deviceStatus,
    video
}) {
    this._center = position;
    this._map = null;
    this._icon = icon;
    this._div = null;
    this._size = size;
    this._bgColor = bgColor;
    this._title = title;
    this._fieldList = fieldList;
    this._deviceStatus = deviceStatus
    this._video = video
}
BasicPoint.prototype = new BMapGL.Overlay();


BasicPoint.prototype.showInfoWindow = function() {
    if (this._infoWindow) {
        this._map.addOverlay(this._infoWindow);
    } else {

        let infoWindow = new BasicInfoWindow(this._center, this._title, this._fieldList, this._deviceStatus, () => {
                this.hideInfoWindow();
            },
            this._video
        );
        this._map.addOverlay(infoWindow)
        this._infoWindow = infoWindow;
    }
}

BasicPoint.prototype.hideInfoWindow = function() {
    this._map.removeOverlay(this._infoWindow);
}

BasicPoint.prototype.initialize = function(map) {
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

    if (this._deviceStatus != NORMAL) {
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
    }

    map.getPanes().markerPane.appendChild(div);

    this._div = div;
    return div;
}

BasicPoint.prototype.draw = function() {
    let position = this._map.pointToOverlayPixel(this._center);
    this._div.style.left = position.x - this._size / 2 + "px";
    this._div.style.top = position.y - this._size / 2 + "px";
}
