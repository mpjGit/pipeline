export default {
    name: 'pageEvent',
    mounted() {
        this.$bus.$on('refreshPage', this.fetchPage);
    },
    beforeDestroy() {
        this.$bus.$off('refreshPage', this.fetchPage);
    },
};
