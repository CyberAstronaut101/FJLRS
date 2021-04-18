const express = require("express");

const News = require("../models/news");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

// const PrinterFiles = require('../models/printerFiles');
const PrintQueueItem = require('../models/printQueueItem');
const User = require('../models/user');
const Materials = require('../models/materials');
const Printer = require('../models/printer');

const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

// BASE API ROUTE = /api/printlab/
const fs = require('fs');

// #region Multer setup 
/**================================================== *
 * ==========  Multer Fileupload Storage Setup ========== *
 * ================================================== */
//https://code.tutsplus.com/tutorials/file-upload-with-multer-in-node--cms-32088


const crypto = require('crypto');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
const multer = require('multer');
const path = require('path');
const { EMLINK } = require("constants");
const { fstat } = require("fs");

// config_data = require('../config/config.development.json');
// mongoURL = config_data.mongoURL;

// const connect = mongoose.createConnection(mongoURL, {useNewUrlParser: true, useUnifiedTopology: true});

// var gfs = Grid(connect, mongoose);

// const storage = new GridFsStorage({
//     gfs: gfs,
//     url: mongoURL,
//     file: (req, file) => {
//         return new Promise((resolve, reject) => {
//             crypto.randomBytes(16, (err, buf) => {
//                 if(err) {
//                     return reject(err);
//                 }

//                 const filename = buf.toString('hex') + path.extname(file.originalname);
//                 const fileInfo = {
//                     filename: filename,
//                     bucketName: 'uploads'
//                 };

//                 resolve(fileInfo);
//                 console.log("file uploaded...");
//             });
//         });
//     },
//     root: "uploads"
// });

// const upload = multer({ storage });

// SWITCHING TO LOCAL FILE STORAGE

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'filestore');
    },
    filename: function(req, file, cb) {
        console.log(file);
        cb(null, Date.now() + '-' + file.originalname);
    }
})

var upload = multer({ storage: storage });

// connect.once('open', () => {
//     gfs = new mongoose.mongo.GridFSBucket(connect.db, {
//         bucketName: "uploads"
//     });
// });

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
    console.log("Uploaded file: ");
    console.log(req.file);

    const newQueueItem = new PrintQueueItem({
        description: req.body.comments,
        fileId: req.file.filename,
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

router.get("/file/:jobId", (req, res) => {
    console.log("GET @ /api/printlab/file/:jobId");
    var fileName = req.params.jobId;
    // where the filename is 

    // First lookup the job
    PrintQueueItem.findById(req.params.jobId)
        .then(jobResult => {
            console.log(jobResult);

            // get file and download to client
            var file = jobResult.fileId;
            var file_path = path.join(__dirname, "../../", "/filestore/", file);
            console.log(file_path);

            try {
                if(fs.existsSync(file_path)) {
                    console.log("File exists");
                    return res.download(path.resolve(file_path));
                } else {
                    console.log("File does not exist.");
                    return res.status(200).json({ message: "Requested File Does Not Exist"});

                }

            } catch (err) {
                console.log("ERROR ON FILE DOWNLOAD");
                console.log(err);
            }
        })
    
  
})

//getting all queue items, regardless of print status
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

// getting all queue items that are not of printStatus: completed
router.get("/items/current", (req, res) => {
    console.log('GET @ /api/printerLab/items');
    console.log('returning list of all items');

    PrintQueueItem.find( { printStatus: { $ne: "Completed" }}).then(result => {

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

// Getting the queue items that are marked as 'completed'
router.get("/items/completed", (req, res) => {
    console.log("GET @ /api/printerLab/items/completed");

    PrintQueueItem.find( { printStatus: "Completed" })
        .then(result => {
            // Return the list of completed items
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
                    message: "All completed printqueuitems fetched successfully",
                    printers: finalResult
                });
                
            });
        })
})

router.get("/item/:jobId/", (req, res) => {
    console.log("GET @ /api/printLab/item/:jobId")
    console.log(req.params.jobId);

    PrintQueueItem.findById(req.params.jobId).then(result => {
        console.log("Result from specific job lookup:");
        console.log(result)

        //get username
        User.findById(result.submittedBy).then(userResult => {
            userName = userResult.firstname + " " + userResult.lastname;
        })

        //get material name
        Materials.findById(result.materialId).then(matResult => {
            console.log(matResult);
            materialNameType = matResult.materialName + " " + matResult.materialType;
            console.log(materialNameType);
        })

        //get printer name
        if(!result.assignedPrinter) {
            printerName = "Unassigned"
        } else {
            Printer.findById(result.assignedPrinter).then(printerResult => {
                printerName = printerResult.name;
            })
        }
        
        res.status(200).json({
            message: "Found Matching Print Request!",
            user: userName,
            material: materialNameType,
            printer: printerName,
            printJob: result.toClientNoName()
        })

    })
    .catch(err => {
        console.log("Error on job lookup...");
        console.log(err);
    })


    

});


// Assign Printer 
router.post("/assignPrinter", (req, res, next) => {
    console.log("POST @ /api/printLab/assignPrinter")

    var printerIdObj = mongoose.Types.ObjectId(req.body.printerId);

    //update assignedPrinter and printStatus fields
    PrintQueueItem.update({_id: req.body.job}, {$set:{"assignedPrinter":printerIdObj, "printStatus":req.body.printStatus}}).then(result => {

        res.status(200).json({
            message: "Assigned Printer",
            ok: true,
            resultJob: result
        })
    })
    .catch(err => {
        console.log("Error on assign printer...");
        console.log(err);
    })

})

// Assign Printer 
router.post("/changeStatus", (req, res, next) => {
    console.log("POST @ /api/printLab/changeStatus")

    //update assignedPrinter and printStatus fields
    PrintQueueItem.update({_id: req.body.job}, {$set:{"printStatus":req.body.printStatus}}).then(result => {

        res.status(200).json({
            message: "Changed Status",
            ok: true,
            resultJob: result
        })
    })
    .catch(err => {
        console.log("Error on change status...");
        console.log(err);
    })

})




module.exports = router;