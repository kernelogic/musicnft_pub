const router = require('koa-router')()
const { create: ipfsClient } = require('ipfs-client')
const fs = require('fs');
const albumSchema = require('./../models/albumSchema')
const songSchema = require('./../models/songSchema')
const util = require('./../utils/util')
const uploadMiddleware = require('../utils/uploadMiddleware')
const log4js = require('./../utils/log4j')
const musicMetadata = require('music-metadata');
const sharp = require('sharp');
router.prefix('/me')

router.post('/albums/get', async (ctx) => {
   let authorization = ctx.request.headers.authorization;
   let { data } = util.decoded(authorization)
   const res = await albumSchema.find({
      userId: data.userId
   })
   ctx.body = util.success(res)
})

router.post('/album/get', async (ctx) => {
   const { ...params } = ctx.request.body;
   const res = await albumSchema.findById(params.albumId);
   ctx.body = util.success(res)
})

router.post('/album/song/get', async (ctx) => {
   const { ...params } = ctx.request.body;
   const songs = await songSchema.find({ albumId: params.albumId });
   ctx.body = util.success(songs)
})

router.post('/album/create', async (ctx) => {
   const { ...params } = ctx.request.body;
   try {
      await albumSchema.create(params);
      ctx.body = util.success('', 'Album created successfully');
   } catch (error) {
      ctx.body = util.fail(error.stack)
   }
})

router.post('/album/update', async (ctx) => {
   const { ...params } = ctx.request.body;
   try {
      await albumSchema.findByIdAndUpdate(params._id, params);
      ctx.body = util.success('', 'Album update successfully');
   } catch (error) {
      ctx.body = util.fail(error.stack)
   }
})

router.post('/album/remove', async (ctx) => {
   const { ...params } = ctx.request.body;
   try {
      await albumSchema.findByIdAndRemove(params._id);
      ctx.body = util.success('', 'Album remove successfully');
   } catch (error) {
      ctx.body = util.fail(error.stack)
   }
})

router.post('/album/song/create', async (ctx) => {
   const songArray = ctx.request.body;
   try {
      let savedSongArray = [];
      for (let i = 0; i < songArray.length; i++) {
         // Parse common metadata
         let metadataObject = {
            metadata: {}
         };
         try {
            const metadata = await musicMetadata.parseFile(songArray[i].songPath);
            generateSongMetadataObject(metadata, metadataObject);
         } catch (error) {
            log4js.error('Parse metadata failed' + error);
         }
         let savedSong = await songSchema.create({
            userId: songArray[i].userId,
            albumId: songArray[i].albumId,
            metadata: metadataObject.metadata,
            songAlbum: metadataObject.album,
            songArtist: metadataObject.artist,
            songTitle: metadataObject.title,
            songName: songArray[i].songName,
            songPath: songArray[i].songPath,
            songMimetype: songArray[i].songMimetype,
            songSize: songArray[i].songSize,
            ipfsCID: null
         });
         savedSongArray.push(savedSong);
      }
      ctx.body = util.success(savedSongArray, 'Song update successfully');
   } catch (error) {
      ctx.body = util.fail(error.stack)
   }
})

router.post('/album/song/update', async (ctx) => {
   const { ...params } = ctx.request.body;
   try {
      if (params.status == 'publish' && !params.ipfsCID) {
         try {
            const ipfs = ipfsClient({
               grpc: process.env.IPFS_GRPC_URL,
               http: process.env.IPFS_HTTP_URL
            })
            const ipfsRes = await ipfs.add({
               path: '/' + params.songName,
               content: fs.readFileSync(params.songPath)
            }, {
               wrapWithDirectory: true,
               progress: (prog) => console.log(`received: ${prog}`)
            });
            log4js.info(ipfsRes)
            params.ipfsCID = ipfsRes['cid']
         } catch (error) {
            log4js.error('Add to ipfs failed' + error);
         }
      }

      await songSchema.findByIdAndUpdate(params._id, params);
      updateAlbumStatus(params.albumId);
      ctx.body = util.success('', 'Song update successfully');
   } catch (error) {
      ctx.body = util.fail(error.stack)
   }
})

router.post('/album/song/remove', async (ctx) => {
   const song = ctx.request.body;
   try {
      await songSchema.findByIdAndRemove(song._id);
      fs.promises.unlink(song.songPath);
      updateAlbumStatus(song.albumId);
      ctx.body = util.success('', 'Song delete successfully');
   } catch (error) {
      ctx.body = util.fail(error.stack)
   }
})

router.post('/album/uploadAlbumCoverImage', uploadMiddleware.uploadAlbumCoverImage().array('coverImage', 1), async (ctx) => {
   const files = ctx.req.files;
   const filenameArr = files[0].originalname.split('.');
   const presaveFileName = Date.now() + '.' + filenameArr[filenameArr.length - 1];
   await sharp(files[0].path).resize(300, 300).toFile('./uploads/albumCoverImage/' + presaveFileName);
   fs.promises.unlink(files[0].path);
   ctx.body = util.success('uploads\\albumCoverImage\\' + presaveFileName);
})

router.post('/album/uploadAlbumSongs', uploadMiddleware.uploadAlbumSongs().array('song', 10), async (ctx) => {
   const files = ctx.req.files;
   ctx.body = util.success(files);
})

function generateSongMetadataObject(obj, targetObj) {
   for (let key in obj) {
      if (['bitrate', 'codec', 'disk', 'duration', 'track'].indexOf(key) != -1) {
         if (['disk', 'track'].indexOf(key) != -1) {
            targetObj['metadata'][key] = obj[key]['no'] || '';
         } else {
            targetObj['metadata'][key] = obj[key];
         }
      } else if (['album', 'artist', 'title'].indexOf(key) != -1) {
         targetObj[key] = obj[key]
      } else if (typeof (obj[key]) == 'object') {
         generateSongMetadataObject(obj[key], targetObj);
      }
   }
}

async function updateAlbumStatus(albumId) {
   const songs = await songSchema.find({
      albumId: albumId
   });
   let isPublish = false;
   for (let i = 0; i < songs.length; i++) {
      if (isPublish) {
         break;
      }
      if (songs[i].status && songs[i].status == 'publish') {
         isPublish = true;
      }
   }
   await albumSchema.findByIdAndUpdate(albumId, { status: isPublish ? 'publish' : 'draft' });
}

module.exports = router
