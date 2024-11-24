<template>
    <div class="device-container">

        <div class="table-container">

            <TableComponent :columns="columns" :rows="formatRows" v-on:pageChange="handlePageChange" :checkbox="false"
                :total="pagination.total" :current-page="pagination.currentPage" :page-size="pagination.pageSize" />
        </div>
    </div>
</template>

<script>
    import TableComponent from "@/components/Table";
    import Vue from 'vue'
    import {
        mapActions
    } from "vuex";
    import {isFaultMsg, isWarnMsg} from "@/utils/tool";

    export default {
        name: "DeviceList",
        components: {
            TableComponent
        },
        data: function() {
            return {
                // 基础数据信息
                columns: [{
                        label: '设备名称',
                        key: 'name',
                        width: '10%',
                    },
                    {
                        label: '设备位号',
                        key: 'no',
                        width: '10%',
                    },
                    {
                        label: '实时浓度',
                        key: 'concentration',
                        width: '10%',
                        // eslint-disable-next-line no-unused-vars
                        render: function(value) {
                            return Vue.component('test', {
                                render: function(h) {
                                    return h('h2', this.currentUnit.transform(value).value+""+this.currentUnit.text);
                                }
                            })
                        }
                    },
                    {
                        label: '速度',
                        key: 'speed',
                        width: '10%',
                        render: function(value) {
                            return Vue.component('speed-block', {
                                render: function(h) {
                                    return h('h2', value + ' km/h');
                                }
                            })
                        }
                    },
                    {
                        label: '状态',
                        key: 'status',
                        width: '10%',
                        render: (value,rowData) => {
                            let currentStatus = value;
                            let text;
                            let num;
                            switch (value) {
                                case NORMAL:
                                    text = '正常',
                                    num = ''
                                    break;
                                case WARN:
                                    text = '故障';
                                    num = '('+rowData.countFault+')';
                                    break;
                                case ERROR:
                                    text = '报警';
                                    num = '('+rowData.countAlert+')';
                                    break;
                            }
                            return Vue.component('dynamic', {
                                render: function(h) {
                                    return h('div', {
                                        attrs: {
                                            class: `${currentStatus} status`
                                        }
                                    }, [
                                        h('span', text+num)
                                    ], '');
                                    //return `<div class="status ${currentStatus}"><span>${text}</span></div>`
                                }
                            })
                        }
                    },

                ],
                // rows: [
                //   { id:1, name:"CT710", no: '*****************************', status: NORMAL,concentration: 0.03343 },
                // ]
                timer: null
            }
        },

        beforeDestroy() {
            clearInterval(this.timer)
        },

        mounted() {
            this.fetchPage(1)
            this.timer = setInterval(() => {
                this.fetchPage(1)
            }, 4000);
        },

        methods: {
            ...mapActions({
                'fetchPage': 'inVehicleList/fetchPage',
            }),

            // 翻页动作处理
            handlePageChange: function(ev) {
                const {
                    page
                } = ev;
                this.fetchPage(page);
            }
        },

        computed: {
            formatRows: function() {
                return this.rows.map(value => {
                    return {
                        ...value,
                        className: value.status
                    }
                })
            },
            // 设备列表
            rows: function() {
                return this.$store.state.inVehicleList.list.map(item => {
                    let status = NORMAL;
                    if (isFaultMsg(item.fault)) {
                        status = WARN;
                    }
                    if (isWarnMsg(item.fault)) {
                        status = ERROR;
                    }
                    return {
                        id: item.id,
                        name: item.nickName,
                        no: item.deviceName,
                        status: status,
                        speed: item.speed,
                        concentration: item.concentration,
                        countAlert: item.countAlert,
                        countFault: item.countFault
                    }
                });
            },

            // 分页信息
            pagination: function() {
                return {
                    total: this.$store.state.inVehicleList.total,
                    pageSize: this.$store.state.inVehicleList.pageSize,
                    currentPage: this.$store.state.inVehicleList.currentPage,
                }
            }

        }

    }
</script>

<style scoped lang="less">
    @import "../../styles/common";

    .device-container {
        position: relative;
        z-index: 10;
        width: 100%;
        pointer-events: visible;
        font-size: 0.16rem;
        color: white;

        .table-container {
            padding-top: @navButtonSize;
            width: 100%;
        }

    }
</style>
