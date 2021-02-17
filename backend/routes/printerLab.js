const express = require("express");

const News = require("../models/news");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

// const PrinterFiles = require('../models/printerFiles');
const PrintQueueItem = require('../models/printQueueItem');

const mongoose = require('mongoose');

// BASE API ROUTE = /api/printlab/

/**================================================== *
 * ==========  Multer Fileupload Storage Setup  ========== *
 * ================================================== */
//https://code.tutsplus.com/tutorials/file-upload-with-multer-in-node--cms-32088

const crypto = require('crypto');
const GridFsStorage = require('multer-gridfs-storage');
const multer = require('multer');
const path = require('path');

config_data = require('../config/config.production.json');
mongoURL = config_data.mongoURL;

const storage = new GridFsStorage({
    url: mongoURL,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if(err) {
                    return reject(err);
                }

                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };

                resolve(fileInfo);
                console.log("file uploaded...");
            });
        });
    }
});

const upload = multer({ storage });

const connect = mongoose.createConnection(mongoURL, {useNewUrlParser: true, useUnifiedTopology: true});
let gfs;

connect.once('open', () => {
    gfs = new mongoose.mongo.GridFSBucket(connect.db, {
        bucketName: "uploads"
    });
});


/* =======  End of Multer Fileupload Storage Setup  ======= */


/* ^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v
  `GET @ /api/printerLab/
    RETURNS
        DeptInfo[] -- All the current departments
^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v */
router.get("/", (req, res, next) => {
    console.log("\nGET @ /api/printerLab");
    console.log("Returning 3dprinter department schema");

    DeptInfo.findOne( {
        deptName: '3D Printer Lab'
    })
        .then(resDept => {
            console.log('3D Printer Lab Info From DB: ');
            console.log(resDept);

            // TODO MAYBE HAVE TO TOCLIENT THE ._id to .id?

            let resMessage = {
                severity: 'success',
                summary: 'Success!',
                detail: 'Loaded all Department info successfully!'
            };

            res.status(200).json({
                message: resMessage,
                printerDepartment: resDept
            })
        })
        .catch(err =>{
            console.log('!! ERROR !! on getting PrinterDepartment from DB!');

            let resMessage = {
                severity: 'error',
                summary: 'FAILED!',
                detail: 'Could Not Load 3D Printer Lab Information'
            };

            res.status(200).json({
                message: resMessage
            })
        })

})


// Create print queue item request
router.post("/", (req, res, next) => {
    console.log("POST @ /api/printerlab/upload");

    console.log(req.body);

    // Middleware upload runs before getting here
    // That middleware uploads the file to MongoDB, and then appends the id to the file object
    // Then we can create an entry in the PrinterFiles DB with the pointer to the file id

    console.log("Uploaded file _id: " + req.file.id);

    // Now create the printerFiles stubs, will then add the ID of this one to 
    // a PrinterJob entry that will encapsulate the entire job request submission.

})

router.post("/file", upload.single('file'), (req, res, next) => {
    console.log("POST @ /api/printerlab/file");
    console.log(req.params);
    console.log(req.body);
    console.log(req.files);
    console.log(req.file);

    // Middleware upload runs before getting here
    // That middleware uploads the file to MongoDB, and then appends the id to the file object
    // Then we can create an entry in the PrinterFiles DB with the pointer to the file id

    console.log("Uploaded file _id: " + req.file.id);

    // Now create the printerFiles stubs, will then add the ID of this one to 
    // a PrinterJob entry that will encapsulate the entire job request submission.

})

router.get("/file/:fileName", (req, res) => {
    console.log("GET @ /api/printerlab/file/:id");
    var fileName = req.params.fileName;

    gfs.find( { filename: fileName})

    
})



module.exports = router;