<template>
  <!-- 故障记录详情、故障记录处理  -->
  <Modal
      class="fault-detail-modal"
      size="small"
      :on-close-trigger="closeDialog"
  >
    <template v-slot:header>
      <h3>请输入令牌信息</h3>
    </template>
    <template v-slot:body>
      <ValueGroup name="令牌" type="input" v-model="inputValue.lingPai"/>
      <div class="error-message-wrap" v-if="errorMessage">
        <img src="../../../assets/login/alert.svg"/>
        <span class="error-message">
              {{ errorMessage }}
            </span>
      </div>
    </template>
    <template v-slot:footer>
      <div class="button-wrap">
        <div class="button prefer" v-on:click="process">
          <span>确定</span>
        </div>
      </div>
    </template>
  </Modal>

</template>

<script>
import Modal from "@/components/modals/modalComponents/Modal";
import ValueGroup from "@/components/ValueGroup";
import {mapActions} from "vuex";

export default {
  name: "modal-ping-pai",
  components: {ValueGroup, Modal},
  props: ['userInfo'],
  data: function () {
    return {
      inputValue: {
        lingPai: '',
      },
      errorMessage: '',
    }
  },
  computed: {
  },
  created() {
    this.$store.dispatch('toast/showToast', {message: '请输入正确的令牌'})
  },
  methods: {
    ...mapActions({
      'showModal': 'showModal',
      'hideModal': 'hideModal',
      'login': 'login',
    }),


    closeDialog() {
      this.$emit('closeDialog');
    },

    async process() {
      const req = {
        ...this.userInfo,
        lingpai: this.inputValue.lingPai,
      }
      const code = await this.login(req);
      console.log('code', code)
      if (code === -502) {
        this.errorMessage = '令牌密码错误';
      }
    },
  },
}
</script>

<style scoped lang="less">
@import "../../../styles/common";

.fault-detail-modal {
  .grid {
    display: grid;
    grid-template-areas:
          'a b b'
          'c c c'
          'd e e';
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, auto);
    grid-column-gap: 0.2rem;

    .area-address {
      grid-area: e;
    }

    .area-device-name {
      grid-area: b;
    }

    .area-reason {
      grid-area: c;
    }
  }

  .button-wrap {
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: row;
    padding: 0 @padding @padding;
    .button;
  }
}
.error-message-wrap {
  width: 100%;
  position: absolute;
  margin-top: 0.2rem;
  margin-bottom: 0.1rem;
  font-size: 0.14rem;
  color: rgba(255, 135, 49, 1);
  padding-left: 0.2rem;

  img {
    width: 0.16rem;
    height: 0.16rem;
    vertical-align: middle;
    margin-right: 0.1rem;
  }

  .error-message {
    display: inline-block;
    vertical-align: middle;
  }
}

</style>
