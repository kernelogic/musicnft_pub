<template>
  <el-form label-width="100px">
    <el-container>
      <el-main>
        <el-row :gutter="20">
          <el-col :span="6">
              <el-card class="box-card">
                <template #header>
                  <div class="card-header">
                    <span>Album information</span>
                  </div>
                </template>
                <el-image
                  v-if="albumForm.coverImagePath"
                  class="cover-image-inner"
                  :src="serverURLPerfix + albumForm.coverImagePath.replace('uploads', '')"
                  fit="fit">
                </el-image>
                <el-image
                  v-else
                  class="cover-image-inner"
                  :src="defaultAlbumCoverImage"
                  fit="fit">
                </el-image>
                <el-form-item label="Title:">
                  <label v-text="albumForm.title" />
                </el-form-item>
                <el-form-item label="Artist:">
                  <label v-text="albumForm.artist" />
                </el-form-item>
                <el-form-item label="Genre:">
                  <label v-text="albumForm.genre.join(', ')" />
                </el-form-item>
                <el-form-item label="Language:">
                  <label v-text="albumForm.language" />
                </el-form-item>
              </el-card>
          </el-col>
          <el-col :span="18">
            <el-card class="box-card">
              <template #header>
                <div class="card-header">
                  <span>Track list</span>
                </div>
              </template>
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
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </el-form>
</template>

<script>

const defaultForm = {
  userId: "",
  title: "",
  artist: "",
  genre: [],
  language: "",
  coverImagePath: ""
}

export default {
  data() {
    return {
      albumForm: Object.assign({}, defaultForm),
      songArray: [],
      serverURLPerfix: import.meta.env.VITE_SERVER_URL_PREFIX,
      defaultAlbumCoverImage: import.meta.env.VITE_DEFAULT_ALBUM_COVER_IMAGE,
    }
  },
  async mounted() {
    await this.getWelcomeAlbum();
    await this.getWelcomeAlbumSong();
  },
  methods: {
    async getWelcomeAlbum() {
      this.albumForm = await this.$api.getWelcomeAlbum({albumId: this.$route.query.albumId})
    },
    async getWelcomeAlbumSong() {
      this.songArray = await this.$api.getWelcomeAlbumSong({
        albumId: this.$route.query.albumId
      })
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
.cover-image-inner {
  margin-left: 45px; 
  max-width: 200px; 
  max-height: 200px;
}
</style>