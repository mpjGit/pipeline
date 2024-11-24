import {mapActions} from "vuex";

const notificationMixin = {
    props: {
        'type': {
            // 通知类型: 故障、警告
            type: String,
        },
        'deviceId': {
            type: [String, Number]
        },
        'deviceName': {
            type: String,
            default: '未知设备'
        },
        'nickname': {
            type: String,
            default: '未知设备'
        },
        'deviceType': {
            type: String,
            default: null
        },
        dataItem: {
          type: Object,
          default: () => {},
        },
        fieldList: {
            type: Array,
            default: function () {
                return [
                    {
                        name: '浓度',
                        value: '500'
                    },
                    {
                        name: '故障',
                        value: '故障'
                    },
                    {
                        name: '电量',
                        value: '馈电'
                    }
                ]
            }
        }
    },


    methods: {
        ...mapActions({
            'muteItem' : 'notification/muteItem',
        }),
        handleProcess: function() {
            // statusType用于兼容开路设备
            const { status, statusType } = this.dataItem;
            let resInfo = null;
            let curStatusType = FAULT;
            if (status === '报警' || statusType === ERROR) {
                curStatusType = ALERT;
                resInfo = this.alertListRefactor(this.dataItem)
            }
            if (status === '故障' || statusType === WARN) {
                curStatusType = FAULT;
                resInfo = this.faultListRefactor(this.dataItem)
            }

            this.$vModal({
                info: resInfo,
                type: ModalPage(this.getCurDetailPage, curStatusType),
            });
        },

        toggleMute: function () {
            this.muteItem({
                deviceId: this.deviceId,
                notificationType: this.type,
                deviceType: this.deviceType
            }).then();
        }
    },

    computed: {
        filterType: function () {
            return this.$store.state.device.filterType;
        },
        notificationTab() {
            return this.$store.state.device.notificationTab;
        },
        isMute: function () {
            const { status, statusType } = this.dataItem;
            let warnMuteList = this.$store.state.notification.warnMuteList;
            let faultMuteList = this.$store.state.notification.faultMuteList;
            if (status === '报警'|| statusType === ERROR) {
                // 车载设备flag ： 设备ID+设备类型
                return warnMuteList.includes(this.deviceId + this.deviceType);
            }
            if (status === '故障' || statusType === WARN) {
                return faultMuteList.includes(this.deviceId + this.deviceType);
            }
            return false;
        }
    }

}

export default notificationMixin;
