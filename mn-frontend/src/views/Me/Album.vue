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
                    <label v-if="!isTitleEdit" v-text="albumForm.title" />
                    <el-button v-if="!isTitleEdit" type="primary" icon="el-icon-edit" class="album-edit-btn" @click="onInlineEdit('title')"></el-button>
                    <el-input v-if="isTitleEdit" v-model="albumForm.title"></el-input>
                    <div class="inline-edit-action-row" v-if="isTitleEdit">
                      <el-button type="success" icon="el-icon-check" @click="onInlineSave('title')"></el-button>
                      <el-button type="danger" icon="el-icon-close" @click="onInlineCancel('title')"></el-button>
                    </div>
                  </el-form-item>
                  <el-form-item label="Artist:">
                    <label v-if="!isArtistEdit" v-text="albumForm.artist" />
                    <el-button v-if="!isArtistEdit" type="primary" icon="el-icon-edit" class="album-edit-btn" @click="onInlineEdit('artist')"></el-button>
                    <el-input v-if="isArtistEdit" v-model="albumForm.artist"></el-input>
                    <div class="inline-edit-action-row" v-if="isArtistEdit">
                      <el-button v-if="isArtistEdit" type="success" icon="el-icon-check" @click="onInlineSave('artist')"></el-button>
                      <el-button v-if="isArtistEdit" type="danger" icon="el-icon-close" @click="onInlineCancel('artist')"></el-button>
                    </div>
                  </el-form-item>
                  <el-form-item label="Genre:">
                    <label v-if="!isGenreEdit" v-text="albumForm.genre.join(', ')" />
                    <el-button v-if="!isGenreEdit" type="primary" icon="el-icon-edit" class="album-edit-btn" @click="onInlineEdit('genre')"></el-button>
                    <el-select
                      v-if="isGenreEdit"
                      v-model="albumForm.genre"
                      multiple
                      filterable
                      remote
                      reserve-keyword
                      placeholder="Please enter keyword"
                      :remote-method="searchGenre"
                      :loading="genreLoading">
                      <el-option
                        v-for="item in genreOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <div class="inline-edit-action-row" v-if="isGenreEdit">
                      <el-button v-if="isGenreEdit" type="success" icon="el-icon-check" @click="onInlineSave('genre')"></el-button>
                      <el-button v-if="isGenreEdit" type="danger" icon="el-icon-close" @click="onInlineCancel('genre')"></el-button>
                    </div>
                  </el-form-item>
                  <el-form-item label="Language:">
                    <label v-if="!isLanguageEdit" v-text="albumForm.language" />
                    <el-button v-if="!isLanguageEdit" type="primary" icon="el-icon-edit" class="album-edit-btn" @click="onInlineEdit('language')"></el-button>
                    <el-select v-if="isLanguageEdit" v-model="albumForm.language" filterable placeholder="Please select language">
                      <el-option
                        v-for="item in tempLanguageJson"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <div class="inline-edit-action-row" v-if="isLanguageEdit">
                      <el-button v-if="isLanguageEdit" type="success" icon="el-icon-check" @click="onInlineSave('language')"></el-button>
                      <el-button v-if="isLanguageEdit" type="danger" icon="el-icon-close" @click="onInlineCancel('language')"></el-button>
                    </div>
                  </el-form-item>
                  <el-button v-if="isRemoveAlbumShow" type="danger" @click="onRemoveAlbum" style="margin-left: 130px">Remove album</el-button>
              </el-card>

              <el-card class="box-card" style="margin-top: 20px">
                <template #header>
                  <div class="card-header">
                    <span>Upload a new track</span>
                  </div>
                </template>
                <div style="text-align: center">
                  <el-upload
                    class="upload-file"
                    ref="upload"
                    drag
                    action="#"
                    :auto-upload="false"
                    :on-change="handleChange"
                    :on-remove="handleRemove"
                    :file-list="fileList"
                    multiple>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">Drag files here or <em>click</em> upload</div>
                    <template #tip>
                      <div class="el-upload__tip">
                        The uploaded file only supports mp3, wav, flac, ogg format
                      </div>
                    </template>
                  </el-upload>
                  <el-button size="small" type="success" @click="submitUpload" style="margin-top: 10px;">Upload</el-button>
                </div>
              </el-card>
          </el-col>
          <el-col :span="18">
            <el-card class="box-card">
              <template #header>
                <div class="card-header">
                  <span>Track list</span>
                </div>
              </template>
              <div v-for="(song, index) in songArray" :key="song._id">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <h2 style="font-size: 18px;">
                      Filename: {{song.songName}}
                    </h2>
                    <el-collapse v-model="activeCollapseName" accordion style="margin-top: 20px;">
                      <el-collapse-item title="Edit Metadata" name="1">
                        <el-form-item label="Album">
                          <label v-if="!isSongAlbumEdit" v-text="song.songAlbum" />
                          <el-button v-if="!isSongAlbumEdit && song.status != 'publish'" type="primary" icon="el-icon-edit" class="album-edit-btn" @click="onSongInlineEdit('album')"></el-button>
                          <el-input v-if="isSongAlbumEdit" v-model="song.songAlbum"></el-input>
                          <div class="inline-edit-action-row" v-if="isSongAlbumEdit">
                            <el-button type="success" icon="el-icon-check" @click="onSongInlineSave(song, 'album')"></el-button>
                            <el-button type="danger" icon="el-icon-close" @click="onSongInlineCancel('album')"></el-button>
                          </div>
                        </el-form-item>
                        <el-form-item label="Artist">
                          <label v-if="!isSongArtistEdit" v-text="song.songArtist" />
                          <el-button v-if="!isSongArtistEdit && song.status != 'publish'" type="primary" icon="el-icon-edit" class="album-edit-btn" @click="onSongInlineEdit('artist')"></el-button>
                          <el-input v-if="isSongArtistEdit" v-model="song.songArtist"></el-input>
                          <div class="inline-edit-action-row" v-if="isSongArtistEdit">
                            <el-button type="success" icon="el-icon-check" @click="onSongInlineSave(song, 'artist')"></el-button>
                            <el-button type="danger" icon="el-icon-close" @click="onSongInlineCancel('artist')"></el-button>
                          </div>
                        </el-form-item>
                        <el-form-item label="Title">
                          <label v-if="!isSongTitleEdit" v-text="song.songTitle" />
                          <el-button v-if="!isSongTitleEdit && song.status != 'publish'" type="primary" icon="el-icon-edit" class="album-edit-btn" @click="onSongInlineEdit('title')"></el-button>
                          <el-input v-if="isSongTitleEdit" v-model="song.songTitle"></el-input>
                          <div class="inline-edit-action-row" v-if="isSongTitleEdit">
                            <el-button type="success" icon="el-icon-check" @click="onSongInlineSave(song, 'title')"></el-button>
                            <el-button type="danger" icon="el-icon-close" @click="onSongInlineCancel('title')"></el-button>
                          </div>
                        </el-form-item>
                        <template v-for="(value, key, i) in song.metadata" :key="i">
                          <el-form-item :label="key">
                            {{value}}
                            <el-button v-if="song.status != 'publish'" type="danger" icon="el-icon-close" @click="onSongMetadataRemove(song, key)" style="float: right"></el-button>
                          </el-form-item>
                        </template>
                        <template v-if="song.status != 'publish'">
                          <h2 style="font-size: 16px;">Create new entry</h2>
                          <el-input :ref="'metadata-key-' + index"
                            v-model="metadataKeyArray[index]"
                            placeholder="Please enter metadata key"
                            style="margin-top: 10px;" />
                          <el-input :ref="'metadata-value-' + index"
                            v-model="metadataValueArray[index]"
                            placeholder="Please enter metadata value"
                            style="margin-top: 10px;" />
                          <el-button type="success" @click="onSongMetadataSave(song, index)"
                            style="margin-top: 10px;">Save</el-button>
                        </template>
                      </el-collapse-item>
                    </el-collapse>
                  </el-col>
                  <el-col :span="12">
                    <div class="track-action-row" style="font-size: 18px;">
                      <span v-if="!song.ipfsCID">Publish to get IPFS CID</span>
                      <a :href="'https://ipfs.io/ipfs/' + song.ipfsCID" v-else v-text="'ipfs://' + song.ipfsCID" target="_blank" />
                    </div>
                    <div class="track-action-row" style="margin-top: auto">
                      <el-button v-if="song.status != 'publish'" type="success" @click="onSongPublish(song)">Publish</el-button>
                      <el-button type="danger" icon="el-icon-close" @click="onSongRemove(song)"></el-button>
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
  coverImagePath: "",
  status: "draft"
}

export default {
  data() {
    return {
      albumForm: Object.assign({}, defaultForm),
      metadataKeyArray: [],
      metadataValueArray: [],
      fileList: [],
      songArray: [],
      isTitleEdit: false,
      isArtistEdit: false,
      isGenreEdit: false,
      isSongAlbumEdit: false,
      isSongArtistEdit: false,
      isSongTitleEdit: false,
      isLanguageEdit: false,
      tempGenreJson: [],
      tempLanguageJson: [],
      genreOptions: [],
      genreLoading: false,
      genreList: ["Country", "Classic", "Dance", "Hip-Hop", "Instrumental", "Jazz", "Pop", "Rock", "Soul"],
      languageList: ["Chinese", "English", "French", "German", "Italian", "Japanese", "Korean", "Spanish"],
      serverURLPerfix: import.meta.env.VITE_SERVER_URL_PREFIX,
      defaultAlbumCoverImage: import.meta.env.VITE_DEFAULT_ALBUM_COVER_IMAGE,
      isRemoveAlbumShow: false,
      activeCollapseName: '1',
    }
  },
  async mounted() {
    await this.getAlbum();
    await this.getAlbumSong();
    this.tempGenreJson = this.genreList.map(item => {
      return { value: item, label: item };
    });
    this.tempLanguageJson = this.languageList.map(item => {
      return { value: item, label: item };
    });
  },
  watch: {
    songArray: {
      handler(newValue, oldValue) {
        if (newValue.length == 0) {
          this.isRemoveAlbumShow = true;
        } else {
          this.isRemoveAlbumShow = false;
        }
      },
      deep: true
    }
  },
  methods: {
    async getAlbum() {
      this.albumForm = await this.$api.getAlbum({albumId: this.$route.query.albumId})
    },
    async getAlbumSong() {
      this.songArray = await this.$api.getAlbumSong({albumId: this.$route.query.albumId})
      if (this.songArray.length == 0) {
        this.isRemoveAlbumShow = true;
      }
    },
    onInlineEdit(field) {
      if (field == 'title') {
        this.isTitleEdit = true;
      }
      if (field == 'artist') {
        this.isArtistEdit = true;
      }
      if (field == 'genre') {
        this.isGenreEdit = true;
      }
      if (field == 'language') {
        this.isLanguageEdit = true;
      }
    },
    async onInlineSave(field) {
      if (field == 'title') {
        this.isTitleEdit = false;
      }
      if (field == 'artist') {
        this.isArtistEdit = false;
      }
      if (field == 'genre') {
        this.isGenreEdit = false;
      }
      if (field == 'language') {
        this.isLanguageEdit = false;
      }
      this.$api.updateAlbum(this.albumForm).then(() => {
        this.$message.success("Track updated successfully");
      });
    },
    async onInlineCancel(field) {
      if (field == 'title') {
        this.isTitleEdit = false;
      }
      if (field == 'artist') {
        this.isArtistEdit = false;
      }
      if (field == 'genre') {
        this.isGenreEdit = false;
      }
      if (field == 'language') {
        this.isLanguageEdit = false;
      }
      await this.getAlbum();
    },
    onSongInlineEdit(field) {
      if (field == 'album') {
        this.isSongAlbumEdit = true;
      }
      if (field == 'artist') {
        this.isSongArtistEdit = true;
      }
      if (field == 'title') {
        this.isSongTitleEdit = true;
      }
    },
    async onSongInlineSave(song, field) {
      if (field == 'album') {
        this.isSongAlbumEdit = false;
      }
      if (field == 'artist') {
        this.isSongArtistEdit = false;
      }
      if (field == 'title') {
        this.isSongTitleEdit = false;
      }
      this.$api.updateAlbumSong(song).then(() => {
        this.$message.success("Track updated successfully");
      });
    },
    async onSongInlineCancel(field) {
      if (field == 'album') {
        this.isSongAlbumEdit = false;
      }
      if (field == 'artist') {
        this.isSongArtistEdit = false;
      }
      if (field == 'title') {
        this.isSongTitleEdit = false;
      }
      await this.getAlbumSong();
    },
    onSongPublish(song) {
      song.status = 'publish';
      this.$api.updateAlbumSong(song).then((_song) => {
        song.ipfsCID = _song.ipfsCID;
        song.status = _song.status;
        this.$message.success("Publish successfully");
      });
    },
    onSongRemove(song) {
      if(confirm('Are you sure to remove this track?')) {
        for (var i = 0; i < this.songArray.length; i++) {
          if (this.songArray[i]._id == song._id) {
            this.songArray.splice(i, 1);
          }
        }
        this.$api.removeAlbumSong(song).then(() => {
          this.$message.success("Track removed successfully");
        });
      } else {
        return false;
      }
    },
    onSongMetadataSave(song, index) {
      if (!this.metadataKeyArray[index]) {
        this.$message.warning("Please enter metadata key");
        return;
      }
      if (!this.metadataValueArray[index]) {
        this.$message.warning("Please enter metadata value");
        return;
      }
      song.metadata[this.metadataKeyArray[index]] = this.metadataValueArray[index];
      this.$api.updateAlbumSong(song).then(() => {
        this.$message.success("Metadata updated successfully");
        this.metadataKeyArray[index] = '';
        this.metadataValueArray[index] = '';
      });
    },
    onSongMetadataRemove(song, key) {
      if(confirm('Are you sure to delete this metadata entry?')) {
        delete song.metadata[key];
        this.$api.updateAlbumSong(song).then(() => {
          this.$message.success("Metadata removed successfully");
        });
      } else {
        return false;
      }
    },
    searchGenre(query) {
      if (query !== '') {
        this.genreLoading = true;
        setTimeout(() => {
          this.genreLoading = false;
          this.genreOptions = this.tempGenreJson.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.genreOptions = [];
      }
    },
    handleChange(file, fileList) {
      this.fileList = fileList
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    async submitUpload() {
      try {
        if (this.fileList.length === 0) {
            return this.$message.warning('Please select file')
        }
        const formData = new FormData();
        this.fileList.forEach((file) => {
            formData.append('song', file.raw)
        });
        const uploadedSongs = await this.$api.uploadAlbumSongs(formData);
        this.fileList = [];
        this.$message.success("Upload successfully");

        let presaveSongs = [];
        uploadedSongs.forEach(song => {
          presaveSongs.push({
            userId: this.albumForm.userId,
            albumId: this.albumForm._id,
            songName: song.originalname,
            songPath: song.path,
            songMimetype: song.mimetype,
            songSize: song.size
          });
        });
        let savedSongArray = await this.$api.createAlbumSong(presaveSongs);
        savedSongArray.forEach(savedSong => {
          this.songArray.push(savedSong);
        })
      } catch (error) {
        
      }
    },
    onRemoveAlbum() {
      this.$api.removeAlbum(this.albumForm).then(() => {
        this.$router.push("/me");
        this.$message.success("Album removed successfully");
      });
    }
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
.album-edit-btn {
  float: right;
}
.inline-edit-action-row {
  margin-top: 10px;
}
.track-action-row {
  min-height: 48px;
  text-align: right;
}
.cover-image-inner {
  margin-left: 100px; 
  max-width: 200px; 
  max-height: 200px;
}
</style>