let summaryMixin = {
    computed: {
        // 设备汇总信息计算
        downHoleSummaryList: function () {
            const showRoutesKey = this.$store.getters['getShowRoutes'].map((item) => pageTypeMap[item.type]).filter(Boolean);
            if (!showRoutesKey.includes(PageTypeEnum.DOWNHOLE)) return[];
            let foo = {};
            this.downHoleDevices.map(value => {

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
        // 设备汇总信息计算
        summaryList: function () {
            const [curPageType] = this.filterType;
            if (!curPageType) {
                return [];
            }
            const summaryRes = [];
            const monitorEventNum = this.$store.getters['monitorEventNum'];
            const countTypeMap = {
                [PageTypeEnum.INVEHICLE]: ["chezaizhengchang",
                    "chezaiguzhang",
                    "chezaibaojing"],
                [PageTypeEnum.HAND]: ["shouchizhengchang",
                    "shouchiguzhang",
                    "shouchibaojing"],
                [PageTypeEnum.OPEN]: ["kailuzhengchang",
                    "kailuguzhang",
                    "kailubaojing"],
                [PageTypeEnum.MILEAGE]: ["lichengzhuangzhengchang",
                    "lichengzhuangguzhang",
                    "lichengzhuangbaojing"],
            };

            // 如果是监控中心需要全部展示
            if (curPageType === PageTypeEnum.MONITOR) {
                const showRoutesKey = this.$store.getters['getShowRoutes'].map((item) => item.type).filter(Boolean);
                Object.keys(countTypeMap).forEach((filterKey) => {
                    if (!showRoutesKey.includes(filterKey)) {
                        return;
                    }
                    const [normal_count, warn_count, error_count] = countTypeMap[filterKey].map((key) => Number(monitorEventNum[key]));
                    const item = {
                        title: filterKey,
                        total: normal_count + warn_count + error_count,
                        warn_count,
                        error_count,
                        normal_count,
                    };
                    summaryRes.push(item);
                });
                return summaryRes;
            }

            // 获取监控中心 也就是全部字段类型的事件数量
            Object.keys(countTypeMap).forEach((key) => {
                if (!countTypeMap[PageTypeEnum.MONITOR]) {
                    countTypeMap[PageTypeEnum.MONITOR] = [];
                }
                countTypeMap[PageTypeEnum.MONITOR].push(...countTypeMap[key]);
            });
            const summaryValueArr = countTypeMap[this.filterType];

            const [normal_count, warn_count, error_count] = summaryValueArr.map((key) => Number(monitorEventNum[key]));
            // const total = countTypeMap[PageTypeEnum.MONITOR].reduce((prev, curKey) => ((prev += monitorEventNum[curKey])), 0);
            return [{
                title: curPageType,
                total: normal_count + warn_count + error_count,
                warn_count,
                error_count,
                normal_count,
            }];
        },
    }
};
export default summaryMixin;
