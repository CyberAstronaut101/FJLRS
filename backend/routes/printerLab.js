const express = require("express");

const News = require("../models/news");
const checkAuth = require("../middleware/check-auth");

const PrinterDepartment = require("../models/dept_3dprinters");
const DeptInfo = require("../models/deptInfo");

const router = express.Router();


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


module.exports = router;