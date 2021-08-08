<template>
  <el-form>
    <el-container>
      <el-main>
        <div v-for="song in songArray" :key="song._id">
          <el-row :gutter="20">
            <el-col :span="12">
              <h2 style="font-size: 18px;">
                Filename: {{song.songName}}
              </h2>
              <el-collapse accordion style="margin-top: 20px;">
                <el-collapse-item title="Metadata">
                  <el-form-item label="Album:">
                    <label v-text="song.songAlbum" />
                  </el-form-item>
                  <el-form-item label="Artist:">
                    <label v-text="song.songArtist" />
                  </el-form-item>
                  <el-form-item label="Title:">
                    <label v-text="song.songTitle" />
                  </el-form-item>
                  <template v-for="(value, key, i) in song.metadata" :key="i">
                    <el-form-item :label="key">
                      {{value}}
                    </el-form-item>
                  </template>
                </el-collapse-item>
              </el-collapse>
            </el-col>
            <el-col :span="12">
              <div class="track-action-row" style="font-size: 18px;">
                <a :href="'https://ipfs.io/ipfs/' + song.ipfsCID" v-text="'ipfs://' + song.ipfsCID" target="_blank" />
              </div>
              <div class="track-action-row" >
                <audio height="auto" controls preload="none">
                  <source :src="serverURLPerfix + song.songPath.replace('uploads', '')" :type="song.mimetype" />
                </audio>
              </div>
            </el-col>
          </el-row>
          <el-divider></el-divider>
        </div>
      </el-main>
    </el-container>
  </el-form>
</template>

<script>

export default {
  data() {
    return {
      albumArray: [],
      songArray: [],
      serverURLPerfix: import.meta.env.VITE_SERVER_URL_PREFIX
    }
  },
  watch: {
    $route() {
      this.searchSongs();
    }
  },
  async mounted() {
    await this.searchSongs();
  },
  methods: {
    async searchSongs() {
      const result = await this.$api.searchSongs({queryStr: this.$route.params.queryStr})
      this.songArray = result.songs;
      this.albumArray = result.albums;
    },
  },
};
</script>

<style lang="scss">
.el-header {
  text-align: right;
}
.el-main {
  background-color: #fff;
}
.track-action-row {
  min-height: 48px;
  text-align: right;
}
</style>