<template>
  <!--<div style="display:flex;flex;flex-direction: column;">-->
  <div class="login-container">
    <div class="left-part">
      <template v-if="curProjectName === 'dalian'">
        <div class="logo-wrap">
          <img src="../assets/login/logo.png"/>
        </div>
        <div class="describe-wrap">
          <img src="../assets/login/describe.png"/>
        </div>
      </template>

      <ul class="text-describe">
        <li>
          <span>Applicability</span></li>
        <li>
          <span>Reliability</span>
        </li>
        <li>
          <span>Security</span>
        </li>
      </ul>
    </div>
    <div class="login-part">
      <div class="login-box">
        <div class="welcome-wrap">
          <h3>Hello!</h3>
          <span>欢迎登录智慧管网泄漏监控系统平台</span>
        </div>
        <div class="input-wrap-container">
          <div class="input-wrap" v-bind:class="{focus: focusOnUserName}">
            <span>用户名</span>
            <input
                type="text"
                name="username"
                v-model="localUsername"
                v-on:focus="makeFocus('username')"
                v-on:blur="focusOnUserName=false"
                placeholder="请输入用户名"
            />
          </div>
        </div>

        <div class="input-wrap-container">

          <div class="input-wrap" v-bind:class="{focus: focusOnPassword}">
            <span>密码</span>
            <input
                type="password"
                name="password"
                v-model="password"
                v-on:focus="makeFocus('password')"
                v-on:blur="focusOnPassword=false"
                placeholder="请输入密码"
            />
          </div>

          <div class="error-message-wrap" v-if="errorMessage">
            <img src="../assets/login/alert.svg"/>
            <span class="error-message">
              {{ errorMessage }}
            </span>
          </div>

        </div>


        <div class="button-wrap" v-on:click="handleLogin">
          登录
        </div>
        <template v-if="curProjectName === 'dalian'">
          <div class="company-info">
            大连向量集传感技术有限公司
          </div>
        </template>
      </div>
    </div>

    <!-- 登录成功提示 -->
    <div class="modal-container" v-if="showWelcomeModal">
      <div class="login-success-modal">
        <div class="alert-box">

          <div class="avatar-wrap">
            <img class="avatar" src="../assets/img/avatar.png"/>
          </div>

          <div class="welcome-message">
            欢迎
            <span class="login-user">{{ loginUser }}</span>
            用户登录
          </div>

          <div class="button-wrap" v-on:click="enter">
            <div class="button">进入</div>
          </div>

        </div>
      </div>
    </div>
    <!-- 备案提示 -->
    <div style="display:flex;flex-direction: row;height:6%;font-size: 0.06rem;background-color:black">
      <h3>Copyright © 2022 -2022大连向量集传感技术有限公司 All Rights Reserved.备案号：</h3>
      <a href="https://beian.miit.gov.cn/" target="_blank">
        辽ICP备2022003429号-2</a></div>
  </div>


</template>

<script>
import {mapActions} from 'vuex'

export default {
  name: "Login.vue",
  data: function () {
    return {
      focusOnUserName: false,
      focusOnPassword: false,
      showWelcomeModal: false,
      localUsername: '',
      password: ''
    }
  },
  created() {
    this.$bus.$on('handleLoginDialog', this.handleLoginDialog);
  },
  mounted() {
    // 如果用户已经登录， 则直接跳转
    if (localStorage.getItem('statusCode')) {
      this.$store.state.user.username = ""
    } else {
      if (this.isLogin === true) {
        this.$router.replace('/')
      }
    }

  },
  beforeDestroy() {
    this.$bus.$off('handleLoginDialog', this.handleLoginDialog);
  },
  methods: {
    ...mapActions([
      `login`,
      `setErrorMessage`,
    ]),

    handleLoginDialog(val) {
      this.showWelcomeModal = val;
    },

    makeFocus: function (tag) {
      switch (tag) {
        case 'username':
          this.focusOnUserName = true;
          break;
        case 'password':
          this.focusOnPassword = true;
          break;
      }

      this.setErrorMessage('')
    },

    handleLogin: function () {
      // 判断数据
      let {localUsername, password} = this.$data;

      if (!localUsername) {
        this.setErrorMessage('请输入用户名！')
        return false;
      }
      if (!password) {
        this.setErrorMessage('请输入密码!')
        return false;
      }
      this.setErrorMessage('')
      this.login({username: localUsername, password});
      if (localStorage.getItem('statusCode')) {
        localStorage.removeItem('statusCode')
      }
    },
    enter: function () {
      this.$router.replace('/monitor')
      this.handleLoginDialog(false);
    }
  },
  computed: {
    loginUser: function () {
      return this.$store.state.user.username;
    },
    errorMessage: function () {
      return this.$store.state.user.errorMessage;
    }
  },
}
</script>

<style scoped lang="less">
.login-container {
  width: 100%;
  height: 97%;
  background-image: url("../assets/login/login_bg1.jpg");
  background-size: cover;
  display: block;
  position: relative;

  .left-part {
    display: inline-flex;
    vertical-align: middle;
    flex-direction: column;
    align-items: flex-start;
    padding-left: 10%;
    box-sizing: border-box;
    justify-content: center;
    width: 50%;
    height: 100%;

    .logo-wrap {
      position: relative;

      img {
        max-width: 100%;
        width: 3.9rem;
        height: auto;
      }
    }

    .describe-wrap {
      position: relative;

      img {
        max-width: 100%;
        width: 6.2rem;
        height: auto;
      }
    }

    .text-describe {
      display: flex;
      flex-direction: row;
      align-items: flex-start;

      li {
        font-size: 0.24rem;
        color: rgba(255, 135, 49, 1);
        margin-right: 0.2rem;

        &:before {
          content: '';
          width: 0.06rem;
          height: 0.06rem;
          background: rgba(255, 135, 49, 1);
          border-radius: 50%;
          display: inline-block;
          vertical-align: middle;
        }

        span {
          display: inline-block;
          padding-left: 0.1rem;
        }
      }
    }
  }

  .login-part {
    width: 50%;
    height: 100%;
    display: inline-flex;
    vertical-align: middle;
    justify-content: center;
    align-items: center;

    .login-box {
      width: 4.8rem;
      min-height: 5.2rem;
      background: white;
      border-radius: 0.12rem;
      padding: 0.71rem;
      box-sizing: border-box;

      .welcome-wrap {
        font-size: 0px;
        margin-bottom: 0.8rem;

        h3 {
          font-size: 0.32rem;
          margin-bottom: 0.1rem;
        }

        span {
          font-size: 0.16rem;
          line-height: 0.20rem;
        }
      }

      .input-wrap-container {
        margin-bottom: 0.28rem;

        .input-wrap {
          background: rgba(245, 245, 245, 1);
          overflow: hidden;
          display: flex;
          flex-wrap: wrap;
          width: 3.38rem;
          height: 0.46rem;
          border-radius: 1rem;
          border: 1px solid rgba(228, 229, 229, 1);
          padding-left: 0.21rem;
          box-sizing: border-box;
          font-size: 0.14rem;
          flex-direction: row;

          &.focus {
            background: white;
            border: 1px solid rgba(255, 135, 49, 1);
          }

          span {
            display: inline-block;
            color: rgba(102, 102, 102, 1);
            vertical-align: middle;
            align-self: center;
            width: 0.44rem;
            flex-shrink: 0;
            text-align: right;
          }

          input {
            vertical-align: middle;
            display: inline-block;
            background: transparent;
            flex-grow: 1;
            border: none;
            padding-left: 0.1rem;
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
      }

      .button-wrap {
        margin-top: 0.96rem;
        width: 3.38rem;
        height: 0.5rem;
        border-radius: 0.25rem;
        background: rgba(33, 33, 33, 1);
        color: white;
        font-size: 0.16rem;
        line-height: 0.5rem;
        text-align: center;
      }

      .company-info {
        font-size: 0.12rem;
        text-align: center;
        margin-top: 0.1rem;
        color: rgba(153, 153, 153, 1);
      }
    }
  }

  .modal-container {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .login-success-modal {
      width: 5.2rem;
      height: auto;
      padding-bottom: 0.28rem;
      background: white;
      border-radius: 0.05rem;

      .alert-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;

        .avatar-wrap {
          margin-top: -0.5rem;

          .avatar {
            width: 1rem;
            height: 1rem;
            border-radius: 50%;
          }
        }

        .welcome-message {
          font-size: 0.24rem;
          margin-bottom: 0.4rem;

          .login-user {
            color: rgba(255, 135, 49, 1);
          }
        }

        .button-wrap {
          .button {
            cursor: pointer;
            width: 1.2rem;
            height: 0.48rem;
            line-height: 0.48rem;
            background: rgba(255, 135, 49, 1);
            color: black;
            font-size: 0.18rem;
            border-radius: 1rem;
            align-self: center;
            text-align: center;
          }
        }
      }
    }
  }

}
</style>
