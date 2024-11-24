import {getAllUser} from "@/api/apiHandler";

export default {
    props: ['deviceInfo'],
    data() {
        return {
            userList: [],
            inputValue: {
                devicename: '',
                latitude: '',
                longitude: '',
                video_version: '',
                body_version: '',
                camera_version: '',
                manuf_date: '',
                position: '',
                devicesecret: '',
                productkey: '',
                productname: '',
                product_secret: '',
                consume_id: '',
                userid: '',
            },
        };
    },
    created() {
        this.initUserList().then();
        if (this.support) {
            Object.keys({...this.support}).forEach(key => {
                this.support[key] = this.deviceInfo[key];
            });
        }
        Object.keys({...this.inputValue}).forEach(key => {
            this.inputValue[key] = this.deviceInfo[key];
        });
    },
    methods: {
        async initUserList() {
            const res = await getAllUser();
            if (!res.success) {
                return;
            }
            this.userList = res.detail;
        },
    },
}
