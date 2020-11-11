const express = require("express");
const router = express.Router();

const checkAuth = require('../middleware/check-auth');

const EmailAccount = require("../models/email");
const EmailHistory = require("../models/emailHistory");

const DeptInfo = require("../models/deptInfo");
const DeptOperatingHours = require("../models/dept_operatingHours");
const DeptOverrideHours = require("../models/dept_operatingOverrides");

const helpers = require("../utils/helpers");

/*=======================================================================================
  ! BACKEND API ROUTES FOR /api/department/ 

  /api/department
  ------------------
  -- GET @ /api/department
    * Returns all departments
  -- POST @ /api/department
    * Creates a new department just needing the name
  -- PUT @ /api/department/:id
    * TEMP -- WILL REMOVE LATER
  -- PUT @ /api/department/deptname/:id
    * Updates the department name
  -- DELETE @ /api/department/:id
    * REMOVES the department


  

=======================================================================================*/







/* ^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v
  `GET @ /api/department/
    RETURNS
        DeptInfo[] -- All the current departments
^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v */
router.get("/", (req, res, next) => {
    console.log("\nGET @ /api/department");
    console.log("Returning all DeptInfo Records...");

    DeptInfo.find()
        .then(allDepts => {
            console.log("All DeptInfo Records:");
            console.log(allDepts);

            allDepts = allDepts.map(elem => {
                return elem.toClient();
            })
            
            let resMessage = {
                severity: 'success',
                summary: 'Success!',
                detail: 'Loaded all Department info successfully!'
            };

            res.status(200).json({
                message: resMessage,
                depts: allDepts
            })
        })
        .catch(err=> {
            console.log('!!! ERROR ON GET@/api/department');
            console.log(err);
        })
})

/* +++++++++++++++++++++++++++++++++++++++++++++++++
  * POST @ /api/department
  Create a new department entry
    -- Just takes the name and sets the currentOperatingSchedule to null, as no schedules exist yet
+++++++++++++++++++++++++++++++++++++++++++++++++ */
router.post("/", checkAuth, (req, res, next) => {
    console.log('\n');
    console.log("POST@/api/department ");
    console.log(req.body);

    const newDept = new DeptInfo({
        deptName: req.body.newDeptName,
        currentOperatingSchedule: null // when blank, there is nothing assigned
    });

    newDept.save()
        .then(result => {
            console.log('result on create new dept:');
            console.log(result);

            return res.status(200).json({
                newDept: result.toClient(),
                message: {
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Created new department successfully: _id:' + result._id +' !'
                }
            });
        })
        .catch(err => {
            console.log('!!! Error on create new dept');
            console.log(err);

            return res.status(200).json({
                message: {
                    severity: 'error',
                    summary: 'Failed!',
                    detail: err.message
                }
            })
        })
})

/* =+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
    ?PUT @ /api/department/:id
    Update the department name, buisnessHours, and overrrides
    expecting payload of DeptInfo entry
=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+*/
router.put("/:id", checkAuth, (req, res, next) => {
    console.log('\n');
    console.log("POST@/api/department/:id");
    console.log('Dept id to update: ' + req.params.id);
    console.log(req.body);
    
    // Make Update Request to MongoDB
    DeptInfo.findByIdAndUpdate(
        { _id: req.body.id },
        {
            deptName: req.body.deptName,
            buisnessHours: [
                {
                    dayOfWeek: 0,
                    openTime: req.body.buisnessHours[0].openTime,
                    closeTime: req.body.buisnessHours[0].closeTime,
                    isOpen: req.body.buisnessHours[0].isOpen
                },
                {
                    dayOfWeek: 1,
                    openTime: req.body.buisnessHours[1].openTime,
                    closeTime: req.body.buisnessHours[1].closeTime,
                    isOpen: req.body.buisnessHours[1].isOpen
                },
                {
                    dayOfWeek: 2,
                    openTime: req.body.buisnessHours[2].openTime,
                    closeTime: req.body.buisnessHours[2].closeTime,
                    isOpen: req.body.buisnessHours[2].isOpen
                },
                {
                    dayOfWeek: 3,
                    openTime: req.body.buisnessHours[3].openTime,
                    closeTime: req.body.buisnessHours[3].closeTime,
                    isOpen: req.body.buisnessHours[3].isOpen
                },
                {
                    dayOfWeek: 4,
                    openTime: req.body.buisnessHours[4].openTime,
                    closeTime: req.body.buisnessHours[4].closeTime,
                    isOpen: req.body.buisnessHours[4].isOpen
                },
                {
                    dayOfWeek: 5,
                    openTime: req.body.buisnessHours[5].openTime,
                    closeTime: req.body.buisnessHours[5].closeTime,
                    isOpen: req.body.buisnessHours[5].isOpen
                },
                {
                    dayOfWeek: 6,
                    openTime: req.body.buisnessHours[6].openTime,
                    closeTime: req.body.buisnessHours[6].closeTime,
                    isOpen: req.body.buisnessHours[6].isOpen
                },
            ]
        },
        { new: true})
        .then(results => {
            console.log('DeptInfo Successfully updated in db...');
            console.log(results);

            return res.status(200).json({
                updatedDept: results.toClient(),
                message: {
                    severity: 'success',
                    summary: 'Updated Dept Successfully!',
                    detail: 'stuff was successful todo'
                }
            });

        })
        .catch(err => {
            console.log('DeptInfo Update Failed:');
            console.log(err);
            return res.status(200).json({
                message: {
                    severity: 'error',
                    summary: 'Failed to update',
                    detail: err
                }
            });

        })
})

/* ==================================
    * PUT @ /api/department/deptname/:id
    Updates just the deptName for a dept entry
====================================*/
router.put("/deptname/:id", checkAuth, (req, res, next) => {
    console.log('\n PUT@/api/department/deptname/:id with :id' + req.params.id + 'and new name: ' + req.body.newDeptName );
    // console.log(req.body);

    DeptInfo.findOneAndUpdate( { _id: req.params.id }, { deptName: req.body.newDeptName }, { new: true })
    .then(result => {
        console.log('Successfully updated deptName...');
        console.log(result);
        // Send back the udpated entry
        // Send back successfull message
        return res.status(200).json({
            updatedDept: result.toClient(),
            message: {
                severity: 'success',
                summary: 'Department Name Updated!',
                detail: 'New Name: ' + result.deptName
            }
        });
    })
    .catch(err => {
        console.log('! ERROR on updating dept name...');
        console.log(err);

        // Send back failed message
        return res.status(200).json({
            message: {
                severity: 'error',
                summary: 'Updating Dept Name Not Successful',
                detail: err
            }
        });
    })

})

/* --------------------------------------------
    !DELETE @ /api/department/:id
    Deletes the matching DeptInfo if it exists
    req.params.id
--------------------------------------------*/
router.delete("/:id", checkAuth, (req, res, next) => {
    console.log('DELETE@/api/department/:id');
    console.log(req.params.id);

    // TODO send responses

    DeptInfo.findOneAndDelete( { _id: req.params.id })
        .then(result => {
            console.log('result from deleting DeptInfo:');
            console.log(result);

            if(result) {
                console.log('Delete was successful...')
                return res.status(200).json({
                    message: {
                        severity: 'success',
                        summary: 'Department Deleted Successfully!',
                        detail: 'id: ' + req.params.id
                    }
                });
            } else {
                console.log('delete was unsuccessful');

                return res.status(200).json({
                    message: {
                        severity: 'error',
                        summary: 'Delete Department unsuccessful!',
                        detail: 'Could not find DeptInfo with id: ' + req.params.id
                    }
                });
            }

            
        })
        .catch(err => {
            console.log('!!! ERROR from deleting DeptInfo');
            console.log(err);
            return res.status(200).json({
                message: {
                    severity: 'error',
                    summary: 'MongoDB findOneAndDelete() error:',
                    detail: err
                }
            });

        })
})






/* ================================================================================================================

MANAGE THE DEPARTMENT WEEKLY SCHEDULES

    -- Create New Schedule 
        POST @ /api/department/schedule/:id with body of new schedule
    -- Update Existing SChedule
        PUT @ /api/department/schedule/:id with body of new schedule

================================================================================================================ */

/* +++++++++++++++++++++++++++++++++++++++++++++++++
  * POST @ /api/department/schedule/:id
    Creates a new weekly schedule for the dept with :id
+++++++++++++++++++++++++++++++++++++++++++++++++ */
router.post("/schedule/:id", checkAuth, (req, res, next) => {
    console.log("\nPOST@/api/department/schedule/:id setting DeptOwner as  :id " + req.params.id);
    console.log(req.body);

    // Create a new DeptOperatingHours Mongoose Object
    // const newOpeartingHours = {
    const newOperatingHours = {
        deptOwner: req.params.id,
        scheduleName: req.body.scheduleIdentifier,
        buisnessHours: [
            {
                dayOfWeek: 0,
                openTime: req.body.buisnessHours[0].openTime,
                closeTime: req.body.buisnessHours[0].closeTime,
                isOpen: req.body.buisnessHours[0].isOpen
            },
            {
                dayOfWeek: 1,
                openTime: req.body.buisnessHours[1].openTime,
                closeTime: req.body.buisnessHours[1].closeTime,
                isOpen: req.body.buisnessHours[1].isOpen
            },
            {
                dayOfWeek: 2,
                openTime: req.body.buisnessHours[2].openTime,
                closeTime: req.body.buisnessHours[2].closeTime,
                isOpen: req.body.buisnessHours[2].isOpen
            },
            {
                dayOfWeek: 3,
                openTime: req.body.buisnessHours[3].openTime,
                closeTime: req.body.buisnessHours[3].closeTime,
                isOpen: req.body.buisnessHours[3].isOpen
            },
            {
                dayOfWeek: 4,
                openTime: req.body.buisnessHours[4].openTime,
                closeTime: req.body.buisnessHours[4].closeTime,
                isOpen: req.body.buisnessHours[4].isOpen
            },
            {
                dayOfWeek: 5,
                openTime: req.body.buisnessHours[5].openTime,
                closeTime: req.body.buisnessHours[5].closeTime,
                isOpen: req.body.buisnessHours[5].isOpen
            },
            {
                dayOfWeek: 6,
                openTime: req.body.buisnessHours[6].openTime,
                closeTime: req.body.buisnessHours[6].closeTime,
                isOpen: req.body.buisnessHours[6].isOpen
            }
        ]
    };

    console.log('Object saving to DeptOperatingHours DB:');
    console.log(newOperatingHours);
        
    DeptInfo.findByIdAndUpdate(
        { _id: req.params.id },
        { $push: { operatingHoursSchedules: newOperatingHours }},
        { new: true }
    )
    // newOperatingHours.save()
        .then(results => {
            console.log('successfully saved new schedule');
            console.log(results);

            // Add the new Schedule _id to the DeptInfo owner


            // SEND RESPONSE BACK TO  CLIENT
            return res.status(200).json({
                newDept: results.toClient(),
                message: {
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Created new Schedule successfully: _id:' + results._id +' !'
                }
            });
        })
        .catch(err => {
            console.log('\n ERROR non new DeptOpeartingHours save...');
            console.log(err);

            return res.status(200).json({
                message: {
                    severity: 'error',
                    summary: 'Failed to save schedule',
                    detail: err
                }
            });
        })


});

/* +++++++++++++++++++++++++++++++++++++++++++++++++
  * PUT @ /api/department/schedule/:id/:scheduleId
    Updates existing schedule with body element
        -- UPDATES the name, and all of the buissness hours entries with form submission
+++++++++++++++++++++++++++++++++++++++++++++++++ */
router.put("/schedule/:id/:scheduleId", checkAuth, (req, res, next) => {
    // TODO make this update the weekly schedule with id of :scheduleId under dept with :id
    console.log('\n PUT@/api/department/schedule/:id/:scheduleId');
    console.log(req.params);
    console.log(req.params.id);
    console.log(req.params.scheduleId);
    console.log(req.body);

    DeptInfo.findOneAndUpdate( { _id: req.params.id, "operatingHoursSchedules._id": req.params.scheduleId },
        { $set: {
            "operatingHoursSchedules.$.scheduleName": req.body.scheduleName,
            "operatingHoursSchedules.$.buisnessHours": req.body.buisnessHours           
            }
        },
        { new: true }
    )
    .then(department => {
        console.log('Department Schedule updated successfully:');
        console.log(department);
        
        return res.status(200).json({
            newDept: department.toClient(),
            message: {
                severity: 'success',
                summary: 'Successful!',
                detail: 'Updated department weekly schedule successful'
            }
        });

    })
    .catch(err => {
        console.log(err);
        return res.status(200).json({
            message: {
                severity: 'error',
                summary: 'Error!',
                detail: err
            }
        });
    })
})

/* +++++++++++++++++++++++++++++++++++++++++++++++++
  ! DELETE @ /api/department/schedule/:id/:scheduleId
    Deletes schedule under dept with :id and schedule :scheduleId
+++++++++++++++++++++++++++++++++++++++++++++++++ */
router.delete("/schedule/:id/:scheduleId", checkAuth, (req, res, next) => {
    console.log('\n DELETE@/api/department/schedule/:id/:scheduleId with :id ' + req.params.id + ' and :scheduleId ' + req.params.scheduleId);

    // Delete schedule Item
    // MAKE SURE THAT THE DELETED SCHEDULE IS NOT THE CURRENT ONE OF THE DEPARTMENT

    DeptInfo.findOne( { _id: req.params.id })
    .then(department => {
        console.log(department);
        // Make sure the department.currentOperatingSchedule != to the req.params.scheduleId
        console.log(department.currentOperatingSchedule);
        console.log(req.params.scheduleId);

        if (department.currentOperatingSchedule == req.params.scheduleId ){
            console.log('!!! Cant delete this schedule as it is currently the active schedule for the department....');

            return res.status(200).json({
                message: {
                    severity: 'error',
                    summary: 'Error!',
                    detail: "Can not delete schedules that are currently active!"
                }
            });
        } else {
            console.log('Desired weekly schedule to delete is not the active schedule... removing...');

            DeptInfo.findOneAndUpdate(
                { _id: req.params.id},
                { $pull: { operatingHoursSchedules: { _id: req.params.scheduleId} }},
                { new: true })
            .then(result => {
                console.log('Result from removing operatingHours Schedule...');
                console.log(result);

                return res.status(200).json({
                    updatedDept: result.toClient(),
                    message: {
                        severity: 'success',
                        summary: 'Removed Schedule Successfully!',
                        detail: 'weekly operating hours schedule removed successfully.'
                    }
                });

            })
            .catch(err => {
                // Error on removing the 
                console.log('Error on removing operatingHoursSchedule...');
                console.log(err);
                return res.status(200).json({
                    message: {
                        severity: 'error',
                        summary: 'Error on delete weekly schedule',
                        detail: err
                    }
                });
            })

        }


        // WTF WHY ISNT THIS WORKING?



    })
    .catch(err => {
        console.log('!! Error on finding department with the requested ID...');
        console.log(err);

        return res.status(200).json({
            message: {
                severity: 'error',
                summary: 'Error on delete weekly schedule',
                detail: err
            }
        });

    })

})


/* +++++++++++++++++++++++++++++++++++++++++++++++++
  * GET @ /api/department/schedule/active/:id/:activeId
    
    Sets the currentOperatingSchedule for :id to :activeId
+++++++++++++++++++++++++++++++++++++++++++++++++ */
router.get("/schedule/active/:id/:activeId", checkAuth, (req, res, next) => {
    console.log("\nPOST@/api/department/schedule/active/:id/:activeId");

    DeptInfo.findByIdAndUpdate(
        { _id: req.params.id },
        { currentOperatingSchedule: req.params.activeId },
        { new: true } // returns the new document
    )
    .then(result => {
        console.log('Results: ');
        console.log(result);

        return res.status(200).json({
            updatedDept: result.toClient(),
            message: {
                severity: 'success',
                summary: 'Updated current schedule successfully!',
                detail: 'Active operating hours schedule updated'
            }
        });
    })
    .catch(err => {
        console.log("Error!");
        console.log(err);

        return res.status(200).json({
            message: {
                severity: 'error',
                summary: 'Error on updating active schedule for department....',
                detail: err
            }
        });
    })
})


/* ========================================================================================================
______       _                          _   _                  _____                     _     _      
| ___ \     (_)                        | | | |                |  _  |                   (_)   | |     
| |_/ /_   _ _ ___ _ __   ___  ___ ___ | |_| | ___  _   _ _ __| | | |_   _____ _ __ _ __ _  __| | ___ 
| ___ \ | | | / __| '_ \ / _ \/ __/ __||  _  |/ _ \| | | | '__| | | \ \ / / _ \ '__| '__| |/ _` |/ _ \
| |_/ / |_| | \__ \ | | |  __/\__ \__ \| | | | (_) | |_| | |  \ \_/ /\ V /  __/ |  | |  | | (_| |  __/
\____/ \__,_|_|___/_| |_|\___||___/___/\_| |_/\___/ \__,_|_|   \___/  \_/ \___|_|  |_|  |_|\__,_|\___|

    BUISNESS HOUR OVERRIDE

======================================================================================================== */

/* +++++++++++++++++++++++++++++++++++++++++++++++++
  * POST @ /api/department/overrideRule/:id
  Create a new BuisnessOverrideRule
+++++++++++++++++++++++++++++++++++++++++++++++++ */
router.post("/overrideRule/:id", checkAuth, (req, res, next) => {
    console.log('\nPOST@/api/department/overrideRule/:id');
    console.log(req.params.id);
    
    const newOverride = {
        overrideReason: req.body.overrideReason,
        overrideStartDate: req.body.overrideStartDate,
        overrideEndDate: req.body.overrideEndDate,
        dayOfWeek: req.body.dayOfWeek,
        altOpenTime: req.body.altOpenTime,
        altCloseTime: req.body.altCloseTime,
        isOpen: req.body.isOpen
    }

    console.log(newOverride);

    DeptInfo.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { "operatingHoursOverrides": newOverride} },
        // { $set: { "$.buisnessHoursOverrides" : newOverride }},
        { new: true})
        .then(result => {
            console.log('return from new override rule update')
            console.log(result);

            return res.status(200).json({
                updatedDept: result.toClient(),
                message: {
                    severity: 'success',
                    summary: 'Updated Override Rules',
                    detail: 'Added new override rule to department successfully'
                }
            });
        })
        .catch(err => {
            console.log('!!! Error on override find one and update');
            console.log(err);
            return res.status(200).json({
                message: {
                    severity: 'error',
                    summary: 'Adding Override rule failed',
                    detail: err
                }
            });
        })

    // Update the DeptInfo with id passed 
    // Adding a new BuisnessHoursOverride Rule
})

/* =+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
    ?PUT @ /api/department/overrideRule/:id
    Update an existing BuisnessOverrideRule entry
    expecting payload of DeptInfo entry
=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+*/
router.put("/overrideRule/:id/:overrideRuleId", checkAuth, (req, res, next) => {
    console.log('\n PUT@/api/department/overrideRule/:id/:overrideRuleId');
    console.log('Department ID: ' + req.params.id);
    console.log('Update OverrideRule ID: ' + req.params.overrideRuleId);
    console.log('Object updating the hours override rule: ');
    console.log(req.body);


    
    DeptInfo.findOneAndUpdate(
        { _id: req.params.id, "operatingHoursOverrides._id": req.params.overrideRuleId },
        { $set: {
            "operatingHoursOverrides.$.overrideReason": req.body.overrideReason,
            "operatingHoursOverrides.$.overrideStartDate": req.body.overrideStartDate,
            "operatingHoursOverrides.$.overrideEndDate": req.body.overrideEndDate,
            "operatingHoursOverrides.$.dayOfWeek": req.body.dayOfWeek,
            "operatingHoursOverrides.$.altOpenTime": req.body.altOpenTime,
            "operatingHoursOverrides.$.altCloseTime": req.body.altCloseTime,
            "operatingHoursOverrides.$.isOpen": req.body.isOpen
            }
        },
        { new: true})
        .then(result => {
            console.log('return from new override rule update')
            console.log(result);

            return res.status(200).json({
                updatedDept: result.toClient(),
                message: {
                    severity: 'success',
                    summary: 'Updated Override Rules',
                    detail: 'Updated rule to department successfully'
                }
            });
        })
        .catch(err => {
            console.log('!!! Error on override find one and update');
            console.log(err);
            return res.status(200).json({
                message: {
                    severity: 'error',
                    summary: 'Adding Override rule failed',
                    detail: err
                }
            });
        })

    // Update the DeptInfo with id passed 
    // Adding a new BuisnessHoursOverride Rule
});

/* --------------------------------------------
    !DELETE @ /api/department/:id
    Deletes the matching DeptInfo if it exists
    req.params.id
--------------------------------------------*/
router.delete("/overrideRule/:id/:ruleId", checkAuth, (req, res, next) => {
    console.log('DELETE@/api/department/overrideRule/:id/:ruleId');
    console.log(req.params.id);
    console.log(req.params.ruleId);

    // Find one and delete from deptInfo.buisnessHoursOverride
    DeptInfo.findOneAndUpdate(
        { _id: req.params.id },
        { $pull: { buisnessHoursOverrides: { _id: req.params.ruleId }}},
        { new: true}
    )
        .then(result => {
            console.log('result from delete on overriderule:');
            console.log(result);

            return res.status(200).json({
                updatedDept: result.toClient(),
                message: {
                    severity: 'success',
                    summary: 'Deleted Successfully!',
                    detail: 'Override deleted from department'
                }
            });

        })
        .catch(err => {
            console.log(err);
        })
})

/*
overrideReason: { type: String, required: true},
        overrideStartDate: { type: Date, required: true },
        overrideEndDate: { type: Date, required: true },
        dayOfWeek: { type: Number, required: true },
        altOpenTime: { type: Date },
        altCloseTime: { type: Date },
        isOpen: { type: Boolean, required: true }

*/




/*
    MANAGING BUISNESS HOUR OVERRIDES
*/
router.post("/createHoursOverrideRule", checkAuth, (req, res, next) => {
    console.log('\n POST@/api/depts/createHoursOverrideRule');
    console.log(req.body);
    // TODO get the id for 

    let newOverride = {
        overrideReason: req.body.overrideReason,
        overrideStartDate: req.body.overrideStartDate,
        overrideEndDate: req.body.overrideEndDate,
        dayOfWeek: req.body.dayOfWeek,
        altOpenTime: req.body.altOpenTime,
        altCloseTime: req.body.altCloseTime,
        isOpen: req.body.isOpen
    }


    DeptInfo.findOneAndUpdate(
        { _id: req.body.deptInfoIdToUpdate},
        { $push: { buisnessHoursOverrides: newOverride }}
        )
        .then(results => {
            console.log('After findOneAndUpdate to add new override rule...');
            console.log(results);
            
            // TODO send response to client
        })
        .catch(err => {
            console.log('!! ERROR on adding a new override rule to DeptInfo..');
            console.log(err);
        })
})








/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  GET @ /api/depts/removeDummyDept
    WILL REMOVE THE DUMMY DEPT FOR TESTING
    RETURN
        MESSAGE OF SUCCESS/ERROR
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= */
router.get("/removeDummyDept", (req, res, next) => {
    console.log("GET@/api/depts/removeDummyDept");
    DeptInfo.findOneAndDelete({deptName: "dummy serverside dept"})
        .then(results => {
            console.log("Removed dummy dept successfully");
            console.log(results)
            return res.status(200).json({
                message: "Removed dummy dept successfully"
            })
        })
        .catch(err => {
            console.log("Error removing dummy dept");
            console.log(err);
        })
})
/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  GET @ /api/depts/createDummyDept
    CREATES THE DUMMY DEPT FOR TESTING
    RETURN
        MESSAGE OF SUCCESS/ERROR
  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= */
router.get("/createDummyDept", (req,res,next) => {
    console.log("GET@/api/depts/createDummyDept");
    
    let openDate = new Date();
    // wait for a second to get different close/open dates
    let closeDate = new Date();
    closeDate.setTime(closeDate.getTime() + 1 * 86400000);

    const newDept = new DeptInfo({
        deptName: "dummy serverside dept",
        currentOperatingSchedule: "NONE"
    });

    newDept.save()
        .then(results => {
            console.log("CREATED DUMMY DEPT SUCCESSFULLY!");
            console.log(results);

            res.status(200).json({
                message: 'successfully created dummy dept'
            });
        })
        .catch(err => {
            console.log("Error on Creating dummy dept");
            console.log(err);
        })
})


/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  POST @ /api/depts/updateDept
    req.params.id -- id of db item to update
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= */
router.post("/updateDept/:id", checkAuth, (req, res, next) => {
    
})



/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    Creates a baisc DeptInfo with just the deptName
  POST @ /api/depts/
    Payload: {
      deptName: string
    }
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= */
router.post("/createDept", checkAuth, (req, res, next) => {


}); // End of router.post "/createAccount"


















// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// PUT @ /api/email/:id + password
//    Update the password for the alert email account
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
router.put("/:id", checkAuth, (req, res, next) => {
    // update email account with id --> id with the req.body.password
    console.log("PUT @ /api/email/:id");
    console.log("Updating with password");
    console.log(req.body.password);

    EmailAccount.findOneAndUpdate({ _id: req.params.id}, { password: req.body.password })
        .then(result => {
            console.log(result);
            if(result.n == 0) {
                console.log("No Update to email account");
                return res.status(401).json({ message: "Sysadmin Email not Updated!"});
            } else {
                console.log('update emailAccount successful');
                return res.status(200).json({
                   severity: 'success',
                   summary: 'Success!',
                   detail: 'Alert Email Account Password Updated Successfully'
                });
            }
        })
});


// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// PUT @ /api/email/alert/:id + password
//    Update the email for the SysAdmin Alert Email
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
router.put("/alert/:id", checkAuth, (req, res, next) => {
    // Update the sysadmin email with passed email

    console.log("PUT @ /api/email/alert/:id");
    console.log("Updating sysadmin with email:");
    console.log(req.body.email);


    EmailAccount.findOneAndUpdate( { _id: req.params.id }, { email: req.body.email })
        .then(result => {
            console.log(result);
            if(result.n == 0) {
                console.log("No Update to sysadmin alert email account");
                return res.status(200).json({
                    severity: 'error',
                    summary: 'Wait!',
                    detail: 'No Change Occured to System Admin Email Address'
                 });
            } else {
                console.log('update emailAccount successful');
                let detailMsg = "Update SysAdmin Account id '"+req.params.id+"' to email: '" + req.body.email + "' Successful!";
                return res.status(200).json({
                    severity: 'success',
                    summary: 'Success!',
                    detail: detailMsg
                 });
            }
        });
});


// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// DELETE @ /api/email/:id
//      req.body will hold the EmailAccount info
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
router.delete("/:id", checkAuth, (req, res, next) => {
    console.log("DELETE @ /api/email");
    console.log(req.params.id);

    EmailAccount.findOneAndDelete({ _id: req.params.id})
        .then(result => {
            console.log("Delete Account Details");
            console.log(result);

            if(!result) {
                console.log("find and delete email account failed");
                return res.status(200).json({
                    severity: 'error',
                    summary: 'Error!',
                    detail: 'Delete Email FAILED!'
                 });
            } else {
                console.log("delete eamil account successful!");
                return res.status(200).json({
                    severity: 'warn',
                    summary: 'Success!',
                    detail: 'Deleted Email Account From DB Successfully!'
                 });
            }
        })
});


// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// POST @ /api/email/sendemail/
//      Will use the system alert email account
//      Email body, recipients, will be within the body of the req
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
router.post("/sendemail", checkAuth, (req, res, next) => {


    console.log("\nPOST @ /api/email/sendemail");



    // Get alertAdmin email account
    EmailAccount.findOne( { type: 'alertadmin' } )
        .then(result => {
            console.log("Result from getting sys app email: ");
            console.log(result);

            if(!result) {
                // the result is null
                return res.status(200).json({
                    severity: 'warn',
                    summary: 'Failed!',
                    detail: 'Transporter email account failed Authentication, Make sure a valid System Alert Email Address Exists'
                 });
            }
            // TODO make the service custom to the email that is in the db
            // do some splitting

            // Getting the 'service' programatically
            let fullEmail = result.email;
            fullEmail = fullEmail.split('@');
            fullEmail = fullEmail[1].split('.');
            let service = fullEmail[0];
            // Not using this right now as I was trouble shooting the email server


            // Create the transport object
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                auth: {
                    user: result.email,
                    pass: result.password
                }
            });

            var mailOptions = {
                from: result.email,
                to: req.body.toEmail,
                subject: req.body.subject,
                html: req.body.body
            };

            console.log("Email attempting to be sent....");
            console.log(mailOptions);
            transporter.sendMail(mailOptions, function(error, info) {
                if(error) {
                    console.log("\n#@$#@#$ Sending Error Response to the srvv (401 error)");
                    console.log(error.response);

                    // Save This Email to the EmailHistoryDB
                    // helpers.saveEmailHistoryItem( mailOptions, error.response);



                    transporter.close();
                    if ("Username and Password not accepted." in error) {
                        return res.status(200).json({
                            severity: 'error',
                            summary: 'Error!',
                            detail: 'Username and Password not accpeted'
                         });
                    }
                    return res.status(200).json({
                        severity: 'error',
                        summary: 'Error!',
                        detail: error.response
                     });

                } else {
                    console.log("!!!Email was sent successfully: " + info.response);
                    // helpers.saveEmailHistoryItem( mailOptions, info.response);
                    console.log("\tattempting to save the email history item...");

                    helpers.saveEmailHistoryItem(mailOptions, info.response, function(err, historySavedStatus) {

                      if(err) {
                        console.log("Error with saving history item...");
                        return res.status(200).json({
                          severity: 'error',
                          summary: 'Email API Server',
                          detail: 'Error... :'
                       });

                      }

                      console.log("Response from saving email history item in email.js:");
                      console.log(historySavedStatus);

                      transporter.close();

                      return res.status(200).json({
                        severity: 'success',
                        summary: 'Success!',
                        detail: 'Email sent to ' + mailOptions.to + ' with returnCode: ' + historySavedStatus.rc,
                        emailHistory: historySavedStatus
                     });

                    })





                }
            })


        });

})

module.exports = router;
