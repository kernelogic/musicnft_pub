const mongoose = require('mongoose')
const albumSchema = mongoose.Schema({
    "userId" : String,
    "title" : String,
    "artist" : String,
    "genre" : [String],
    "language" : String,
    "coverImagePath": String,
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

module.exports = mongoose.model("album",albumSchema,"album")
