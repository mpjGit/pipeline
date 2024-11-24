let tableSelected = {
    data: function() {
        return {
            currentSelected: []
        }
    },
    computed: {
        hasSelected: function () {
            return this.currentSelected.length > 0;
        }
    },
    methods: {
        onSelectedChange: function(value) {
            this.currentSelected = value;
        },
        // 处理导出
        processExport: function () {
            console.log('this.currentSelected', this.currentSelected)
            this.showModal({
                message: '是否确认导出当前页选中数据？',
                onConfirm: () => {
                    // 执行导出
                    this.$store.dispatch('exportFront', {
                        tableList: this.currentSelected,
                        columns: this.columns,
                    });
                    this.hideModal();
                },
                onCancel: () => {
                    this.hideModal();
                }
            })
        },
    },
}

export default tableSelected;
