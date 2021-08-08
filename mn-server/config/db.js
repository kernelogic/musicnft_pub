/**
 * DB connection
 */
const mongoose = require('mongoose')
const config = require('./index')
const log4js = require('./../utils/log4j')

mongoose.connect(config.URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;

// db.collections.song.createIndex({ songName: "text", songMimetype: "text", ipfsCID: "text" })

db.on('error',()=>{
    log4js.error('*** MongoDB connect failed ***')
})

db.on('open',()=>{
    log4js.info('*** MongoDB successful connected ***')
})