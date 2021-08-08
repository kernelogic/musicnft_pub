<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item v-for="(item, index) in breadList" :key="item.path">
      <router-link :to="link" v-if="index == 0">{{
        item.meta.title
      }}</router-link>
      <span v-else>{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script>
export default {
  name: "BreadCrumb",
  data() {
    return {
      link: this.$store.state.userInfo ? '/me' : '/'
    }
  },
  computed: {
    breadList() {
      return this.$route.matched;
    },
  },
  watch: {
    '$store.state.userInfo': function(newValue, oldValue) {
      if (newValue) { // login
        this.link = '/me';
      } else { // logout
        this.link = '/';
      }
    }
  }
};
</script>