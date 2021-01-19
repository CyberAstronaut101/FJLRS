const express = require("express");

const News = require("../models/news");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

/* +++++++++++++++++++++++++++++++++++++++++++++++++

  * POST @ /api/material
  Create a new material entry

+++++++++++++++++++++++++++++++++++++++++++++++++ */
router.post("", checkAuth, (req, res, next) => {
    console.log("\nPOST @ /api/material");

    const newMaterial = new Material({
        title: req.body.title,
        content: req.body.content,
        postedDate: req.body.postedDate
    });

    newMaterial.save().then(createdMaterial => {
        console.log("Saved Material Entry to DB: ");
        console.log(createdMaterial);
        res.status(200).json({
            message: 'Material Entry added successfully!',
            newsId: createdMaterial._id
        });
    });

});

/* ^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v

  `GET @ /api/department/
    RETURNS
        all the current Material Entries

^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v */
router.get("", (req,res, next) => {
    console.log('\nGET @ /api/material');

    Material.find()
        .then(documents => {
            console.log(documents);

            res.status(200).json({
                message: 'All Material Entries fetched successfully',
                Materials: documents
            });
        });
});

/* =+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
    ?PUT @ /api/news/:id
        
    Updates a news article
=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+*/
router.put("/:id", checkAuth, (req, res, next) => {

    console.log('\nPUT @ /api/news/:id');
    console.log(req.params.id);
    console.log(req.body);
    // !!TODO make this keep the postedDate and updatedDate seperate



    const updateNews = new News({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        postedDate: req.body.postedDate
    })

    News.updateOne({ _id: req.params.id}, updateNews).then(result => {
        console.log(result);
        if(result.n == 0) {
            console.log("no UpDaTe occured!");
            return res.status(401).json({ message: "User not authorized to edit News!"});
        } else {
            console.log('update todo successful');
            return res.status(200).json({ message: "Update Successful!"});
        }
    })
});


/* --------------------------------------------
    !DELETE @ /api/news/:id
    Deletes the matching news article if found
    req.params.id
--------------------------------------------*/
router.delete("/:id", checkAuth, (req, res, next) => {
    console.log('\nDELETE @ /api/news/:id');
    console.log(req.params.id);

    News.findOneAndDelete({ _id: req.params.id})
        .then(result => {
            console.log("within delete news ");
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