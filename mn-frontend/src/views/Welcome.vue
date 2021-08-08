<template>
  <div class="welcome">
    <el-space :size="20" wrap>
      <el-card class="box-card" style="width: 340px" v-for="album in albumList" :key="album">
          <div class="cover-image-container">
            <img v-if="album.coverImagePath" :src="serverURLPerfix + album.coverImagePath.replace('uploads', '')" class="image">
            <img v-else src="https://lh3.googleusercontent.com/Gmp2jS5r5chFNJnogAkVzpTFDzjQLvLp8pcJ4O5vin7Pei-q-bTD9h0tkol4Pa6YFb-EfQqrU3I7I96IXvWopp0jRORF2hp6Kv9QU8E=s302" class="image">
          </div>
          <div>
            <el-button type="text" class="button" @click="onAlbumClick(album)">{{ album.title }}</el-button>
          </div>
          <div>
            By: <span v-text="album.artist"></span>
          </div>
        </el-card>
    </el-space>
  </div>
</template>

<script>
export default {
  name: "welcome",
  data() {
    return {
      albumList: [],
      serverURLPerfix: import.meta.env.VITE_SERVER_URL_PREFIX
    }
  },
  watch: {
    $route() {
      this.getWelcomeAlbums();
    }
  },
  mounted() {
    this.getWelcomeAlbums();
  },
  methods: {
    async getWelcomeAlbums() {
      const param = {
        genre: this.$route.query.genre,
        language: this.$route.query.language
      }
      this.albumList = await this.$api.getWelcomeAlbums(param);
    },
    onAlbumClick(album) {
      this.$router.push({
        path: '/album',
        query: {
          albumId: album._id
        }
      });
    },
  }
};
</script>

<style lang="scss">
.welcome {
  min-height: 100%;
  background-color: #fff;
}
.cover-image-container {
  height: 302px;
  width: 302px;
  text-align: center;
}
</style>