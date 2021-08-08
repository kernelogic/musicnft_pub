<template>
  <el-container>
    <el-header>
      <i class="el-icon-circle-plus add-album-btn" title="Add Albummm" @click="addAlbum"></i>
    </el-header>
    <el-main>
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
    </el-main>
    <el-dialog title="Add album" v-model="showModal">
      <el-form
        ref="dialogForm"
        :model="albumForm"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="Title" prop="title">
          <el-input
            v-model="albumForm.title"
            placeholder="Please enter title"
          />
        </el-form-item>
        <el-form-item label="Artist" prop="artist">
          <el-input
            v-model="albumForm.artist"
            placeholder="Please enter artist"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="Genre" prop="genre">
          <el-select
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
        </el-form-item>
        <el-form-item label="Language" prop="language">
          <el-select v-model="albumForm.language" filterable placeholder="Please select language">
            <el-option
              v-for="item in tempLanguageJson"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Cover image" prop="coverImage">
          <el-upload
            action="#"
            ref="upload"
            list-type="picture-card"
            :limit="1"
            :auto-upload="false"
            :before-upload="beforeUpload">
              <template #default>
                <i class="el-icon-plus"></i>
              </template>
              <template #file="{file}">
                <div>
                  <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                  <span class="el-upload-list__item-actions">
                    <span
                      class="el-upload-list__item-preview"
                      @click="handlePictureCardPreview(file)"
                    >
                      <i class="el-icon-zoom-in"></i>
                    </span>
                    <span
                      class="el-upload-list__item-delete"
                      @click="handleDownload(file)"
                    >
                      <i class="el-icon-download"></i>
                    </span>
                    <span
                      class="el-upload-list__item-delete"
                      @click="handleRemove(file)"
                    >
                      <i class="el-icon-delete"></i>
                    </span>
                  </span>
                </div>
              </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">Cancle</el-button>
          <el-button type="primary" @click="handleSubmit">Save</el-button>
        </span>
      </template>
    </el-dialog>
  </el-container>
</template>

<script>
import storage from "./../../utils/storage";

const defaultForm = {
  userId: "",
  title: "",
  artist: "",
  genre: "",
  language: "",
  coverImagePath: ""
}

export default {
  data() {
    return {
      albumList: [],
      albumForm: Object.assign({}, defaultForm),
      rules: {
        title: [
          {
            required: true,
            message: "Please enter title",
            trigger: "blur",
          },
        ],
        artist: [
          {
            required: true,
            message: "Please enter artist",
            trigger: "blur",
          },
        ],
        genre: [
          {
            required: true,
            message: "Please enter genre",
            trigger: "blur",
          },
        ],
        language: [
          {
            required: true,
            message: "Please enter language",
            trigger: "blur",
          },
        ],
      },
      showModal: false,
      tempGenreJson: [],
      tempLanguageJson: [],
      genreOptions: [],
      genreLoading: false,
      genreList: ["Country", "Dance", "Hip-Hop", "Instrumental", "Jazz", "Pop", "Rock", "Soul"],
      languageList: ["Chinese", "English", "French", "German", "Italian", "Japanese", "Korean", "Spanish"],
      dialogImageUrl: '',
      dialogVisible: false,
      serverURLPerfix: import.meta.env.VITE_SERVER_URL_PREFIX
    }
  },
  mounted() {
    this.getAlbums();
    this.tempGenreJson = this.genreList.map(item => {
      return { value: item, label: item };
    });
    this.tempLanguageJson = this.languageList.map(item => {
      return { value: item, label: item };
    });
  },
  methods: {
    async getAlbums() {
      this.albumList = await this.$api.getAlbums();
    },
    onAlbumClick(album) {
      this.$router.push({
        path:'/albums/album',
        query: {
          albumId: album._id
        }
      });
    },
    addAlbum() {
      this.showModal = true
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
    handleRemove(file) {
      console.log(file);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleDownload(file, fileList) {

    },
    beforeUpload(file) {
      console.log('file', file)
      const isJPG = file.type === 'image/jpeg';
      const isLt5M = file.size / 1024 / 1024 < 5;

      if (!isJPG) {
        this.$message.error('The uploaded file only supports JPG format');
      }
      if (!isLt5M) {
        this.$message.error('The uploaded file size can not exceed 5MB');
      }
      return isJPG && isLt5M;
    },
    handleClose() {
      this.showModal = false
    },
    handleSubmit() {
      this.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          const fileArray = this.$refs.upload.uploadFiles;
          let uploadedCoverImagePath = null;
          if (fileArray.length) {
            const formData = new FormData();
            formData.append('coverImage', fileArray[0].raw);
            uploadedCoverImagePath = await this.$api.uploadAlbumCoverImage(formData);
          }

          this.albumForm.userId = storage.getItem("userInfo").userId;
          this.albumForm.coverImagePath = uploadedCoverImagePath;
          this.$api.createAlbum(this.albumForm).then(async (res) => {
            this.$message.success("Album created successfully");
            this.showModal = false;
            this.handleReset();
            this.getAlbums();
          });
        } else {
          return false;
        }
      });
    },
    handleReset() {
      this.albumForm = Object.assign({}, defaultForm);
    }
  },
};
</script>

<style lang="scss">
.el-header {
  text-align: right;
  .add-album-btn {
    font-size: 40px;
  }
}
.el-main {
  background-color: #fff;
}
.cover-image-container {
  height: 302px;
  width: 302px;
  text-align: center;
}
</style>