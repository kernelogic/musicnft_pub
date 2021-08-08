const multer = require('koa-multer');

function uploadAlbumCoverImage(filePath, fileName) {
    const storage = multer.diskStorage({ // multer调用diskStorage可控制磁盘存储引擎
        destination: function(req, file, cb) {
            // 设置文件的存储目录，需提前创建
            cb(null, filePath || './uploads/albumCoverImage')
        },
        filename: function(req, file, cb) {
            const filenameArr = file.originalname.split('.');
            cb(null, fileName || (Date.now() + '.' + filenameArr[filenameArr.length-1])); // 文件名使用cb回调更改
        }
    })
    return upload = multer({
        storage: storage
    })
}

function uploadAlbumSongs(filePath, fileName) {
    const storage = multer.diskStorage({ // multer调用diskStorage可控制磁盘存储引擎
        destination: function(req, file, cb) {
            // 设置文件的存储目录，需提前创建
            cb(null, filePath || './uploads/albumSongs')
        },
        filename: function(req, file, cb) {
            const filenameArr = file.originalname.split('.');
            cb(null, fileName || (Date.now() + '.' + filenameArr[filenameArr.length-1])); // 文件名使用cb回调更改
        }
    })
    return upload = multer({
        storage: storage
    })
}

module.exports = {
    uploadAlbumCoverImage,
    uploadAlbumSongs
}
