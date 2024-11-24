let summaryMixin = {
    computed: {
        // 设备汇总信息计算
        summaryList: function () {
            let foo = {};
            this.devices.map(value => {
                // eslint-disable-next-line no-prototype-builtins
                if(!foo.hasOwnProperty(value.deviceType)) {
                    foo[value.deviceType] = {
                        title: value.deviceType,
                        total: 0,
                        warn_count: 0,
                        error_count: 0,
                        normal_count: 0
                    }
                }

                // 对应设备的状态+1
                switch (value.status) {
                    case ERROR:
                        foo[value.deviceType].error_count++;
                        break;
                    case WARN:
                        foo[value.deviceType].warn_count++;
                        break;
                    case NORMAL:
                        // console.log(value)
                        foo[value.deviceType].normal_count++;
                        break;
                }
                // 此类型设备总数+1
                foo[value.deviceType].total++;
            });

            return Object.values(foo);
        },
    }
};
export default summaryMixin;
