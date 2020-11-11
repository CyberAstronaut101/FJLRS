const express = require("express");
const router = express.Router();

const checkAuth = require('../middleware/check-auth');

// printerId: { type: String, required: true },            // Machine id that the job belongs to
// jobName: {type: String, required: true, unique: true },  // Individual Job Names 
// jobOwner: { type: String, required: true },              // ID of the person who created this
// timeStarted: { type: Date, required: true },            // Date of when job started
// printHours: { type: Number, required: true },
// printMinutes: { type: Number, required: true}        // Actual print length for any calculations with date
// });
/*============================================

============================================*/

const printQueue = require("../models/printerQueue");

/*
interface {
    id: string
    machineName: string,
    currentJobId: string,
}
*/
const printerMachine = require("../models/printerMachine");

/*
printerHistory = {
    machineName: string,
    machineId: string,
    printQueueItem: printerQueue
}
*/
const printHistory = require("../models/printerHistory");

const User = require("../models/user");

/*
______ __________________________  ________  _____________________
|  __ \|  ___|_   _|_   _|_   _| \ | |  __ \ |  _  \/ _ \_   _/ _ \ 
| |  \/| |__   | |   | |   | | |  \| | |  \/ | | | / /_\ \| |/ /_\ \
| | __ |  __|  | |   | |   | | | . ` | | __  | | | |  _  || ||  _  |
| |_\ \| |___  | |   | |  _| |_| |\  | |_\ \ | |/ /| | | || || | | |
 \____/\____/  \_/   \_/  \___/\_| \_/\____/ |___/ \_| |_/\_/\_| |_/

 All Routes Dealing with Returning Users, PrintQueueItems, and PrinterMachines to the webapp

*/

/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    GET @ /api/printerQueue/

    Returns the current jobs and the queue jobs on request

    GETS ALL THE DATA NEEDED FOR THE printering-queue.service

    return interface {
        severity: null,
        summary: null,
        detail: null,
        machineList: [],
        printQueueList: [],
        relaventUsersList: []
    }

    UPDATE
    now added history db, before sending back the printQueueList first filter and make sure
    that only the printQueueItems that are not in history are sent to the client to render 
    
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/ 
router.get("", (req,res,next) => {
    console.log("\n ############### GET@/api/printerQueue #############");

    let resObject = {
        severity: null,
        summary: null,
        detail: null,
        machineList: [],
        printQueueList: [],
        relaventUsersList: []
    }


    /*
        Request Data Flow

        1. Query and get all printQueue Items
            \-- Use queue items and filter out ones that exist in printHistory
        2. Query printHistory
            \-- Get actual active printQueueItems

    
        

    */

/*
    FIRST QUERY -- PRINTER QUEUE ITEMS
*/
   printQueue.find()
    .then(printQueueDocuments => {
        console.log("\t#### printQueue get items ####");
        // push and fill the return data array
        if(!printQueueDocuments) {
            console.log('!@#!@# --> printQueueDocuments is undefined!');
        }
        let printQueueReturnData = [];
        // Clean up the _id --> id
        printQueueDocuments.forEach( document => {
            let newPrintQueue = {
                id: document._id,
                printerId: document.printerId,
                jobName: document.jobName,
                jobOwner: document.jobOwner,
                timeStarted: document.timeStarted,
                printHours: document.printHours,
                printMinutes: document.printMinutes

            }
            printQueueReturnData.push(newPrintQueue);
        })
        console.log("***************** ALL PRINT QUEUE ITEMS ***************** ");
        console.log(printQueueReturnData);

        // Trim out the jobs that are already finished!
        let trimmedReturnPrintQueue = [];
        // Look at the printHistory and only allow jobs that do not exist there
        printHistory.find()
            .then(printHistoryElements =>{

                console.log("****************** ALL printHistoryElements ***************** ");
                // console.log(printHistoryElements);


                printQueueReturnData.forEach( printQueueItem => {
                    // this will be true if and only if the printQueueItem doesnt show up for any of the 
                    let addToClientReturn = true;

                    printHistoryElements.forEach( historyElem => {
                        // console.log("Checking id: " + printQueueItem.id + " against " + historyElem.printQueueItem);
                        // console.log(historyElem.printQueueItem.toString() === printQueueItem.id.toString());
                        // console.log(typeof(printQueueItem.id.toString()));
                        // console.log(typeof(historyElem.printQueueItem));

                        if( historyElem.printQueueItem.toString() === printQueueItem.id.toString() ) {
                            // the printQueueItem is in the hisyory
                            // dont push to array
                            console.log("\nprintQueueItem is in the historyDB, not adding to printQueue for client!");
                            addToClientReturn = false;
                        }
                    });

                    if(addToClientReturn) {
                        console.log("printQueueItem is NOT in historyDB, ADDING to trimmedReturnPrintQueue");
                        trimmedReturnPrintQueue.push(printQueueItem);
                    }

                })


                // Now we have a 'valid' printQueueList, make an array of the UID and then query the userDB for the relavent users
                console.log("All Queue Items NOT in the Hisyory DB: ");
                console.log(trimmedReturnPrintQueue);
                resObject.printQueueList = trimmedReturnPrintQueue;
        
                // Get the relavent users
                let relaventUsers = [];
                // search all queue items, push the user id to the relavnet Users list
                trimmedReturnPrintQueue.forEach(queueItem => relaventUsers.push(queueItem.jobOwner) );
        
                console.log("** Using this list for User Query: ");
                console.log(relaventUsers);
                
                
                // Query the users to get the relavent users
                User.find({
                        '_id': {$in: relaventUsers}
                    })
                    .then(documents => {
                        console.log("------ Relavent Users Data Return to Clienct ------");
                        console.log(documents);
        
                        // List of all the users, set to the 
                        let returnSanatizedUsers = [];
        
                        documents.forEach( document => {
                            let sanatizedUser = {
                                id: document._id,
                                firstname: document.firstname,
                                lastname: document.lastname,
                                email: document.email
                            }
                            returnSanatizedUsers.push(sanatizedUser);
                        });
        
                        console.log("### Returning to sanatized users to request: ");
                        console.log(returnSanatizedUsers);
        
                        resObject.relaventUsersList = returnSanatizedUsers;
        
                        // Get the Printer Machine Data
        
                        /*
                            THIRD QUERY -- ALL PRINTER MACHINES
                        */
                        printerMachine.find()
                            .then(printerMachineDocuments => {
                                console.log("----- All Printer Machines -----");
                                let returnPrinterMachines = [];
                                printerMachineDocuments.forEach( document => {
                                    let newMachine = {
                                        id: document._id,
                                        machineName: document.machineName,
                                        currentJobId: document.currentJobId
                                    }
        
                                    returnPrinterMachines.push(newMachine);
                                });
                                console.log(returnPrinterMachines);
        
                                resObject.machineList = returnPrinterMachines;
        
                                // Construct and return the resObject Here
                                console.log("#################### END OF INITIAL DATA LOAD SERVER SIDE ##############")
                                console.log("\n*** RETURN OBJECT TO INITIAL DATA LOAD ***");
                                resObject.severity = "success";
                                resObject.summary = "Inital Data Grab Successful.";
                                resObject.detail = "Machines, Users, and Print Queue recieved from API server successfully.";
        
                                console.log(resObject);
                                console.log("#################### END OF INITIAL DATA LOAD SERVER SIDE ##############\n\n");
                                return res.status(200).json(resObject);
                                
                            })
        
        
        
        
                        // sanatize these documents
                        
                        
                    })
                    .catch(err => {
                        console.log("Error from searching for all users relavent to the printer Queue");
                        console.log(err);
                    });


            });
        // after the printHistory.find()

        
        

    }) // end of first query

    
    
});



/*============================================
    GET @ /api/printerQueue/machineManagement


    Inital call from the printing-studio machine management page

    1. get all the printer machines
    2. get all the print queue items for those machines
    3. filter out the queue items based on the history items
    3. Get all the relavent users too

============================================*/
router.get("/machineManagementLoad", (req, res, next) => {
    
    console.log("\n\nGET @ /api/printerQueue/machineManagement");
    console.log("Loading all machines and their history items");
    /*
        machineHistoryObject {
            machineId: string,
            machineName: string,
            currentJobId: string,
            history: [{
                jobName: string,
                timeStarted: string/date,
                printHours: number,
                printMinutes: number,
                jobOwner: number, // id
                firstName: string,
                lastName: string
            }]
        }
    */
    let resObject = {
        serverMessage: {
            severity: undefined,
            summary: undefined,
            detail: undefined
        },
        machineList: [],
        machineHistoryObjects: []

    }
    // Query for all the printerMachines
    printerMachine.find()
        .then(printerMachines => {
            console.log("Retrieved printer machines: ");

            // Machines for use at end of all calls
            var relaventMachines = printerMachines;
            console.log(relaventMachines);

            let printHistoryQuery = [];
            relaventMachines.forEach(qi => printHistoryQuery.push(qi._id));
            console.log("Querying the history db for printers with _id's -- > ");
            console.log(printHistoryQuery);

            printHistory.find({
                'machineId': { $in:printHistoryQuery}
            }).then(historyItems => {
                console.log("History entries for the current machines: ");
                console.log(historyItems);

                var relaventHistoryItems = historyItems;
                
                // Make query list for the actual job entries
                let printerJobsQuery = []
                relaventHistoryItems.forEach(rm => printerJobsQuery.push(rm.printQueueItem));
                console.log("Querying the printQueue db for the jobs in the history --> ");
                console.log(printerJobsQuery);

                printQueue.find({
                    '_id': {$in: printerJobsQuery }
                }).then(printerJobs => {
                    console.log("Relavent Print Queue Items: ");
                    console.log(printerJobs);

                    var relaventPrinterJobs = printerJobs;

                    // Make the list to query the relavent users
                    let relaventUsersQuery = [];
                    relaventPrinterJobs.forEach(job => relaventUsersQuery.push(job.jobOwner));
                    console.log("Query --> Users for owners of the printQueue jobs -->");
                    console.log(relaventUsersQuery);

                    User.find({
                        '_id': { $in: relaventUsersQuery}
                    }).then(relUsers => {
                        // console.log("Relavent Users:");
                        // console.log(relUsers);
                        
                        var relaventUsers = relUsers;

                        console.log("\n\n++++ all the data collected ++++");
                        console.log(relaventMachines);
                        console.log(relaventHistoryItems);
                        console.log(relaventPrinterJobs);
                        console.log(relaventUsers);
                        console.log('\n\n\n');

                        // Add the machineList to the resObject
                        relaventMachines.forEach(document => {
                            let sanatizedMachine = {
                                id: document._id,
                                machineName: document.machineName,
                                currenJobId: document.currentJobId
                            }
                            resObject.machineList.push(sanatizedMachine);
                        });
                        
                        // Iterate over machines and build the machineHistoryObjects
                        for(let i = 0; i < relaventMachines.length; i++) {
                            // Go through each machine
                            let currMachineHistObject = {
                                machineId: relaventMachines[i]._id,
                                machineName: relaventMachines[i].machineName,
                                currentJobId: relaventMachines[i].currentJobId,
                                history: []
                            }

                            let machineId = relaventMachines[i]._id;

                             // item.printerId === relaventMachines[i]._id
                            // get all the history items that belong to this machine
                            relaventHistoryItems.forEach(item => {
                                console.log("checking history item....");
                                let refItem = item;
                                // console.log(item);
                                // console.log(machineId);
                                if(refItem.machineId == machineId) {
                                    console.log("\tfound history item belonging to curr machine");
                                    // console.log("\t")
                                    // hist item belongs to current machine
                                    relaventPrinterJobs.forEach(job => {
                                        let refJob = job;
                                        // console.log("checking if " + );
                                        // console.log(job);
                                        // console.log(refItem.printQueueItem);
                                        if(refItem.printQueueItem.toString() == refJob._id) {
                                            console.log("\tfound job that history item referenced")
                                            // job that the hist item references
                                            relaventUsers.forEach(user => {
                                                let refUser = user;
                                                if(refJob.jobOwner == user._id) {
                                                    console.log("\tfound user of the job");
                                                    // owner of the job referenced by hist item
                                                    let addItem = {
                                                        jobName: refJob.refJobName,
                                                        timeStarted: refJob.timeStarted,
                                                        timeEnded: refItem.printFinishedTime,
                                                        printHours: refJob.printHours,
                                                        printMinutes: refJob.printMinutes,
                                                        jobOwner: refUser._id,
                                                        jobName: refJob.jobName,
                                                        firstName: refUser.firstname,
                                                        lastName: refUser.lastname
                                                    }

                                                    console.log("\tadding new history item to machine");
                                                    console.log(addItem);
                                                    currMachineHistObject.history.push(addItem);



                                                }
                                            })
                                        }
                                    })
                                    console.log('\tfound no printer jobs for the history item!!!');
                                }
                            });

                            resObject.machineHistoryObjects.push(currMachineHistObject);
                        }
                        

                        console.log("\n\nReturning to client");
                        resObject.serverMessage.severity = "success";
                        resObject.serverMessage.summary = "Data Grabbed Successfully";
                        resObject.serverMessage.detail = "machine management data loaded!";
                        console.log(resObject);
                        return res.status(200).json(resObject);
                        
                    })
                    .catch(err => {
                        console.log("!!! Error on User.find() for owners of all history items !!!");
                        console.log(err);
                    })

                })
                .catch(err => {
                    // error on printQueue query
                    console.log("!!! Error on printQueue.find() with history's ownerID's !!!");
                    console.log(err);
                })




            })
            .catch(err => {
                // error on printHistory.find() with each printerMachine id
                console.log("!!! Error on printHistory.find() with machineId's !!!");
                console.log(err);
            })
            



        })
        .catch(err => {
            // Error on printerMachine.find()
            console.log("!!! Error on querying printerMachine collection !!!");
            console.log(err);
        })

})





/* ============================================
    Update the PrintQueueList item with id passed as complete

    This entails, removing reference on the printerMachine of currentJobId
    Saving this job to a different collection in the database for 'printerJobHistory

    The Logic for determining if there is a machine that needs to be loaded into the currentPrintingJob

    DELETE @ /api/printerQueue/printqueue/:id

============================================*/
router.delete("/printqueue", checkAuth, (req, res, next) => {
    console.log("\n\nDELETE @ /api/printerQueue/printqueue");
    console.log("Marking Job with ID: " + req.body.id) + " as complete.";

    /*  
        Steps to marking job as complete

        remove the reference to the id in the machines list

        
    */

    // Search for the referenced printqueue item

    printQueue.find( { _id: req.body.id } )
        .then(printQueueItem => {
            console.log("Print Queue Item to mark complete (DELETE): ");
            console.log(printQueueItem);
        })



})

// POST @ /api/printerQueue/createMachine/
router.post("/createMachine", checkAuth, (req, res, next) => {
    console.log("POST@/api/printerQueue/createMachine"); 
    console.log("Creating the new machine with details:");
    console.log(req.body);

    const newMachine = new printerMachine({
        id: null,
        machineName: req.body.machineName,
        currentJobId: req.body.currentJob
    });

    newMachine.save()
        .then(createdMachine => {
            console.log("+++++++ Created Machine ++++++++");
            console.log(createdMachine);

            let returnMessage = {
                severity: 'success',
                summary: 'Success',
                detail: 'Machine saved to DB successfully!'
            }

            return res.status(200).json(
                {
                    serverMessage: returnMessage,
                    machineId: createdMachine._id
                }
            )
        })
        .catch(err => {
            console.log("!!!!!!!!!! Error Saving Machine to DB !!!!!!!!!!");
            console.log(err);
            let returnMessage = {
                severity: 'error',
                summary: 'Error',
                detail: 'Save Machine to DB failed!' + err
            }

            return res.status(200).json({serverMessage: returnMessage});
        })


});


/* =================================================
   POST @ /api/printerQueue/createCurrentPrintJob/
    Adds a new PrinterQueue Item

    Updates the printerMachine currentJob
====================================================*/
router.post("/createCurrentPrintJob", checkAuth, (req, res, next) => {
    console.log("POST @ /api/printerQueue/createCurrentPrintJob");
    console.log("Recieved Data: ");
    console.log(req.body);

    let resObject = {
        serverMessage: [],
        updatedMachines: null,
        newRelaventUser: null
    }

    const newPrintQueueItem = new printQueue({
        id: null,
        printerId: req.body.printerId,
        jobName: req.body.jobName,
        jobOwner: req.body.jobOwner,
        timeStarted: req.body.timeStarted,
        printHours: req.body.printHours,
        printMinutes: req.body.printMinutes
    })

    newPrintQueueItem.save()
        .then(createdPrintJob => {
            console.log("+++++++ Added job to printer +++++++");
            console.log(createdPrintJob);

            resObject.serverMessage.push({
                severity: 'success',
                summary: 'Success',
                detail: 'print job added to printer successfully!'
            });
            // update the return Object with success message
            

            // Since the new item was added successfully, 
            // update the printerMachine currentJobID with this new job id
                printerMachine.findOneAndUpdate(
                    { _id: req.body.printerId },
                    { currentJobId: createdPrintJob._id }
                ).then(result => {
                    console.log("+++!!!!+++ PRINTER CURRENTJOBID UPDATED WITH NEW JOB! +++!!!+++") ;
                    console.log(result);
                    // With the machine updated, Query and get the list of all the printerMachines

                    // TODO QUEUE AND MAKE SURE THAT THE printerMacine updated?
                    // Query and get the user that created this and 
                    User.find( {_id: createdPrintJob.jobOwner })
                    .then(documents => {
                        // user that created this new printJob
                        // TODO ADD THE RELAVENT USER TO THE RETURN
                        console.log("Return from New Relavent Users return -----");
                        console.log(documents);
                        resObject.newRelaventUser = documents;
                        return res.status(200).json(resObject);

                    })
                    .catch(err => {
                        console.log("No users found with is relavent to the new queue item");
                        resObject.serverMessage.push({
                            severity: 'error',
                            summary: 'Printer Machine DB UPDATE failed',
                            details: err
                        })
                        return res.status(200).json(resObject);
                    })

                })
                .catch(err => {
                    // Error from searching and updating the printerMachine currentJobId with newly created ID
                    resObject.serverMessage.push({
                        severity: 'error',
                        summary: 'Printer Machine DB UPDATE failed',
                        details: err
                    })
                    return res.status(200).json(resObject);
                });

            })
            .catch(err => {
                console.log("Error On Creating a new PrintQueueItem in order to set machine currentJobId");
                console.log(err);
                resObject.serverMessage.push( {
                    severity: 'error',
                    summary: 'DB SAVE ERROR',
                    detail: 'Error On Save New Print Job.'
                });
                return res.status(200).json(resObject);
            })
            
            
})

/*=========================================================
    POST @ /api/printerQueue/updateExistingQueueJob

    POST BODY will contain
    -- jobID
    -- jobName
    -- startDate
    -- printHours
    -- printMinutes

    Updates the job with jobID with the passed info

    Returns pMessages for success for not!
=========================================================*/
router.post("/updateExistingQueueJob", checkAuth, (req, res, next) => {

    // data in req.body
    console.log("\n\n============= POST @ /api/printerQueue/updateExistingQueueJob ===================");
    console.log("Data to update: ");
    console.log(req.body);


    printQueue.findByIdAndUpdate( { _id: req.body.jobId },
         { jobName: req.body.jobName,
            timeStarted: req.body.startDate,
            printHours: req.body.printHours,
            printMinutes: req.body.printMinutes
        }).then(updatedQueueItem => {

            console.log('return data from printQueue.findByIdAndUpdate()');
            console.log(updatedQueueItem);

            // make pMessage and return to client
            let returnMessage = {
                severity: 'success',
                summary: 'Print Queue Item Updated',
                detail: 'changes reflected in DB successfully'
            }
            return res.status(200).json({serverMessage: returnMessage});
         })
         .catch( err => {
            console.log("!!!! Error on updating printQueueItem !!!!");
            console.log(err);
            let returnMessage = {
                severity: 'error',
                summary: 'Print Queue Item Not Updated',
                detail: err
            }
            return res.status(200).json({serverMessage: returnMessage});
         })

})


/*=========================================================

    POST @ /api/printerQueue/createQueuedPrintJob

    Adds a new PrinterQueueItem to the Database
    Will not modify the printerMachine currentJob field
==========================================================*/
router.post("/createQueuedPrintJob", checkAuth, (req, res, next) => {
    console.log("POST @ /api/printerQueue/createQueuedPrintJob");
    console.log("Recieved Data: ");
    console.log(req.body);

    const newPrintQueueItem = new printQueue({
        id: null,
        printerId: req.body.printerId,
        jobName: req.body.jobName,
        jobOwner: req.body.jobOwner,
        timeStarted: req.body.timeStarted,
        printLength: req.body.printLength,
        printHours: req.body.printHours,
        printMinutes: req.body.printMinutes
    })

    newPrintQueueItem.save()
        .then(createdPrintJob => {
            console.log("+++++++ Added job to printer +++++++");
            console.log(createdPrintJob);

            let returnMessage = {
                severity: 'success',
                summary: 'Success',
                detail: 'print job added to printer successfully!'
            }
            console.log("================= END OF POST REQUEST ==================");
            return res.status(200).json(
                {
                    printerJobId: createdPrintJob._id,
                    serverMessage: returnMessage
                }
            );
           
            
        })
        .catch(err => {
            console.log("!!!!!!!!!! Error New Print Queue Item !!!!!!!!!!");
            console.log(err);
            let returnMessage = {
                severity: 'error',
                summary: 'Error',
                detail: 'job save to db failed!'
            }

            return res.status(200).json({serverMessage: returnMessage});
        })
})

/* ===============================================================

    GET @ /api/printerQueue/makeStartTimeNow/:id with post body as new current date

    as long as the user is authenticated via checkAuth, they can make the time start now.

    For now is is open on the backend but controlled who can click the buttons via the rendering userLevel in angular

    RETURNS the printQueueItem that was updated
===============================================================*/
router.get("/makeStartTimeNow/:id", checkAuth, (req, res, next) => {

    console.log("========= START of /markStartTimeNow =============");

    let resObject = {
        serverMessage: [],
        updatedQueueItem: null
    }
    let currentTimeOfRequest = new Date() ;

    printQueue.findByIdAndUpdate( { _id: req.params.id }, { timeStarted: currentTimeOfRequest })
        .then(documents => {
            console.log("## Documents recieved from updating PrintQueueItems: ");
            console.log(documents);

            // Update the response message
            let retMessage = {
                severity: 'success',
                summary: 'Updated timeStarted to current time!',
                detail: 'printQueue item was successfully updated in the database!'
            }
            resObject.serverMessage.push(retMessage);


            // THIS HACKY METHOD WILL ONLY RETURN ONE UPDATED PRINT QUEU EITEM
            // FOR BATCH TIME UPDATE WRITE NEW METHOD
            let returnItem = {
                id: documents._id,
                printerId: documents.printerId,
                jobName: documents.jobName,
                jobOwner: documents.jobOwner,
                timeStarted: documents.timeStarted,
                printHours: documents.printHours,
                printMinutes: documents.printMinutes
            }
            // Return the printQueue item that was updated
            resObject.updatedQueueItem = returnItem;
            console.log("Response: ");
            console.log(resObject);
            console.log("=========== END OF /makeStartTimeNow! =============\n\n\n");
            return res.status(200).json(resObject);
        })
        .catch(err => {
            console.log("Error on updating printQueue item with new timeStarted");
            console.log(err);
            let retMessage = {
                severity: 'error',
                summary: 'Failed to update job start time to now',
                detail: 'timeStarted: Date field not updated with current date!'
            }
            resObject.serverMessage.push(retMessage);
            return res.status(200).json(resObject);
        })
        
})


router.post("/makeJobNewCurrentJob", checkAuth, (req, res, next) => {

    console.log(req.body);

    printerMachine.findByIdAndUpdate( { _id: req.body.machineId },  { currentJobId: req.body.jobId })
        .then(updatedPrinterMachine => {
            console.log("update printer machine currentJobId successful");
            console.log(updatedPrinterMachine);
        })
        .catch(err => {
            console.log("error updating machine currentJob to passed jobID")
            console.log(err);
        })
})


// Routes for Updating queue items

/*
    DELETE @ /api/printerQueue/markItemComplete/:id
*/
router.delete("/markItemComplete/:id/:machineid", checkAuth, (req, res, next) => {
    let resObject = {
        serverMessage: [],
        newCurrentJobId: null
    }

    // let printerHistoryItem = {
    //     machineName: null,
    //     machineId: null,
    //     printQueueItem: null,
    //     printFinishedTime: new Date()
    // }
    console.log("\n\n############# Delete@/api/printerQueue/markItemComplete:id ##############");
    console.log("saving queue item to history, and removing from currentJobId on machine entry.");
    console.log("printerQueue Item ID: " + req.params.id);
    console.log("printerMachine Item ID: " + req.params.machineid);



    /*
        On Marking a current job complete
        1. Search for all printQueueItems
        2. find and sort by date for the printerID

    */

    // findById will only take _id as a search, and then will only return a single document. 
    printQueue.findById( { _id: req.params.id })
        .then(documents => {

            /*
                No printQueueItems returned. Cannot move to history if the item does not exisst
            */
            if(documents == null) {
                // the doucments are undefined -- ie no printQueues Matched

                // will be another thing to just crash and send error back to client
                console.log("!!! Error on searching for printQueue item to enter into historyQueueItems !!!");
                let retMessage = {
                    severity: 'error',
                    summary: 'DB query error!',
                    detail: 'No printQueue Items returned from query to mark complete!'
                }
                resObject.serverMessage.push(retMessage);
                return res.status(200).json(resObject);
            } else {
                // there was a printQueueItem returned
                
                console.log("printQueueItem to mark complete: ");
                console.log(documents);
                let printQueueItemToBeHistory = documents;

                // save printQueueItem to the printerHistory

                // First, query and find the right machine
                printerMachine.find( { _id: req.params.machineid, currentJobId: req.params.id})
                    .then(documents => {
                        // Make sure that the documents are real/there TODO
                        console.log("documents returned from printerMachine query");
                        console.log("(length) " + documents.length);
                        console.log(documents);

                        // only go on if the documents.length == 1
                        if(documents.length == 1) {

                            // use the machine info to build the new printHisyory object

                            let newHistoryItem = new printHistory({
                                machineName: documents[0].machineName,
                                machineId: documents[0]._id,
                                printQueueItem: documents[0].currentJobId,
                                printFinishedTime: new Date()
                            });
                            console.log("newHistoryItem to save to DB: ");
                            console.log(newHistoryItem);
                            // save the queue item to the history collection
                            newHistoryItem.save()
                                .then(newSavedItem =>{
                                    // TODO make sure newSavedItem is successful
                                    console.log("+++ New History Item +++");
                                    console.log(newSavedItem);
                                    /*
                                        1. printHistory item created successfully
                                        2. still need to query the printQueue and printHistory, 
                                            and filter for the ones not in the history
                                        3. then sort the ones not in the history
                                        4. update the printermachine currentJobId with the first on
                                            in the date sorted moohuah    
                                    */
    
                                    // make query to get all the history items
                                    printHistory.find()
                                        .then(currentPrintHistory => {
                                            
                                            printQueue.find( { printerId: req.params.machineid} )
                                            .then(currentPrinterPrintQueue => {
                                                    // scope of upper variables presist when nested in calls
                                                    console.log("ALL printHistoryDocuments: ");
                                                    console.log(currentPrintHistory);
                                                    console.log("ALL items in printQueue for machine: ");
                                                    console.log(currentPrinterPrintQueue);
    
                                                    // Works uptohere -- commit point

                                                    let activePrintQueueItems = [];
                                                    // filter and only get the items that are not in the history
                                                    currentPrinterPrintQueue.forEach( printQueueItem =>  {
                                                        let addToActiveQueue = true;

                                                        currentPrintHistory.forEach( historyQueueElem => {
                                                            if(historyQueueElem.printQueueItem.toString() === printQueueItem.id.toString()) {
                                                                addToActiveQueue = false;
                                                            }
                                                        })

                                                        if(addToActiveQueue) {
                                                            activePrintQueueItems.push(printQueueItem);
                                                        }
                                                    });
                                                    console.log("~~~~~~ Current Active Queue On printerMachine ~~~~~~~");
                                                    console.log(activePrintQueueItems);
                                                    // sort the activePrintQueueItems
                                                    activePrintQueueItems.sort( (a,b) => {
                                                        return new Date(a.timeStarted).getTime() - new Date(b.timeStarted).getTime();
                                                    });
                                                    console.log("~~~~~~ Current SORTED Active Queue On printerMachine ~~~~~~~");
                                                    console.log(activePrintQueueItems);

                                                    // Take the first element in the activePrintQueueItems
                                                    // if it exists
                                                    // and set to the machines new currentJob

                                                    // There exists at least one queue item for the machine
                                                    if(activePrintQueueItems.length > 0) {
                                                        // item [0] exists, length is at least 1
                                                        // make db call to update the current machine
                                                        printerMachine.findByIdAndUpdate( { _id: req.params.machineid },
                                                            { currentJobId: activePrintQueueItems[0]._id },
                                                            { new: true}) // returns the updated document
                                                            .then(updatedMachine => {
                                                                console.log("+!+!+!+!+ Updated Machine +!+!+!+!+");
                                                                console.log(updatedMachine);
                                                            
                                                                // TODO send fully successful response back to the client
                                                                let retMessage = {
                                                                    severity: 'success',
                                                                    summary: 'Mark Item Complete Successful',
                                                                    detail: 'printerMachine updated with new currentJob from the machine queue list!'
                                                                }
                                                                resObject.serverMessage.push(retMessage);
                                                                resObject.newCurrentJobId = activePrintQueueItems[0]._id;
                                                                console.log("resObject: ");
                                                                console.log(resObject);
                                                                console.log("================ END markCurrentItemComplete =================");
                                                                return res.status(200).json(resObject);
                                                            })
                                                            .catch(err => {
                                                                let retMessage = {
                                                                    severity: 'error',
                                                                    summary: 'Update printer Machine currentJobId',
                                                                    detail: err
                                                                }
                                                                resObject.serverMessage.push(retMessage);
                                                                return res.status(200).json(resObject);
                                                                // error on updating machine with new queue item
                                                            })

                                                    } else if(activePrintQueueItems.length == 0) {

                                                        // there are no queue items for the machine
                                                        // update the printerMachine currentJobId with undefined?
                                                        printerMachine.update( { _id: req.params.machineid },
                                                            { $unset: { currentJobId: "" }} )
                                                            .then(document => {
                                                                // document should be updated printerMachine with no currentJobId

                                                                console.log("Unset the printerMachine currentJobId as there are no queued jobs");
                                                                console.log(document);
                                                                let retMessage = {
                                                                    severity: 'success',
                                                                    summary: 'Current Job Marked Complete',
                                                                    detail: 'added queue item to finished items. Machine has no queue items currently.'
                                                                }
                                                                resObject.serverMessage.push(retMessage);
                                                                return res.status(200).json(resObject);
                                                            })
                                                            .catch(err => {
                                                                // error on setting printerMachine currentJobID to nothing
                                                                let retMessage = {
                                                                    severity: 'error',
                                                                    summary: 'Unsetting currentJobID failed on machine',
                                                                    detail: err
                                                                }
                                                                resObject.currentJobId = "";
                                                                resObject.serverMessage.push(retMessage);
                                                                return res.status(200).json(resObject);
                                                            })
                                                        





                                                    }


                                                })
    
    
                                        })
                                        .catch(err => {
                                            // error on getting all printHistory
                                            console.log("!!! Error on getting all current printHistory items !!!");
                                            console.log(err);
                                            let retMessage = {
                                                severity: 'error',
                                                summary: 'printHistory DB query error',
                                                detail: err
                                            }
                                            resObject.serverMessage.push(retMessage);
                                            return res.status(200).json(resObject);
                                        })
    
                                })
                                .catch(err =>{
                                    // error on newHistoryItem.save
                                    console.log("!!! Error on newHistoryItem.save() !!!");
                                    console.log(err);
    
                                    // return back to the client requester
                                    let retMessage = {
                                        severity: 'error',
                                        summary: 'DB Save Error for newHistoryItem',
                                        detail: err
                                    }
                                    resObject.serverMessage.push(retMessage);
                                    return res.status(200).json(resObject);
    
                                })
                        }

                        





                    }) // search for machine that matches id and has currentjob as passed value
                    .catch(err => {
                        // error on finding machine 
                        console.log("!!! Error searching for the machine with the id && currentJobId !!!");
                        console.log(err);
                        let retMessage = {
                            severity: 'error',
                            summary: 'printerMachine DB Query',
                            detail: err
                        }
                        resObject.serverMessage.push(retMessage);
                        return res.status(200).json(resObject);
                    })


            } // end of else from initial query

            
        }) // end of first query
        .catch(err => {
            // error on seraching the printQueueItems for the passsed item matching id
            console.log("!!! Error on searching for printQueue item to enter into historyQueueItems !!!");
            console.log(err);
            let retMessage = {
                severity: 'error',
                summary: 'DB query error!',
                detail: 'on searching for printQueueItem to mark complete'
            }
            resObject.serverMessage.push(retMessage);
            return res.status(200).json(resObject);
        })

    
}); // end of markItemComplete



/* ==============================================
     DELETE @ /api/printerQueue/deleteItem/:id

     This Deletes a QueueItem without saving to history

     1. Delete PrintQueueItem with id :id 
     2. If the :id is found as {currentJobId: } in printer machines, update with null

     NO HISTORY SAVED

     WILL FORCE OVERWRITE PRINTERMACHINE CURRENTJOBID will null if it matches the deleteJobId

     RETURNS:
        Updated machine without the currentJobId?
==============================================*/
router.delete("/deleteItem/:id", checkAuth, (req, res, next) => {
    console.log("\n\n DELETE@/api/printerQueue/deleteItem/:id with id: " + req.params.id);

    let resObject = {
        serverMessage: [],
        updatedMachine: null
    }
    printQueue.findOneAndDelete( { _id: req.params.id })
        .then(documents => {
            console.log("^v^v^ Documents deleted from PrintQueueItems: ");
            
            console.log(documents);
            console.log("Querying PrinterMachines for currentJobId == deleted Item");
            

            printerMachine.findByIdAndUpdate(
                { _id: documents.printerId, currentJobId: documents._id},
                { currentJobId: undefined })
            .then(documents => {
                console.log("Printers found with currentJobID == deleted && matching the printerId");
                console.log(documents)

                let retMessage = {
                    severity: 'success',
                    summary: 'Queue Item delted Successfully',
                    detail: 'item and machine currentJobId updated!'
                }
                resObject.serverMessage.push(retMessage);
                resObject.updatedMachine = documents;
                
                return res.status(200).json(resObject);

                // return here for successful queueitem delete and update on currentJobId
            })
            .catch(err => {
                console.log("!! ERROR ON UPDATING MACHINE CURRENTJOBID if it MATCHED");
                console.log(err);
            })

            
        })
        .catch(err => {
            // On error with deleting the required PrintQueueItem from the DB
            let resObject = {
                severity: 'warning',
                summary: 'Err onfindOneAndDelete() for jobId',
                detail: err
            }
            return res.status(200).json(resObject);
        })
});

/* =====================================
     DELETE @ /api/printerQueue/deleteMachine/:id

    This Route Just deletes a printerMachine.

    After successful printerMachine delete,
    the printQueueItems is queried and all items with the printerId matching the deleted machine
    will be deleted.

========================================*/
router.delete("/deleteMachine/:id", checkAuth, (req, res, next) =>{
    console.log("Delete @ /api/printerQueue/:id");

    printerMachine.findOneAndDelete({ _id: req.params.id})
        .then(result => {

            printQueue.deleteMany( { printerId: result._id })
            .then(documents => {
                console.log("Results from deleteing all orphaned PrintQueueItems after machine was deleted:");
                console.log(documents);
                return res.status(200).json(
                    {
                        severity: 'success',
                        summary: 'Delete Successful!',
                        detail: 'Machine and orphaned PrintQueueItems deleted successfully!'
                    }
                );
            })
            .catch(err => {
                console.log(" !! Error on deletingMany PrintQueueItems with printerId matching deletedPrinter id");
                return res.status(200).json(
                    {
                        severity: 'error',
                        summary: 'Error Cleaning Up!',
                        detail: 'error deleting orphaned PrintQueueItems after PrinterMachine was deleted!'
                    }
                );
            })

        })
        .catch(err => {
            console.log("Error on deleting desired PrinterMachine");
            return res.status(200).json(
                {
                    severity: 'error',
                    summary: 'Delete Printer Machine Failed',
                    detail: 'aborted on findAndDelete() for printer machine with id passed!'
                }
            )
        })
});






module.exports = router;