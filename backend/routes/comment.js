const express = require("express");

const Comment = require("../models/comment");
const checkAuth = require("../middleware/check-auth");
const User = require('../models/user');

const router = express.Router();
const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;


// Create 
router.post("/", (req, res, next) => {
    console.log("POST @ /api/comment/");
    console.log(req.body);

    //making sure these are the right types
    var jobIdObj = mongoose.Types.ObjectId(req.body.jobId);
    var submittedByObj = mongoose.Types.ObjectId(req.body.submittedBy);

    const newComment = new Comment({
        text: req.body.text,
        jobId: jobIdObj,
        submittedBy: submittedByObj
    });

    console.log(newComment);

    newComment.save().then(createdItem => {
        console.log("Saved comment to DB: " + createdItem._id);
        console.log(createdItem);

        createdItem = createdItem.toClient(req.body.userName);

        // Send response
        res.status(200).json({
            message: {
                severity: "success",
                summary: "Success!",
                detail: "Job submitted successfully",
            },
            ok: true,
            comment: createdItem
        });

    }).catch(error => {
        console.log(error);
    })
})

//get comment
router.get("", (req, res, next) => {
    console.log('GET @ /api/comment');
    console.log('returning list of all comments');

    Comment.find().then(result => {
        console.log('Comment.find() results');
        //console.log(result);

        //returning the user names
        userId = [];
        result.forEach(r => userId.push(ObjectId(r.submittedBy)));

        User.find({_id: {$in: userId}}).then(userResults => {

            finalResult = result.map(elem => {
                //find the user from the User.find query search that matches the comment "submittedBy"
                tempUser = userResults.findIndex(obj => { return obj._id.toString() == elem.submittedBy.toString();})
                newName = userResults[tempUser].firstname + " " + userResults[tempUser].lastname;
            
                return elem.toClient(newName); // mongoose schema function to rename _id to id and add username
            });

            res.status(201).json({
                message: "All PrintQueueItems fetched successfully",
                comments: finalResult,
                ok: true
            });
        });

        console.log(result);
    })
})

//get comment by jobId
router.get("/jobId/:jobId", (req, res, next) => {
    console.log('GET @ /api/comment/:jobId');
    console.log('returning list comments with jobId ' + req.params.jobId);
    var jobIdObj = mongoose.Types.ObjectId(req.params.jobId);
    console.log(jobIdObj);

    Comment.find({ jobId: jobIdObj }).then(result => {
        console.log('Comment.find() results');
        //console.log(result);

        //returning the user names
        userId = [];
        result.forEach(r => userId.push(ObjectId(r.submittedBy)));

        User.find({_id: {$in: userId}}).then(userResults => {

            finalResult = result.map(elem => {
                //find the user from the User.find query search that matches the comment "submittedBy"
                tempUser = userResults.findIndex(obj => { return obj._id.toString() == elem.submittedBy.toString();})
                newName = userResults[tempUser].firstname + " " + userResults[tempUser].lastname;
            
                return elem.toClient(newName); // mongoose schema function to rename _id to id and add username
            });

            res.status(201).json({
                message: "All PrintQueueItems fetched successfully",
                comments: finalResult,
                ok: true
            });
        });

        console.log(result);
    })
})


module.exports = router;