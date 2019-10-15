const multer = require("multer");
const path = require("path");
const fs = require("fs");

const prepareUploadFolder = (uploadFolder)  => {
    if (!fs.existsSync(uploadFolder)) {
        fs.mkdirSync(uploadFolder);
    } else {
        fs.readdirSync(uploadFolder).forEach((file, index) => {
            var curPath = uploadFolder + "/" + file;
            if (!fs.lstatSync(curPath).isDirectory()) { // recurse
                fs.unlinkSync(curPath);
            }
        });
    }
};

exports.initialize = (app, uploadFolder) => {
    prepareUploadFolder(uploadFolder);

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, uploadFolder);
        },
        filename: function (req, file, cb) {
          cb(null, file.originalname);
        }
      });
    const upload = multer({ storage: storage });

    app.post('/uploadfile', upload.single('dataset'), (req, res, next) => {
        const file = req.file
        if (!file) {
            const error = new Error('Please upload a file')
            error.httpStatusCode = 400
            return next(error)
        }
        const uploadedFile = path.resolve(uploadFolder, file.originalname);
        res.send({
            file: uploadedFile
        });
    });

};

