let formSearching = {
    data: function () {
        return {
            // 搜索条件
            conditionForm: {
                deviceName: '',
                operatorName: '',
                startTime: '',
                endTime: ''
            },
            condition: {
            },
            lastUpdate: 0
        }
    },
    created() {
        if (this.$route.query?.deviceName) {
            this.conditionForm.deviceName = this.$route.query.deviceName;
        }
    },
    methods: {
        fetchPageWithQuery: function (page = 1) {
            const _condition = {...this.condition};
            Object.keys(_condition).forEach(item => {
                if (_condition[item] == '' || _condition[item] == undefined) {
                    delete _condition[item]
                }
            })
            let params = new URLSearchParams(_condition)
            this.fetchPage({page, query: params.toString()})
        }
    },
    watch: {
        conditionForm: {
            deep: true,
            handler: function(cur) {
                const { deviceName,endTime,startTime, implementer } = cur;
                let endTimeTimestamp;
                if(endTime) {
                    endTimeTimestamp = new Date(endTime).getTime();
                }
                let startTimeTimestamp;
                if(startTime) {
                    startTimeTimestamp= new Date(startTime).getTime();
                }

                if((new Date().getTime() - this.lastUpdate) > 1000) {
                    clearTimeout(this._timer);
                    this._timer = setTimeout(() => {
                        this.condition = {
                            nickname: deviceName,
                            endtime: endTime ? endTimeTimestamp : '',
                            starttime: startTime ? startTimeTimestamp : '',
                            implementer
                        };
                    }, 1000);

                }
            }
        },

        condition: function() {
            this.fetchPageWithQuery();
        }

    }
}

export default formSearching;
