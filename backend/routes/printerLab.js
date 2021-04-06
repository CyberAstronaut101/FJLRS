const express = require("express");

const News = require("../models/news");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

// const PrinterFiles = require('../models/printerFiles');
const PrintQueueItem = require('../models/printQueueItem');
const User = require('../models/user');

const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

// BASE API ROUTE = /api/printlab/

// #region Multer setup 
/**================================================== *
 * ==========  Multer Fileupload Storage Setup ========== *
 * ================================================== */
//https://code.tutsplus.com/tutorials/file-upload-with-multer-in-node--cms-32088


const crypto = require('crypto');
const GridFsStorage = require('multer-gridfs-storage');
const multer = require('multer');
const path = require('path');
const { EMLINK } = require("constants");

config_data = require('../config/config.development.json');
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

//#endregion
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


// Create 
router.post("/", upload.single('file'), (req, res, next) => {
    console.log("POST @ /api/printerlab/");
    // Middleware upload runs before getting here
    // That middleware uploads the file to MongoDB, and then appends the id to the file object
    // Then we can create an entry in the PrinterFiles DB with the pointer to the file id
    console.log(req.body);
    console.log("Uploaded file _id: " + req.file.id);

    const newQueueItem = new PrintQueueItem({
        description: req.body.comments,
        fileId: req.file.id,
        materialId: req.body.material,
        submittedBy: req.body.uid,
        printStatus: "Submitted"
    });

    console.log(newQueueItem);

    newQueueItem.save().then(createdItem => {
        console.log("Saved Queue to DB: " + createdItem._id);
        console.log(createdItem);
        // Send response
        res.status(200).json({
            message: {
                severity: "success",
                summary: "Success!",
                detail: "Job submitted successfully"
            },
            queueItem: createdItem
        });

    }).catch(error => {
        console.log(error);

        // TODO send error
        
    })

    // Massage the data and add the printQueue Item

    // Now create the printerFiles stubs, will then add the ID of this one to 
    // a PrinterJob entry that will encapsulate the entire job request submission.
})



router.get("/file/:fileName", (req, res) => {
    console.log("GET @ /api/printerlab/file/:id");
    var fileName = req.params.fileName;

    gfs.find( { filename: fileName})

    
})

//getting the queue table items
router.get("/items", (req, res) => {
    console.log('GET @ /api/printerLab/items');
    console.log('returning list of all items');

    PrintQueueItem.find().then(result => {

        userId = [];

        result.forEach(r => userId.push(ObjectId(r.submittedBy)));

        User.find({_id: {$in: userId}}).then(userResults => {

            finalResult = result.map(elem => {


                tempUser = userResults.findIndex(obj => {

                    return obj._id.toString() == elem.submittedBy.toString();
                })

                newName = userResults[tempUser].firstname + " " + userResults[tempUser].lastname;
            
                return elem.toClient(newName); // mongoose schema function to rename _id to id and add username
            });

            res.status(201).json({
                message: "All PrintQueueItems fetched successfully",
                printers: finalResult
            });
            
        });
    
    })

    function checkUser(userId, user) {
        return age >= 18;
      }
})

router.get("/item/:jobId/", (req, res) => {
    console.log("GET @ /api/printLab/item/:jobId")
    console.log(req.params.jobId);

    PrintQueueItem.find({_id: req.params.jobId}).then(result => {
        console.log("Result from specific job lookup:");
        console.log(result)

        // TODO might have to clean up the print job return?

        result = result.map(elem => {
            return elem.toClientNoName();
        })

        res.status(200).json({
            message: "Found Matching Print Request!",
            printJob: result
        })

    })
    .catch(err => {
        console.log("Error on job lookup...");
        console.log(err);
    })


    

});



module.exports = router;