import { isNumber } from "lodash";
import { getDeviceWarnList } from "@/api/apiHandler";

export default {
  data() {
    return {
      warnData: [],
      warnSearch: {
        total: 10,
      },
      warnForm: {
        enterpriseUuid: "",
        keyword: "",
        deviceUuid: "",
        searchTime: [],
        pageSize: 10,
        pageNum: 1,
      },
      warnCol: [
        {
          prop: "deviceName",
          label: "设备名称",
          width: 180,
        },
        {
          prop: "enterpriseName",
          label: "企业名称",
          width: 180,
        },
        {
          prop: "status",
          label: "报警状态",
          width: 180,
          render(_, value) {
            if (!value) {
              return "";
            }
            switch (value) {
              case "DEVICE_STATUS_ZC":
                return "正常";
              case "DEVICE_STATUS_GZ":
                return "故障";
              case "DEVICE_STATUS_BJ":
                return "报警";
            }
          },
        },
        {
          prop: "createAt",
          label: "创建时间",
          width: 180,
        },
        {
          prop: "updateAt",
          label: "修改时间",
          width: 180,
        },
        {
          prop: "uploadTime",
          label: "最后上传时间",
          width: 180,
        },
        {
          prop: "updateBy",
          label: "操作人",
          width: 180,
        },
        {
          prop: "signalStrength",
          label: "信号强度",
          width: 180,
        },
        {
          prop: "battery",
          label: "电池电压值",
          width: 180,
        },
        {
          prop: "createAt",
          label: "创建时间",
          width: 180,
        },
        {
          prop: "density",
          label: "浓度",
          width: 180,
          render(row, value) {
            return `${value}(${row.densityL} - ${row.densityH})`;
          },
        },
        {
          prop: "temperature",
          label: "温度",
          width: 180,
        },
        {
          prop: "intakeMpa",
          label: "进气压力",
          width: 180,
        },
        {
          prop: "liquidLevel",
          label: "液位状态",
          width: 180,
          render(row, value) {
            if (isNumber(value)) {
              return value === 0 ? "正常" : "超限";
            }
          },
        },
        {
          prop: "entranceGuard",
          label: "门禁状态",
          width: 180,
          render(row, value) {
            if (isNumber(value)) {
              return value === 0 ? "正常" : "异常";
            }
          },
        },
      ],
    };
  },
  methods: {
    async onSearchWarn() {
      const searchTime = this.warnForm.searchTime;
      if (searchTime && searchTime.length > 1) {
        this.warnForm.startTime = searchTime[0];
        this.warnForm.endTime = searchTime[1];
        delete this.warnForm.searchTime;
      }

      const res = await getDeviceWarnList({
        ...this.warnForm,
      });
      const { code } = res;
      if (code == "200") {
        this.warnData = res.data || [];
        res.total && (this.warnSearch.total = res.total);
        res.pageNum && (this.warnForm.pageNum = res.pageNum);
      }
    },
  },
};
