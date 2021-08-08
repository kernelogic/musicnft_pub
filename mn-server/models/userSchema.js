const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    "userId" : Number,//Auto increment
    "userName" : String,
    "userPwd" : String,
    "userEmail" : String,
    "createTime" : {
        type:Date,
        default:Date.now()
    },
    "lastLoginTime" : {
        type:Date,
        default:Date.now()
    },
    remark:String
})

module.exports = mongoose.model("users",userSchema,"users")