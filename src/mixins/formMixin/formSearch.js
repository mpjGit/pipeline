import { debounce, cloneDeep } from "lodash-es";

const formSearching = {
    data: function () {
        return {
            // 搜索条件
            conditionForm: {
                deviceName: '',
                // 操作员
                searchName: '',
                startTime: '',
                endTime: '',
                nickname: '',
                tmpname: '',
            },
            lastUpdate: 0,
            searchLoading: false,
        }
    },
    created() {
        if (this.$route.query?.deviceName) {
            this.conditionForm.deviceName = this.$route.query.deviceName;
        }
    },
    methods: {
        fetchPageWithQuery: debounce(function () {
            // const _condition = cloneDeep(this.conditionForm);
            if (this.filterType[0] !== PageTypeEnum.OPEN) {
                this.conditionForm.username = this.conditionForm.searchName;
            }
            if (this.filterType[0] === PageTypeEnum.OPEN) {
                this.conditionForm.tmpname = this.conditionForm.deviceName;
                this.conditionForm.nickname = this.conditionForm.deviceName;
            }
            this.fetchPage({ page: 1, query: this.conditionForm })
        }, 500),
    },
    watch: {
        conditionForm: {
            deep: true,
            handler: function() {
                this.fetchPageWithQuery();
            }
        },
    }
}

export default formSearching;
