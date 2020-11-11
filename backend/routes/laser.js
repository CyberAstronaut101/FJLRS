const express = require("express");

// Laser => machines in the lab
const Laser = require('../models/laser');
const checkAuth = require('../middleware/check-auth');

const LaserEvent = require('../models/laserEvent');
const router = express.Router();


// NEED TO RETURN THE DATE FROM THE SERVER< IT WILL BE HIT PERIODIOCILLAY




/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    GET @ /api/laserLabHome

    first get the current lasers, then get the calender links for them
    return in a format that hcan be used by fullcalendar

    Returns all the laser calendar events
    AND the buisness hours. 

    TODO make a new buisness hours interface and database instance
    interface {
        daysOfWeek: [0...7],
        startTime: '00:00' military time
        endTime:

    }

    for different times on different days
    buisnessHours: {
        {dof,start,end},
        {dof,start,end}
    }
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
router.get("/laserLabHome", (req, res, next) => {
    console.log("/api/laser/laserLabHome --> Get laser and laser calendar events ");

    Laser.find()
        .then(documents => {
            console.log("TODO make sure this is getting all the laser events with the laser ids, and then the buisness hours for the digitalLab");

        })

})

/*
    POST @ /laser/createCalendarEvent/:laserId
    body: {
        // event interface
    }
*/
router.post("/createCalendarEvent/:laserId", checkAuth, (req, res, next) => {
    console.log("/api/laser/createCalendarEvent/:laserId === Body: ");
    console.log("** REB BODY TODO");
    
});



router.get("/machine", (req, res, next) => {
    console.log("GET @ /api/laser/:id with id of:");
    console.log(req.params.id);
})


// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
//      GET @ /api/laser/create
//  Creates the four basic lasers, A, B, C, D in the application
// DEVELOPMENMT ROUTES - SPECIFC TO THE FAY JONES LASER LAB
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

router.get("/createA", (req, res, next) => {
    console.log("GET@/api/laser/createALaser");
    console.log("Creating and saving 4 lasers to the database");

    const laserA = new Laser({
        laserName: "Alvar",
        laserSize: "18x32",
        inUse: false
    });

    laserA.save().then(createdLaser => {
        console.log("Saved Alvar laser to db");
        console.log(createdLaser);

        res.status(200).json({
            message: 'Added Laser Alvar Successfully',
            postId: createdLaser._id
        });
    })
    .catch(err => {
        console.log("create laser A failed");
        console.log(err);
        res.status(500).json({message: "Laser Already Exists"});
    });

});

router.get("/createB", (req, res, next) => {
    console.log("GET@/api/laser/createALaser");
    console.log("Creating and saving Bucky to the database");

    const laserA = new Laser({
        laserName: "Bucky",
        laserSize: "18x32",
        inUse: false
    });

    laserA.save().then(createdLaser => {
        console.log("Saved Bucky laser to db");
        console.log(createdLaser);

        res.status(200).json({
            message: 'Added Laser Bucky Successfully',
            postId: createdLaser._id
        });
    })
    .catch(err => {
        console.log("create laser B failed");
        console.log(err);
        res.status(500).json({message: "Laser Already Exists"});
    });

});

router.get("/createC", (req, res, next) => {
    console.log("GET@/api/laser/createALaser");
    console.log("Creating and saving charlie to the database");

    const laserA = new Laser({
        laserName: "Charlie",
        laserSize: "12x24",
        inUse: false
    });

    laserA.save().then(createdLaser => {
        console.log("Saved Chalire laser to db");
        console.log(createdLaser);

        res.status(200).json({
            message: 'Added Laser Charlie Successfully',
            postId: createdLaser._id
        });
    })
    .catch(err => {
        console.log("create laser C failed");
        console.log(err);
        res.status(500).json({message: "Laser Already Exists"});
    });

});

router.get("/createD", (req, res, next) => {
    console.log("GET@/api/laser/createALaser");
    console.log("Creating and saving D lasers to the database");

    const laserA = new Laser({
        laserName: "Denise",
        laserSize: "12x24",
        inUse: false
    });

    laserA.save().then(createdLaser => {
        console.log("Saved Denise laser to db");
        console.log(createdLaser);

        res.status(200).json({
            message: 'Added Laser Denise Successfully',
            postId: createdLaser._id
        });
    })
    .catch(err => {
        console.log("create laser A failed");
        console.log(err);
        res.status(500).json({message: "Laser Already Exists"});
    });

});

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
      GET @ /api/laser
    GET CURRENT STATUS OF ALL LASERS 

    returns interface {
        inUse: boolean,
        _id: string,
        laserName: string
    }
 =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
 router.get("", (req, res, next) => {
    console.log('/api/laser --> Getting all laser status');
    
    Laser.find()
        .then(documents => {
            console.log(documents);
            res.status(200).json({
                message: 'All status of lasers fetched successfully',
                lasers: documents
            });
        });
});
/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    POST @ /api/laser/update/:id

    UPDATE SINGLULAR LASER MACHINE
 =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

router.put("/update/:id", checkAuth, (req, res, next) => {
    console.log("PUT @ /api/laser/update/:id --> Update name,size, of laser with :id");
    console.log(req.params.id);

    Laser.findOneAndUpdate(
        { _id: req.params.id },{ laserName: req.body.newName, size: req.body.newSize}
        )
        .then(result => {
            console.log("Result from laser search: ");
            console.log(result);
            // result will not show the changes, just that the search returned a valid entry

            if(!result) {
                // no result was returned, send bad error message

            } else {
                res.status(200).json({
                    severity: 'success',
                    summary: 'Laser Machine Updated',
                    detail: "Laser " + result.laserName + " updated successfully"
                })   
            }
            

            
            
        })
    
});

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    CREATE SINGLE NEW LASER MACHINE

    POST @ /api/laser
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= */
router.post("", checkAuth, (req, res, next) => {
    console.log("POST: /api/laser --> Create new Laser Machine");
    console.log(req.body);

    const newLaserMachine = new Laser({
        id: null,
        laserName: req.body.laserName,
        laserSize: req.body.laserSize,
        inUse: false
    });

    newLaserMachine.save().then(createdLaser => {
        console.log("New Laser Machine Saved to DB: ");
        console.log(createdLaser);
        newLaserMachine.id = createdLaser._id;

        // TODO POSSIBLE ERRORS HERE IF THE NAME OR WHATEVER IS THE SAME

        res.status(200).json({
            severity: 'success',
            summary: 'Laser Machine Saved',
            detail: "laser saved to db",
            newLaser: newLaserMachine
        })
    })
    .catch(err => {
        console.log("Create new laser failed.");
        res.status(200).json({
            severity: 'error',
            summary: 'Laser Failed!',
            detail: err.message
        })
    })
    
    
    // get params passed in the request
    // create a laser object
    // call save on the new object
    // return successful, the name must be unique!

});

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
//  DELETE @ /api/laser/:id
//      Will delete the laser machine with the 
//        id passed
//  checkAuth to ensure that user is authenticated
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
router.delete("/:id", checkAuth, (req, res, next) => {
    console.log("DELETE: /api/laser/:id --> Deleteing Machine with id:");
    console.log(req.params.id);

    Laser.findOneAndDelete({ _id: req.params.id })
        .then(result => {
            console.log("within delete laser machine");
            console.log(result);

            // determine if the results have a successfull delete
            if(!result){
                // no results exist
                console.log("Find and delete failed");
                return res.status(401).json({message: "No delete of machine occured"});
            } else {
                console.log("Laser Machine Delete Successful");
                res.status(200).json({
                    severity: "success",
                    summary: "Laser Machine Deleted",
                    detail: result.laserName + " was deleted from the db"
                });
            }
        });
}) // end of delete machine by id



/* create a new todo on the list 
    CREATE NEW TODO
*/
// router.post("", checkAuth, (req, res, next) => {
//     console.log('POST: /api/todos');

//     const newTodo = new Todo({
//         title: req.body.title,
//         content: req.body.content,
//         creator: req.userData.userId,
//         deadline: req.body.deadline
//     });

//     newTodo.save().then(createdTodo => {
//         console.log("Saved TODO to db: ");
//         console.log(createdTodo);
//         res.status(201).json({
//             message: 'Todo Added Successfully',
//             postId: createdTodo._id
//         });
//     });

// });

//.patch --> updates
//.put --> whole new
// UPDATE TODO 
// router.put("/:id", checkAuth, (req, res, next) => {
//     const todo = new Todo({
//         _id: req.body.id,
//         title: req.body.title,
//         content: req.body.content,
//         deadline: req.body.deadline,
//         creator: req.userData.userId
//     })
//     Todo.updateOne({ _id: req.params.id, creator: req.userData.userId}, todo).then(result => {
//         console.log(result);
//         if(result.n == 0) {
//             console.log("no update occured!");
//             return res.status(401).json({ message: "User not authorized to edit todo!"});
//         } else {
//             console.log('update todo successful');
//             res.status(200).json({ message: "Update Successful!"});
//         }
       
//     })
// })

// router.get("", (req, res, next) => {
//     console.log('/api/todos');
    
//     Todo.find()
//         .then(documents => {
//             console.log(documents);
//             res.status(200).json({
//                 message: 'Todos fetched successfully',
//                 todos: documents
//             });
//         });
    
// });

// router.get("/:id", (req, res, next) => {
//     Todo.findById(req.params.id).then(todo => {
//         if(todo) {
//             // todo with id exists in datagbase
//             res.status(200).json(todo);
//         } else {
//             res.status(404).json({message: 'Todo Not Found'});
//         }
//     })
// })

// router.delete("/:id", checkAuth, (req, res, next) => {
//     // only admin or employee can delete

//     // console.log(req.params.id);
//     console.log('\n /api/todos/delete/:id');
//     console.log("trying to delete id: " + req.params.id);
//     console.log("with user ID of: " + req.userData.userId )
//     Todo.findOneAndDelete({ _id: req.params.id, creator: req.userData.userId})
//         .then(result => {
//             console.log("within delete post user check");
//             console.log(result);
//             if(!result) {
//                 console.log("find and delete failed");
//                 return res.status(401).json({message: 'user not owner of todo!'});
//             } else {
//                 console.log("todo delete successful");
//                 res.status(200).json({message: 'user not owner of todo!'});
//             }
        
//     });    
// });

module.exports = router;