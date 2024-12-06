<template>
  <!-- 全局询问框 -->
  <transition name="fade" duration="500">
    <Modal :visible="show"
           class="confirm-modal-container"
           :on-close-trigger="handleClose"
           size="small">
      <template v-slot:header>
        <h3>提示信息</h3>
      </template>
      <template v-slot:body>
        <div class="confirm-body">
          <div class="icon-wrap">
            <img src="../assets/img/confirm.svg" />
          </div>
          <div class="text-wrap">
            <p>{{message}}</p>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div class="button-wrap">
          <div class="button" v-on:click="onCancel">
            <span>{{ cancelMsg }}</span>
          </div>
          <div class="button prefer" v-on:click="onConfirm">
            <span>{{ confirmMsg }}</span>
          </div>
        </div>
      </template>
    </Modal>
  </transition>
</template>

<script>
import Modal from "@/components/Modal";
import { mapActions } from 'vuex'

export default {
name: "ConfirmModal",
  components: {Modal},
  methods: {
    ...mapActions([
        `hideModal`
    ]),
    handleClose: function () {
      this.hideModal();
    }
  },
  computed: {
    show: function () {
      return this.$store.state.confirm.show;
    },
    message: function () {
      return this.$store.state.confirm.message;
    },
    onConfirm: function () {
      return this.$store.state.confirm.onConfirm;
    },
    onCancel: function () {
      return this.$store.state.confirm.onCancel
    },
    confirmMsg: function() {
      return this.$store.state.confirm.confirmMsg
    },
    cancelMsg: function() {
      return this.$store.state.confirm.cancelMsg
    }
  }
}
</script>

<style scoped>

</style>
