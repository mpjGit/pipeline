let summaryMixin = {
  data() {
    return {
      summaryList: [],
      summryMap: {
        DEVICE_JX: "jxCount",
        DEVICE_CZ: "czCount",
        DEVICE_SC: "scCount",
        DEVICE_WXZS: "wxzsCount",
        DEVICE_DS: "dsCount",
        DEVICE_WX: "wxCount",
      },
    };
  },
  methods: {
    setSummryList(data) {
      const _summaryList = [];
      for (let i = 0; i < this.tabData.length; i++) {
        const tabDataItem = this.tabData[i];
        const mapKey = this.summryMap[tabDataItem.distinguish];
        const summaryItem = data[mapKey];
        let total = 0;
        if (summaryItem) {
          total = summaryItem.deviceJxCnt;
          _summaryList.push({
            title: mapKey,
            total,
            warn_count: summaryItem.deviceJxFault, // 故障
            error_count: summaryItem.deviceJxAlarm, // 报警
            normal_count: summaryItem.deviceJxNormal,
            deviceBattery: summaryItem.deviceBattery,
            deviceSignal: summaryItem.deviceSignal,
            deviceElectricity: summaryItem.deviceElectricity,
          });
        } else {
          _summaryList.push({
            title: mapKey,
            total,
            warn_count: 0,
            error_count: 0,
            normal_count: 0,
            deviceBattery: 0,
            deviceSignal: 0,
            deviceElectricity: 0,
          });
        }
      }
      this.summaryList = _summaryList;
    },
  },
};
export default summaryMixin;
