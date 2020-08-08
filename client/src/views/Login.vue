<template>
  <div class="login-container">
    <div class="pageHeader">
      <img src="../assets/logo.png" alt="logo" />
      <span>聊啊聊</span>
    </div>

    <div class="login-box">
      <div class="login-text" v-if="typeView != 2">
        <a href="javascript:;" :class="typeView == 0 ? 'active' : ''" @click="handleTab(0)">登录</a>
        <b>·</b>
        <a href="javascript:;" :class="typeView == 1 ? 'active' : ''" @click="handleTab(1)">注册</a>
      </div>
      <!-- 登录模块 -->
      <div class="right-content" v-show="typeView == 0">
        <div class="input-box">
          <input
            autocomplete="off"
            type="text"
            class="input"
            v-model="formLogin.userName"
            placeholder="请输入登录邮箱/手机号"
          />
          <input
            autocomplete="off"
            type="password"
            class="input"
            v-model="formLogin.userPwd"
            maxlength="20"
            @keyup.enter="login"
            placeholder="请输入登录密码"
          />
        </div>
        <Button class="loginBtn" type="primary" :loading="isLoading" @click.stop="login">立即登录</Button>

        <div class="option">
          <Checkbox class="remember" v-model="checked" @on-change="checkChange">
            <span class="checked">记住我</span>
          </Checkbox>
          <span class="forget-pwd" @click.stop="forgetPwd">忘记密码?</span>
        </div>
      </div>

      <!-- 注册模块-->
      <div class="right_content" v-show="typeView == 1">
        <div class="input-box">
          <input
            autocomplete="off"
            type="text"
            class="input"
            v-model="formRegister.userName"
            placeholder="请输入注册邮箱/手机号"
          />
          <input
            autocomplete="off"
            type="text"
            class="input"
            v-model="formRegister.displayName"
            maxlength="20"
            placeholder="请输入昵称"
          />
          <input
            autocomplete="off"
            type="password"
            class="input"
            v-model="formRegister.userPwd"
            maxlength="20"
            @keyup.enter="register"
            placeholder="请输入密码"
          />
          <input
            autocomplete="off"
            type="password"
            class="input"
            v-model="formRegister.userPwd2"
            maxlength="20"
            @keyup.enter="register"
            placeholder="请再次确认密码"
          />
        </div>
        <Button class="loginBtn" type="primary" :disabled="isRegAble"  :loading="isLoading" @click.stop="register">立即注册</Button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      formLogin: {
        userName: "",
        userPwd: "",
      },
      formRegister: {
        userName: "",
        userPwd2: "",
        userPwd: "",
      },
      typeView: 0, //显示不同的view
      checked: false, // 记住登录
      isLoading: false,
    };
  },
  computed: {
    // 登陆按钮状态
    isDisabled() {
      return !(this.formLogin.userName && this.formLogin.userPwd);
    },
    // 注册按钮状态
    isRegAble() {
      return !(this.formRegister.userName && this.formRegister.userPwd && this.formRegister.userPwd2);
    },
  },
  methods: {
    // 登录/注册tab切换
    handleTab(type) {
      this.typeView = type;
      this.clearInput();
    },
    // 输入框焦点样式
    focusInput(index) {
      if (index === 1)
        this.$refs.loginVerifyCode.style.borderBottomColor = "#0f52e0";
      else this.$refs.resetVerifyCode.style.borderBottomColor = "#0f52e0";
    },
    blurInput(index) {
      if (index === 2)
        this.$refs.resetVerifyCode.style.borderBottomColor = "#e7e7e7";
      else this.$refs.loginVerifyCode.style.borderBottomColor = "#e7e7e7";
    },
    // 返回登录界面
    selectLogin() {
      this.typeView = 0;
      this.clearInput();
    },
    // 忘记密码界面
    forgetPwd() {
      this.$Message.info("忘记密码，请联系客服");
    },

    // 立即登录
    async login() {
      if (this.isDisabled || this.isLoading) {
        return false;
      }
      this.isLoading = true;
      try {
        const response = await axios.post(
          process.env.VUE_APP_BASE_URL + "/login",
          {
            email: this.formLogin.userName,
            password: this.formLogin.userPwd,
          }
        );
        this.isLoading = false;
        this.$Message.info(response.data.token);
        localStorage.setItem("jwt", response.data.token);

        this.$router.push("/");
      } catch (error) {
        this.isLoading=false
        // 分异常类型
        this.$Message.info("用户名或密码输入不正确");
      }
    },
    async register() {
      if (this.isRegAble || this.isLoading) {
        return false;
      }

      if (!this.$Valid.validUserName(this.formRegister.userName)) {
        this.$Message.error("请输入正确的邮箱/手机号");
        return false;
      } else if (!this.$Valid.validPass(this.formRegister.userPwd)) {
        this.$Message.error("密码应为8到20位字母或数字！");
        return false;
      } else if (!this.$Valid.validPass(this.formRegister.userPwd2)){
        this.$Message.error("确认密码有误");
        return false;
      } else if (this.formRegister.userPwd2 !== this.formRegister.userPwd){
        this.$Message.error("两次密码不一致");
        return false;
      }else if(this.formRegister.displayName.length == 0){
        this.$Message.error("请输入昵称");
        return false;
      }
      this.isLoading = true;
      try {
        const response=await axios.post(process.env.VUE_APP_BASE_URL + "/register", {
          email: this.formRegister.userName,
          password: this.formRegister.userPwd,
          displayName: this.formRegister.displayName
        });
        this.isLoading = false;
        this.$Message.info("正常通过");
        localStorage.setItem('jwt', response.data.token)
        
        this.$router.push('/')

      } catch (error) {
        this.isLoading = false;
        console.log(error.message);
        this.$Message.info(error.message);
      }
    },

    // 是否勾选记住密码
    checkChange(status) {
      console.log(status);
      this.checked = status;
    },

    // 清空输入框
    clearInput() {
      this.formLogin = {
        userName: "",
        userPwd: "",
      };
      this.formRegister = {
        userName: "",
        userPwd2: "",
        userPwd: "",
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.login-container {
  background-image: url("../assets/bg.png");
  background-position: center;
  background-size: cover;
  position: relative;
  width: 100%;
  height: 100%;

  .pageHeader {
    padding-top: 30px;
    padding-left: 40px;

    img {
      vertical-align: middle;
      display: inline-block;
      margin-right: 15px;
    }

    span {
      font-size: 18px;
      display: inline-block;
      vertical-align: -4px;
      color: rgba(255, 255, 255, 1);
    }
  }

  .login-box {
    position: absolute;
    left: 64vw;
    top: 50%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    box-sizing: border-box;
    text-align: center;
    box-shadow: 0 1px 11px rgba(0, 0, 0, 0.3);
    border-radius: 2px;
    /*margin: 100px auto 0;*/
    width: 420px;
    background: #fff;
    padding: 45px 35px;
    .option {
      text-align: left;
      margin-top: 18px;
      .checked {
        padding-left: 5px;
      }
      .forget-pwd,
      .goback {
        float: right;
        font-size: 14px;
        font-weight: 400;
        color: #4981f2;
        line-height: 20px;
        cursor: pointer;
      }
      .protocol {
        color: #4981f2;
        cursor: pointer;
      }
    }

    .login-text {
      width: 100%;
      text-align: center;
      padding: 0 0 30px;
      font-size: 24px;
      letter-spacing: 1px;
      a {
        padding: 10px;
        color: #969696;
        &.active {
          font-weight: 600;
          color: rgba(73, 129, 242, 1);
          border-bottom: 2px solid rgba(73, 129, 242, 1);
        }
        &:hover {
          border-bottom: 2px solid rgba(73, 129, 242, 1);
        }
      }
      b {
        padding: 10px;
      }
    }
    .title {
      font-weight: 600;
      padding: 0 0 30px;
      font-size: 24px;
      letter-spacing: 1px;
      color: rgba(73, 129, 242, 1);
    }

    .input-box {
      .input {
        &:nth-child(1) {
          /*margin-top: 10px;*/
        }
        &:nth-child(2),
        &:nth-child(3) {
          margin-top: 20px;
        }
      }
    }

    .loginBtn {
      width: 100%;
      height: 45px;
      margin-top: 40px;
      font-size: 15px;
    }

    .input {
      padding: 10px 0px;
      font-size: 15px;
      width: 350px;
      color: #2c2e33;
      outline: none; // 去除选中状态边框
      border: 1px solid #fff;
      border-bottom-color: #e7e7e7;
      background-color: rgba(0, 0, 0, 0); // 透明背景
    }

    input:focus {
      border-bottom-color: #0f52e0;
      outline: none;
    }
    .button {
      line-height: 45px;
      cursor: pointer;
      margin-top: 50px;
      border: none;
      outline: none;
      height: 45px;
      width: 350px;
      background: rgba(216, 216, 216, 1);
      border-radius: 2px;
      color: white;
      font-size: 15px;
    }
  }

  // 滚动条样式
  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.3);
    border-radius: 8px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.2);
    -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5);
  }

  ::-webkit-scrollbar-thumb:window-inactive {
    background: rgba(0, 0, 0, 0.4);
  }

  //设置更改input 默认颜色
  ::-webkit-input-placeholder {
    /* WebKit browsers */
    color: #bebebe;
    font-size: 16px;
  }

  ::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #bebebe;
    font-size: 16px;
  }

  :-ms-input-placeholder {
    /* Internet Explorer 10+ */
    color: #bebebe;
    font-size: 16px;
  }

  input:-webkit-autofill {
    box-shadow: 0 0 0px 1000px rgba(255, 255, 255, 1) inset;
    -webkit-box-shadow: 0 0 0px 1000px rgba(255, 255, 255, 1) inset;
    -webkit-text-fill-color: #2c2e33;
  }

  .ivu-checkbox-wrapper {
    margin-right: 0;
  }
}
</style>
