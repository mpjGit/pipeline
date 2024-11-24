<template>
    <div class="unit-group group-select">
        <!-- unit选项 -->
        <div class="select-option" v-for="(item,index) in unitArray" :key="index" v-on:click="handleUnitSelect(item)" v-bind:class="{active: currentUnit && index === currentUnit.id}">
            {{item.text}}
        </div>
    </div>
</template>

<script>
    import {UNIT_ARRAY} from "../vuex/modules/configs";
    import {mapActions} from "vuex";

    export default {
        name: "UnitSelect",
        data: function () {
            return {
                unitArray: UNIT_ARRAY
            }
        },
        methods: {
            ...mapActions({
                'setUnit': 'configs/setUnit'
            }),
            handleUnitSelect: function (item) {
                this.setUnit({unitId: item.id});
                // this.toast('正在设置单位, 请稍等', 1000);
            }
        },
        watch: {
            currentUnit: function(cur) {
                // this.toast('当前单位为: ' + cur.text)
            }
        }
    }
</script>

<style scoped lang="less">
    @import "../styles/common";
    .group-select {
        display: grid;
        grid-gap: 0.2rem;
        grid-template-columns: repeat(4, 1fr);

        .select-option {
            width: 1.4rem;
            height: 0.44rem;
            color: rgba(23, 23, 23, 1);
            font-size: 0.2rem;
            border: 1px solid rgba(221, 221, 221, 1);
            border-radius: 0.22rem;
            .contentCenter;
            cursor: pointer;

            &.active {
                background: rgba(255, 135, 49, 1);
            }
        }
    }

</style>
