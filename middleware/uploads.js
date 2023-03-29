const multer  = require('multer')

class Uploads {
    fileUpload(destination = 'uploads') {
        this.storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, `assets/${destination}`);
            },
            filename: function (req, file, cb) {
                let fileName = file.originalname.trim();
                let imageName = Date.now() + '-' + Math.round(Math.random() * 1E9) + "-" + fileName;
                cb(null, imageName)
            }
        });
        return multer({storage: this.storage});
    }
}

module.exports = Uploads;
