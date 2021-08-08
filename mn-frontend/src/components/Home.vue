<template>
  <div class="basic-layout">
    <div :class="['nav-side', 'unfold']">
      <!-- LOGO -->
      <div class="logo">
        <img src="./../assets/logo.png" />
        <router-link to="/" style="color: #fff;">Music NFT</router-link>
      </div>
      <!-- NAV -->
      <el-menu
        :default-active="activeMenu"
        background-color="#fff"
        text-color="#333"
        active-text-color="#409EFF"
        router
        class="nav-menu"
        :default-openeds="defaultOpeneds"
      >
        <el-submenu index="1">
          <template #title>Music by genre</template>
          <el-menu-item index="Country" :route="{path: '/welcome', query: {genre: 'Country'}}">Country</el-menu-item>
          <el-menu-item index="Classic" :route="{path: '/welcome', query: {genre: 'Classic'}}">Classic</el-menu-item>
          <el-menu-item index="Dance" :route="{path: '/welcome', query: {genre: 'Dance'}}">Dance</el-menu-item>
          <el-menu-item index="Hip-Hop" :route="{path: '/welcome', query: {genre: 'Hip-Hop'}}">Hip-Hop</el-menu-item>
          <el-menu-item index="Instrumental" :route="{path: '/welcome', query: {genre: 'Instrumental'}}">Instrumental</el-menu-item>
          <el-menu-item index="Jazz" :route="{path: '/welcome', query: {genre: 'Jazz'}}">Jazz</el-menu-item>
          <el-menu-item index="Pop" :route="{path: '/welcome', query: {genre: 'Pop'}}">Pop</el-menu-item>
          <el-menu-item index="Rock" :route="{path: '/welcome', query: {genre: 'Rock'}}">Rock</el-menu-item>
          <el-menu-item index="Soul" :route="{path: '/welcome', query: {genre: 'Soul'}}">Soul</el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template #title>Music by language</template>
          <el-menu-item index="English" :route="{path: '/welcome', query: {language: 'English'}}">English</el-menu-item>
          <el-menu-item index="French" :route="{path: '/welcome', query: {language: 'French'}}">French</el-menu-item>
          <el-menu-item index="Chinese" :route="{path: '/welcome', query: {language: 'Chinese'}}">Chinese</el-menu-item>
          <el-menu-item index="German" :route="{path: '/welcome', query: {language: 'German'}}">German</el-menu-item>
          <el-menu-item index="Italian" :route="{path: '/welcome', query: {language: 'Italian'}}">Italian</el-menu-item>
          <el-menu-item index="Japanese" :route="{path: '/welcome', query: {language: 'Japanese'}}">Japanese</el-menu-item>
          <el-menu-item index="Korean" :route="{path: '/welcome', query: {language: 'Korean'}}">Korean</el-menu-item>
          <el-menu-item index="Spanish" :route="{path: '/welcome', query: {language: 'Spanish'}}">Spanish</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <div :class="['content-right', 'unfold']">
      <div class="nav-top">
        <div class="search-input">
          <el-input v-model="queryStr" @keyup.enter.native="onSearch"></el-input>
          <el-button class="search-btn" @click="onSearch">Search</el-button>
        </div>
        <div class="user-info">
          <el-dropdown v-if="userInfo.userEmail" @command="handleLogout">
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
          <el-button v-else size="medium" @click="onLogin">Login / Register</el-button>
        </div>
      </div>
      <div class="nav-bottom">
        <div class="nav-left">
          <div class="bread">
            <BreadCrumb />
          </div>
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
  name: "Home",
  components: { BreadCrumb },
  data() {
    return {
      userInfo: this.$store.state.userInfo,
      activeMenu: location.hash.slice(1),
      defaultOpeneds: ["1", "2"],
      queryStr: ""
    };
  },
  computed: {
  },
  watch: {
    $route() {
      this.activeMenu = this.$route.query.genre || this.$route.query.language
    }
  },
  mounted() {
    this.activeMenu = this.$route.query.genre || this.$route.query.language
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
    },
    onLogin() {
      this.$router.push("/login");
    },
    onSearch() {
      this.$router.push({
        name: 'search',
        params: {
          queryStr: this.queryStr
        }
      });
    }
  },
};
</script>

<style lang="scss">
.basic-layout {
  position: relative;
  .nav-side {
    position: fixed;
    width: 300px;
    height: 100vh;
    background-color: #001529;
    color: #fff;
    overflow-y: auto;
    transition: width 0.5s;
    .logo {
      display: flex;
      align-items: center;
      font-size: 18px;
      height: 50px;
      img {
        margin: 0 16px;
        width: 32px;
        height: 32px;
      }
    }
    .nav-menu {
      height: calc(100vh - 50px);
      border-right: none;
    }
    &.fold {
      width: 64px;
    }
    &.unfold {
      width: 300px;
    }
  }
  .content-right {
    margin-left: 300px;
    &.fold {
      margin-left: 64px;
    }
    &.unfold {
      margin-left: 300px;
    }
    .nav-top {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
      .search-input {
        display: inline-flex;
        width: 600px;
        align-items: center;
        .search-btn {
          margin-left: 20px;
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
    .nav-bottom {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      padding: 0 20px;
      .nav-left {
        display: flex;
        align-items: center;
        .menu-fold {
          margin-right: 15px;
          font-size: 18px;
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