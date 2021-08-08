<template>
  <div class="login-wrapper">
    <div class="modal">
      <el-form ref="userForm" :model="user" status-icon :rules="rules">
        <div class="title">Login to NFT Music Portal</div>
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
        <el-form-item>
          <el-button type="primary" class="btn-login" @click="login">Login</el-button>
          <el-image class="btn-login-google" @click="signInWithGoogle" :src="googleImg" fit="contain"></el-image>
          <!-- <el-image class="btn-login-facebook" @click="signInWithFacebook" :src="googleImg" fit="contain"></el-image> -->
          <router-link to="/register" class="link-register">Don't have an account? Register</router-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import storage from "./../utils/storage";
import { firebase } from "./../utils/firebase";
import googleImg from './../assets/btn_google_signin_dark_normal_web@2x.png'

export default {
  name: "login",
  data() {
    return {
      user: {
        userEmail: "",
        userPwd: "",
      },
      rules: {
        userEmail: [
          {
            required: true,
            message: "Please enter email",
            trigger: "blur",
          },
        ],
        userPwd: [
          {
            required: true,
            message: "Please enter password",
            trigger: "blur",
          },
        ],
      },
      googleImg
    };
  },
  methods: {
    login() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          this.$api.login(this.user).then(async (res) => {
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
.login-wrapper {
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
    .btn-login {
      width: 100px;
    }
    .btn-login-google {
      margin-left: 10px;
      width: 140px;
      height: 34px;
      overflow: inherit;
      :hover {
        cursor:pointer;
      }
    }
    .btn-login-facebook {
      margin-left: 10px;
      width: 140px;
      height: 34px;
      overflow: inherit;
      :hover {
        cursor:pointer;
      }
    }
    .link-register {
      display: block;
    }
  }
}
</style>