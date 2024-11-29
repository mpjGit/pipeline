let summaryMixin = {
    data() {
        return {
            summaryList: []
        }
    },
    methdos: {
        setSummryList(data) {
            const typeKeys = Reflect.ownKeys(data);
            for (const key of typeKeys) {
                const total = data[key].deviceJxCnt;
                this.summaryList.push({
                    title: key,
                    total,
                    warn_count: data[key].deviceJxNormal,
                    error_count: data[key].deviceJxFault,
                    normal_count: data[key].deviceJxNormal,
                    deviceBattery: data[key].deviceBattery,
                    deviceSignal: data[key].deviceSignal,
                    deviceElectricity: data[key].deviceElectricity
                })
            }
        }
    }
};
export default summaryMixin;
