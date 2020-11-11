const express = require('express');
const User = require("../models/user");


/*================================
    Update training levels for user

TODO this entire routing can be overhauled, this was started on but never fully implemented.
______ _____ _____ _____            ___________ _   _ _____   _     _   _ _
| ___ \  _  /  ___|_   _|          |_   _| ___ \ \ | |  __ \ | |   | | | | |
| |_/ / | | \ `--.  | |    ______    | | | |_/ /  \| | |  \/ | |   | | | | |
|  __/| | | |`--. \ | |   |______|   | | |    /| . ` | | __  | |   | | | | |
| |   \ \_/ /\__/ / | |              | | | |\ \| |\  | |_\ \ | |___\ \_/ / |____
\_|    \___/\____/  \_/              \_/ \_| \_\_| \_/\____/ \_____/\___/\_____/




    POST @ /api/training/
    ================================*/
    router.post("/updateUserTraining", checkAuth, (req, res, next) => {
        console.log("\n\nPOST @ /api/user/updateUser");
        console.log(req.body);
    
    
        User.findOneAndUpdate(
            { _id: req.body.userId },
            {
                laserLab01: req.body.laserLab01,
                laserLab02: req.body.laserLab02,
                woodShop01: req.body.woodShop01,
                woodShop02: req.body.woodShop02,
                woodShop03: req.body.woodShop03,
                plotters: req.body.plotters,
                projectors: req.body.projectors
            },
            { new: true }
        )
            .then(result => {
                console.log("\nResult from updating User training levels mongod:");
                console.log(result);
    
                console.log("!!! returning status of 200 to client");
                return res.status(200).json({ message: "Successfully updated user training levels!" });
            })
            .catch(err => {
                console.log("Error on updating user training levels in mongoDB");
                console.log(err);
            })
    })



module.exports = router;
