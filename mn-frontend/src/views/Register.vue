<template>
  <div class="register-wrapper">
    <div class="modal">
      <el-form ref="userForm" :model="user" status-icon :rules="rules">
        <div class="title">Register to NFT Music Portal</div>
        <el-form-item prop="userEmail">
          <el-input
            type="text"
            prefix-icon="el-icon-user"
            placeholder="Email"
            v-model="user.userEmail"
          />
        </el-form-item>
        <el-form-item prop="userPwd">
          <el-input
            type="password"
            prefix-icon="el-icon-view"
            placeholder="Password"
            v-model="user.userPwd"
          />
        </el-form-item>
        <el-form-item prop="userPwdRepect">
          <el-input
            type="password"
            prefix-icon="el-icon-view"
            placeholder="Repect password"
            v-model="user.userPwdRepect"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn-register" @click="register">Register</el-button>
          <el-image class="btn-register-google" @click="signInWithGoogle" :src="googleImg" fit="contain"></el-image>
          <el-image class="btn-register-facebook" @click="signInWithFacebook" :src="googleImg" fit="contain"></el-image>
          <router-link to="/login" class="link-login">Already have an account? Login</router-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import storage from "../utils/storage";
import { firebase } from "./../utils/firebase";
import googleImg from './../assets/btn_google_signin_dark_normal_web@2x.png'

export default {
  name: "login",
  data() {
    var validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter password'));
      } else if (value.length < 6) {
        callback(new Error('The password is shorter than 6 characters'));
      } else {
        if (this.$refs.userForm.userPwdRepect !== '') {
          this.$refs.userForm.validateField('userPwdRepect');
        }
        callback();
      }
    };
    var validateRepeatPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter repeat password'));
      } else if (value !== this.user.userPwd) {
        callback(new Error('Password does not match repeat'));
      } else {
        callback();
      }
    };
    return {
      user: {
        userEmail: "",
        userPwd: "",
        userPwdRepect: "",
      },
      rules: {
        userEmail: [
          {
            required: true,
            message: "Please enter email",
            trigger: "blur",
          },
          {
            type: 'email',
            message: 'Please enter the correct email address',
            trigger: 'blur',
          }
        ],
        userPwd: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        userPwdRepect: [
          { validator: validateRepeatPassword, trigger: 'blur' }
        ],
      },
      googleImg,
    };
  },
  methods: {
    register() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          this.$api.register(this.user).then(async (res) => {
            this.$store.commit("saveUserInfo", res);
            await this.loadAsyncRoutes();
            this.$router.push("/me");
          });
        } else {
          return false;
        }
      });
    },
    signInWithGoogle() {
      var provider = new firebase.auth.GoogleAuthProvider();
      this.signInWithPopup(provider);
    },
    signInWithFacebook() {
      var provider = new firebase.auth.FacebookAuthProvider();
      this.signInWithPopup(provider);
    },
    signInWithPopup(provider) {
      firebase.auth().signInWithPopup(provider).then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        this.$api.loginWithPopup({userEmail: user.email, userName: user.displayName}).then(async (res) => {
          this.$store.commit("saveUserInfo", res);
          await this.loadAsyncRoutes();
          this.$router.push("/me");
        });
      }).catch((error) => {
        console.log('signInWithError', error)
      });
    },
    async loadAsyncRoutes() {
      let userInfo = storage.getItem("userInfo") || {};
      if (userInfo.token) {
        try {
          const { menuList } = await this.$api.getPermissionList();
          let routes = utils.generateRoute(menuList);
          routes.map((route) => {
            let url = `./../views/${route.component}.vue`;
            route.component = () => import(url);
            this.router.addRoute("home", route);
          });
        } catch (error) {}
      }
    },
  },
};
</script>

<style lang="scss">
.register-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9fcff;
  width: 100vw;
  height: 100vh;
  .modal {
    width: 500px;
    padding: 50px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0px 0px 10px 3px #c7c9cb4d;
    .title {
      font-size: 24px;
      line-height: 1.5;
      text-align: center;
      margin-bottom: 30px;
    }
    .btn-register {
      width: 100px;
    }
    .btn-register-google {
      margin-left: 10px;
      width: 140px;
      height: 34px;
      overflow: inherit;
      :hover {
        cursor:pointer;
      }
    }
    .btn-register-facebook {
      margin-left: 10px;
      width: 140px;
      height: 34px;
      overflow: inherit;
      :hover {
        cursor:pointer;
      }
    }
    .link-login {
      display: block;
    }
  }
}
</style>