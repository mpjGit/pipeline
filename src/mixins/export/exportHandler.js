const exportHandler = {
    data () {
        return {
        }
    },
    methods: {
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

export default exportHandler;
