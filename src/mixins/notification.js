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
        'deviceType': {
            type: String,
            default: null
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

    data: function () {
        return {
            modalType: {
                downholeAlert: DOWNHOLE + ERROR,
                downholeFault: DOWNHOLE + WARN,
                mileageAlert: PageTypeEnum.MILEAGE + ERROR,
                mileageFault: PageTypeEnum.MILEAGE + WARN,
                invehicleAlert: INVEHICLE + ERROR,
                invehicleFault: INVEHICLE + WARN,
            }
        }
    },

    methods: {
        ...mapActions({
            'fetchDownholeAlertRecord' : 'downholeAlertList/fetchRecord',
            'fetchDownholeFaultRecord' : 'downholeFaultList/fetchRecord',
            'fetchInvehicleAlertRecord' : 'inVehicleAlertList/fetchRecord',
            'fetchInvehicleFaultRecord' : 'inVehicleFaultList/fetchRecord',
            'fetchMilageAlertRecord' : 'mileageAlertList/fetchRecord',
            'fetchMilageFaultRecord' : 'mileageFaultList/fetchRecord',
            'muteItem' : 'notification/muteItem',
        }),
        handleProcess: function() {
            // 判断通知类型（报警、故障）以及设备类型（井下、车载)
            let id = this.deviceId;
            console.log(id)
            // fetch record
            if(this.currentModalType === this.modalType.downholeAlert) {
                this.fetchDownholeAlertRecord(id);
            }
            if(this.currentModalType === this.modalType.downholeFault) {
                this.fetchDownholeFaultRecord(id)
            }

            if(this.currentModalType === this.modalType.mileageAlert) {
                this.fetchMilageAlertRecord(id);
            }
            if(this.currentModalType === this.modalType.mileageFault) {
                this.fetchMilageFaultRecord(id)
            }

            if(this.currentModalType === this.modalType.invehicleAlert) {
                this.fetchInvehicleAlertRecord(id)
            }
            if(this.currentModalType === this.modalType.invehicleFault) {
                this.fetchInvehicleFaultRecord(id)
            }
        },

        toggleMute: function () {
            this.muteItem({
                deviceId: this.deviceId,
                notificationType: this.type,
                deviceType: this.deviceType
            });
        }
    },

    computed: {
        filterType: function () {
            return this.$store.state.device.filterType;
        },
        // 判断显示正确的组件
        currentModalType: function () {

            let modal_type = '';
            if(this.deviceType === DOWNHOLE ) {
                // 井下设备
                modal_type+= DOWNHOLE
            } else if(this.deviceType === PageTypeEnum.MILEAGE) {
                // 里程桩设备
                modal_type+= PageTypeEnum.MILEAGE
            }

            if(this.type === ERROR)  {
                // error is alert
                modal_type+=ERROR
            } else if(this.type === WARN) {
                // warn is fault
                modal_type+=WARN
            }

            return modal_type;
        },

        isMute: function () {
            let warnMuteList = this.$store.state.notification.warnMuteList;
            let faultMuteList = this.$store.state.notification.faultMuteList;
            if (this.type === ERROR) {
                // 车载设备flag ： 设备ID+设备类型
                return warnMuteList.includes(this.deviceId + this.deviceType);
            }
            if (this.type === WARN) {
                return faultMuteList.includes(this.deviceId + this.deviceType);
            }
        }
    }

}

export default notificationMixin;
