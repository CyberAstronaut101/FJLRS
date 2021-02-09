const express = require("express");

const Printer = require("../models/printer");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

//get printer
//with checkAuth: router.get("", checkAuth, (req, res, next) => {
router.get("", (req, res, next) => {
    console.log('GET @ /api/printer');
    console.log('returning list of all printers');

    Printer.find().then(result => {
        console.log('Printer.find() results');
        console.log(result);

        result = result.map(elem => {
            return elem.toClient(); // mongoose schema function to rename _id to id
        });


        console.log(result);

        res.status(201).json({
            message: "All Printers fetched successfully",
            printers: result
        });
    })
})

router.post("/add", (req, res, next) => {
    // create new user and store to database

    console.log("create printer data");
    console.log(req.body);


    const printer = new Printer({
        name: req.body.name,
        type: req.body.type,
        octopiUrl: req.body.octopiUrl
    });
    console.log("printer being saved to db");
    console.log(printer);
    printer.save()
        .then(result => {
            console.log("created new printer successfully");
            res.status(201).json({
                message: "Printer Created Successfull!",
                result: result
            });
        })
        .catch(err => {
            console.log("new printer create failed");
        });
})

router.delete("/:name", checkAuth, (req, res, next) => {
    console.log('\nDELETE @ /api/news/:name');
    console.log(req.params.name);

    Printer.findOneAndDelete({ name: req.params.name})
        .then(result => {
            console.log("within delete printer ");
            console.log(result);
            if(!result) {
                console.log("find and delete failed");
                return res.status(401).json({message: 'user not owner of todo!'});
            } else {
                console.log("todo delete successful");
                return res.status(200).json({message: 'user not owner of todo!'});
            }
        
    });
})

module.exports = router;