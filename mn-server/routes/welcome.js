const router = require('koa-router')()
const fs = require('fs');
const albumSchema = require('./../models/albumSchema')
const songSchema = require('./../models/songSchema')
const util = require('./../utils/util')
router.prefix('/welcome')

router.post('/albums/get', async (ctx) => {
   const { ...params } = ctx.request.body;
   const res = await albumSchema.find(params);
   ctx.body = util.success(res);
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

router.post('/search/songs', async (ctx) => {
   const { ...params } = ctx.request.body;
   // const songs = await songSchema.find({ $text: { $search: `${params.queryStr}` } });
   const songs = await songSchema.find({
      $and: [
         {$or: [
            { songName: {$regex: new RegExp(params.queryStr, "i")}},
            { songMimetype: {$regex: new RegExp(params.queryStr, "i")}},
            { ipfsCID: {$regex: new RegExp(params.queryStr, "i")}},
            { songAlbum: {$regex: new RegExp(params.queryStr, "i")}},
            { songArtist: {$regex: new RegExp(params.queryStr, "i")}},
            { songTitle: {$regex: new RegExp(params.queryStr, "i")}}
         ]},
         {
            status: 'publish'
         }
      ]
   });
   let albumIds = [];
   for (let i = 0; i < songs.length; i++) {
      if (albumIds.indexOf(songs[i].albumId) == -1) {
         albumIds.push(songs[i].albumId);
      }
   }
   const albums = await albumSchema.find({_id: {$in: albumIds}});
   ctx.body = util.success({albums, songs});
})

module.exports = router
