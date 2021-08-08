<template>
  <div class="basic-layout">
    <div class="content">
      <div class="nav-top">
        <div class="nav-left">
          <!-- LOGO -->
          <div class="logo">
            <img src="./../assets/logo.png" />
            <router-link to="/" style="color: #fff;">Music NFT</router-link>
          </div>
          <div class="bread">
            <BreadCrumb />
          </div>
        </div>
        <div class="user-info">
          <el-dropdown @command="handleLogout">
            <span class="user-link">
              {{ userInfo.userEmail }}
              <i class="el-icon--right"></i>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="me">My Albums</el-dropdown-item>
                <el-dropdown-item command="logout">Log out</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="wrapper">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import BreadCrumb from "./BreadCrumb.vue";
export default {
  name: "UserHome",
  components: { BreadCrumb },
  data() {
    return {
      userInfo: this.$store.state.userInfo
    };
  },
  computed: {
  },
  mounted() {
  },
  methods: {
    handleLogout(key) {
      if (key == "me") {
        this.$router.push("/me");
      } else {
        this.$store.commit("saveUserInfo", "");
        this.userInfo = {};
        this.$router.push("/welcome");
      }
    }
  },
};
</script>

<style lang="scss">
.basic-layout {
  position: relative;
  .content {
    .nav-top {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      .nav-left {
        display: flex;
        align-items: center;
        .logo {
            display: flex;
            align-items: center;
            font-size: 18px;
            height: 50px;
            width: 300px;
            background-color: #001529;
            color: #fff;
            img {
                margin: 0 16px;
                width: 32px;
                height: 32px;
            }
        }
        .bread {
            padding: 0 20px;
        }
        .menu-fold {
          margin-right: 15px;
          font-size: 18px;
        }
      }
      .user-info {
        .notice {
          line-height: 30px;
          margin-right: 15px;
          cursor: pointer;
        }
        .user-link {
          cursor: pointer;
          color: #409eff;
        }
      }
    }
    .wrapper {
      background: #eef0f3;
      padding: 20px;
      height: calc(100vh - 50px);
      .main-page {
        background: #fff;
        height: 100%;
      }
    }
  }
}
</style>