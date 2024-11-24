<template>
  <!-- 故障记录详情、故障记录处理  -->
  <Modal
      class="fault-detail-modal"
      size="small"
      :on-close-trigger="closeDialog"
  >
    <template v-slot:header>
      <h3>修改密码</h3>
    </template>
    <template v-slot:body>
      <ValueGroup name="请输入旧" type="input" v-model="inputValue.oldPwd"/>
      <ValueGroup name="请输入密码" type="input" v-model="inputValue.firstPwd"/>
      <ValueGroup name="请再次输入密码" type="input"  v-model="inputValue.secondPwd"/>
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
import {updatePwd} from "@/api/apiHandler";

export default {
  name: "modal-update-pwd",
  components: {ValueGroup, Modal},
  data: function () {
    return {
      inputValue: {
        oldPwd: '',
        firstPwd: '',
        secondPwd: '',
      },

    }
  },
  methods: {
    ...mapActions({
      'showModal': 'showModal',
      'hideModal': 'hideModal',
    }),


    closeDialog() {
      this.$emit('closeDialog');
    },

    async process() {
      const { firstPwd, secondPwd } = this.inputValue;
      if (!firstPwd || !secondPwd || secondPwd !== firstPwd) {
        await this.$store.dispatch('toast/showToast', { message: '请检查您的密码输入' })
        return;
      }
      const req = {
        id: this.userId,
        oldPassword: this.inputValue.oldPwd,
        newPassword: this.inputValue.firstPwd,
      }
      const res = await updatePwd(req);
      if (res !== '修改成功') {
        await this.$store.dispatch('toast/showToast', { message: res })
        return;
      }
      await this.$store.dispatch('toast/showToast', { message: '修改成功,跳转至登录页' })
      this.$vModal.close();
      this.sleep(500);
      this.$bus.$emit('logout');
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

</style>
