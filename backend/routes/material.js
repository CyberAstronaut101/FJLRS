const express = require("express");
const Material = require("../models/materials");

const News = require("../models/news");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

/* +++++++++++++++++++++++++++++++++++++++++++++++++

  * POST @ /api/material
  Create a new material entry

+++++++++++++++++++++++++++++++++++++++++++++++++ */
router.post("", checkAuth, (req, res, next) => {
    console.log("\nPOST @ /api/material");

    console.log(req.body);
    const newMaterial = new Material({
        materialName: req.body.materialName,
        materialPrice: req.body.materialPrice,
        materialType: req.body.materialType
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



/* --------------------------------------------
    !DELETE @ /api/news/:id
    Deletes the matching news article if found
    req.params.id
--------------------------------------------*/
router.delete("/:id", checkAuth, (req, res, next) => {
    console.log('\nDELETE @ /api/material/:id');
    console.log(req.params.id);

    Material.findOneAndDelete({ _id: req.params.id})
        .then(result => {
            console.log("Deleting Material...");
            console.log(result);
            return res.status(200); 
    });
})


module.exports = router;