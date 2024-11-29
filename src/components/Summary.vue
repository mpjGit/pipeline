<!-- 用于展示设备统计的概览信息 -->
<template>
  <div class="summary-container" v-bind:class="{'fullscreen': isFullScreen}">
    <div class="main-wrap">
      <div class="title">{{formatTitle}}</div>
      <div class="total">{{total}}</div>
    </div>
    <div class="status-wrap">

      <div class="sub-status-wrap">
        <div class="status normal"></div>
        <div class="status-text">正常</div>
        <div class="amount">{{normal_count}}</div>
      </div>

      <div class="sub-status-wrap">
        <div class="status warn"></div>
        <div class="status-text">故障</div>
        <div class="amount">{{warn_count}}</div>
      </div>

      <div class="sub-status-wrap">
        <div class="status error"></div>
        <div class="status-text">报警</div>
        <div class="amount">{{error_count}}</div>
      </div>

      <div class="sub-status-wrap">
        <div class="status warn"></div>
        <div class="status-text">电压</div>
        <div class="amount">{{ deviceBattery }}</div>
      </div>

      <div class="sub-status-wrap">
        <div class="status warn"></div>
        <div class="status-text">信号</div>
        <div class="amount">{{ deviceSignal }}</div>
      </div>

      <div class="sub-status-wrap">
        <div class="status offline"></div>
        <div class="status-text">离线</div>
        <div class="amount">{{ deviceElectricity }}</div>
      </div>


    </div>
  </div>
</template>

<script>
export default {
  name: "Summary",

  props: {
    title: {
      type: String,
      default: '设备'
    },
    total: {
      type: Number,
      default: 0
    },
    normal_count: {
      type: Number,
      default: 0
    },
    warn_count: {
      type: Number,
      default: 0
    },
    error_count: {
      type: Number,
      default: 0
    },
    deviceBattery: {
      type: Number,
      default: 0
    },
    deviceSignal: {
      type: Number,
      default: 0
    },
    deviceElectricity: {
      type: Number,
      default: 0
    },
  },
  computed: {
    formatTitle: function() {
      const titles = {
        'jxCount': '井下设备',
        'czCount': '车载设备',
        'wxzsCount': '无线智能终端(桩)',
        'dsCount': '点式设备',
        'wxCount': '无线智能终端',
        [PageTypeEnum.OPEN]: '开路设备',
        'scCount': '手持设备',
        [PageTypeEnum.INVEHICLE]: '车载设备',
        [PageTypeEnum.MILEAGE]: '无线智能终端（桩式）',
      };
      return titles[this.title];
    }
  }
}

</script>

<style scoped lang="less">
.summary-container {
  width: 2.2rem;
  height: auto;
  color: white;
  background: #222A3644;
  border-radius: 0.16rem 0.16rem 0.16rem 0.16rem;
  position: relative;
  font-size: 0.2rem;
  padding: 0.3rem 0.22rem;

  .main-wrap {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.16rem;
    .title {
      font-size: 0.2rem;
    };
    .total {
      font-size: 0.28rem;
    }
  }
  .status-wrap {
    font-size: 0.2rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
    .sub-status-wrap {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 0.14rem;

      .status {
        width: 0.14rem;
        height: 0.14rem;
        border-radius: 50%;
        border: 0.02rem solid;
        box-sizing: border-box;
        margin-right: 0.05rem;

        &.normal {
          border-color: #007E7E;
          background-color: rgba(7, 185, 185, 1);
        }

        &.warn {
          background-color: rgba(255, 195, 0, 1);
          border-color: rgba(206, 143, 16, 1);
        }

        &.error {
          background-color: rgba(250, 81, 81, 1);
          border-color: rgba(193, 33, 33, 1);
        }

        &.offline {
          background-color: #ccc;
          border-color: #ddd;
        }
      }
      .status-text {
        margin-right: 0.05rem;
      }
      .amount {
        font-weight: bold;
      }
    }
  }

  &.fullscreen {
    width: 2.2rem;
    height: auto;
    background-color: transparent;
    text-shadow: 0 0 0.05rem rgba(0,0,0,0.6);
    .main-wrap {
    }
    .status-wrap {
      display: grid;
      grid-template-rows: repeat(3, 1fr);
      grid-row-gap: 0.1rem;
    }
  }
}
</style>
