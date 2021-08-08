const mongoose = require('mongoose')
const songSchema = mongoose.Schema({
    "userId" : String,
    "albumId" : String,
    "metadata" : Object,
    "songAlbum" : String,
    "songArtist" : String,
    "songTitle" : String,
    "songName" : String,
    "songPath" : String,
    "songMimetype" : String,
    "songSize" : Number,
    "ipfsCID" : String,
    "status" : {
        type: String,
        default: "draft"
    },
    "createdTime" : {
        type:Date,
        default:Date.now()
    },
    "lastModifiedTime" : {
        type:Date,
        default:Date.now()
    },
})

module.exports = mongoose.model("song", songSchema, "song")
