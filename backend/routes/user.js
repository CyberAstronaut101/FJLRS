const express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const checkAuth = require("../middleware/check-auth");

const router = express.Router();

const User = require("../models/user");
const ResetPassword = require("../models/resetPassword");

const helpers = require("../utils/helpers");

// :/api/user/login

const jwtRandomInput = "B7DAiSzg9eXGjgkMISCCpAVihfg1DoUr6ykrTPzGXoPJiSI914URv"; // Random Generated

// Definitions for swagger are like the models for objects that are repeatedly used in the API
// These can be referenced via $ref '#/definitions/NAME'
/**
 * @swagger
 * definitions:
 *   User:
 *     properties:
 *       firstname:
 *         type: string
 *       lastname:
 *         type: string
 *       studentID:
 *         type: integer
 *       email:
 *         type: string
 *   ErrorResponse:
 *      properties:
 *        test:         
 *          type: string
 *   Error:
 *     properties:
 *       message:
 *         type: string
 *   Message:
 *     properties:
 *       severity:
 *         type: string
 *       summary:
 *         type: string
 *       detail:
 *         type: string
 *   LoginAuth:
 *     properties:
 *       token:
 *         type: string
 *       expiresIn:
 *         type: integer
 *       loggedInUser:
 *         $ref: '#/definitions/User'
 *       message:
 *         type: string
 */ 

 /**
* @swagger
* /api/user/login:
*   post:
*     tags: [Users]
*     summary: Login API Request.
*     description: User login request from angular application.
*     consumes:
*       — application/json
*     parameters:
*       - name: "email" 
*         description: "User input in login form for email"
*         in: query
*         required: true
*         type: string 
*         example: "test@test.com"
*       - name: "password" 
*         description: "User input in login form for password. Plaintext currently"
*         in: query
*         required: true
*         type: string 
*         example: "badpassword1"
*     responses: 
*       401:
*         description: Authentication Error
*         schema:
*           $ref: '#/definitions/Error'
*       200:
*         description: Authentication Successful
*         schema: 
*           $ref: '#/definitions/LoginAuth'
*/
router.post("/login", (req, res, next) => {
    console.log('\n POST @ /api/user/login');
    // console.log(req.body.email);     // passed via the login form post request

    // placeholder for the returned values when nesting MongoDB calls.
    // If you are going to use the values from one query in another, JS scoping kicks in and
    // using this variable defined outside the DB query rabbit hold was the best way I found to do this.
    let fetchedUser; 

    // First Check If Email Exists -- User.findOne....
    User.findOne({
        email: req.body.email
    })
        .then(user => {
            // Check if a valid object or a null was returned
            
            // console.log(user);
            if (!user) {
                // User Does Not Exist (null returned)
                console.log('User email does not exist');

                // Send response to client, error code 401
                return res.status(401).json({
                    message: "No account exists."
                })
            }
            
            // User Does Exist
            fetchedUser = user;

            // Take the login attempt password and compare the hash to the current user password hash
            
            return bcrypt.compare(req.body.password, user.password);
            // This returns, and process execution will continue at the .then()
            // The 'result' passed there is either true or false from the bcrypt compare function
        })
        .then(result => {
            //console.log(result);

            // Check if password provided was correct
            if (!result) {
                // Password Mismatch
                console.log('Password mismatch');
                return res.status(401).json({
                    message: "Account authentication failed"
                });
            }

            // we have valid password

            // Now generate an auth token valid for 1hr
            const token = jwt.sign(
                {
                    email: fetchedUser.email,               // Sign w/ the users email + their DB uid
                    userId: fetchedUser._id,
                }, 
                jwtRandomInput,       // Random string used in generation
                {
                    expiresIn: "1h"                 // Length of valid token
                });

            console.log("Result from attempt at login:");
            console.log(fetchedUser);

            res.status(200).json({
                token: token,
                expiresIn: 3600,        // Set token to expire in an hour
                loggedInUser: fetchedUser.toClient(),  // maybe sanatize this? TODO will need to look at how the auth services handle user data on the angular side
                message: "User Auth Successful!"
            })
        })
        .catch(err => {
            // catch any errors
            console.log(err);
            console.log('final catch');
            return res.status(401).json({
                message: "Unknown DB Error"     // Error 0x003 - general catch all for any errors in DB queries
            });
        });
});



/**
* @swagger
* /api/user/loginId:
*   post:
*     tags: [Users]
*     summary: Kiosk Mode Check In Request
*     description: LoginId is used when client side is kiosk mode only sending a student ID to login. Initially implemented for use to check if the user trying to sign in has a valid appointment for the resource they are trying to access.
*     consumes:
*       — application/json
*     parameters:
*       - name: "userId" 
*         description: "StudentID for User"
*         in: query
*         required: true
*         type: string 
*         example: "0123456789"
*     responses: 
*       401:
*         description: Authentication Error
*         schema:
*           $ref: '#/definitions/Error'
*       200:
*         description: Authentication Successful
*         schema: 
*           $ref: '#/definitions/LoginAuth'
*/
router.post("/loginId", (req, res, next) => {
    console.log('\n POST @ /api/user/loginId');
    console.log(req.body);
    
    // Take the request body params (req.body) and search for a studentID matching req.body.userId

    User.findOne(
        { studentID: req.body.userId } 
    ).then(results => {

        // Results back from User query for passed studentID
        console.log('Results from studentID match: ' +  results);

        // Check if the results were null..
        if(!results) {
            // ...No Results
            console.log('No results from student ID lookup. Returning error');

            // So this format of messages is specifically for use with primeNg notification popups
            // https://www.primefaces.org/primeng/showcase/#/messages
            let message = {
                severity: 'error',
                summary: 'No Matching studentID found',
                detail: 'Either "' + req.body.userId + '" was wrong, or account does not exist.'
            };

            // Return failed message
            return res.status(404).json({
                message: message
            });

        } else {
            // There are results
            console.log('Student Found Successfully.');

            const token = jwt.sign({
                email: results.email,
                userId: results._id,
            }, jwtRandomInput, {
                    expiresIn: "1h"
                });

            console.log("Result from attempt at login:");
            console.log(results);

            // If this is kiosk login, really only the studentID is needed to check against 
            // other stuff?

            return res.status(200).json({
                token: token,
                expiresIn: 500,        // stay logged in for 8.33333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333 seconds. lol
                loggedInUser: results.toClient(),       // Maybe make this not return the password and such..
                message: {
                    severity: 'success',
                    summary: 'Matching studentID found',
                    detail: ''
                }
            })

        }

    })
    .catch(err => {
        console.log('Error on querying users by studentID');
        console.log(err);
    })

})

/**
 * @swagger
 * "/api/user/signup":
 *   post:
 *     tags: [Users]
 *     summary: "Create New User"
 *     consumes: [application/json]
 *     produces: [application/json]
 *     parameters:
 *       - name: "firstname" 
 *         description: "User first name"
 *         in: query
 *         required: true
 *         type: string 
 *         example: "Johnny"
 *       - name: "lastname" 
 *         description: "User last name"
 *         in: query
 *         required: true
 *         type: string 
 *         example: "Test"
 *       - name: "email" 
 *         description: "User email"
 *         in: query
 *         required: true
 *         type: string 
 *         example: "test@test.com"
 *       - name: "password" 
 *         description: "User password"
 *         in: query
 *         required: true
 *         type: string 
 *         example: "badpassword1"
 *       - name: "studentID"
 *         description: "User uark student id"
 *         in: query
 *         required: true
 *         type: string 
 *         example: "0123456789"
 *       - name: "phone"
 *         description: "User phone number"
 *         in: query
 *         required: true
 *         type: string 
 *         example: "1234567890"
 *       - name: "userLevel"
 *         description: "User level {student, employee, admin}"
 *         in: query
 *         required: true
 *         type: string 
 *         example: "{student, employee, admin}"
 */
router.post("/signup", (req, res, next) => {
    // create new user and store to database

    console.log("create user data");
    console.log(req.body);

    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: hash,
                studentID: req.body.studentID,
                phone: req.body.phone,
                userLevel: req.body.userLevel
            });
            console.log("user being saved to db");
            console.log(user);
            user.save()
                .then(result => {
                    console.log("created new user successfully");
                    res.status(201).json({
                        message: "User Created Successfull!",
                        result: result
                    });
                })
                .catch(err => {
                    console.log("new user create failed");
                    res.status(500).json({ message: "User Email Alread Exists" })
                });
        })

});


/**
 * @swagger
 * "/api/user/":
 *   get:
 *     tags: [Users]
 *     summary: "Returns all student Accounts. Must be authenticated to access this API call."
 *     consumes: [application/json]
 *     produces: [application/json]
 */
router.get("", checkAuth, (req, res, next) => {
    console.log('GET @ /api/users');
    console.log('returning list of all users');

    User.find().then(result => {
        console.log('User.find() results');
        console.log(result);
        result = result.map(elem => {
            return elem.toClient(); // mongoose schema function to rename _id to id
        });


        console.log(result);

        res.status(201).json({
            message: "All Users fetched successfully",
            users: result
        });
    })
})


/**
* @swagger
* /api/user/getInfo:
*   get:
*     tags: [Users]
*     summary: NOT IMPLEMENTED - NEED BETTER USECASE
*     description: NPass UID to get student info
*     consumes:
*       — application/json
*     parameters:
*       - name: "userId" 
*         description: "StudentID for User"
*         in: query
*         required: true
*         type: string 
*         example: "0123456789"
*     responses: 
*       401:
*         description: Authentication Error
*         schema:
*           $ref: '#/definitions/Error'
*       200:
*         description: Authentication Successful
*         schema: 
*           $ref: '#/definitions/LoginAuth'
*/
router.get("/getInfo", checkAuth, (req, res, next) => {
    // GET @ /api/user/getInfo/:id
    console.log("Searching and returing sanatized user Info");


    // TODO figure out what needs to happen with this method?


    User.findOne({ _id: req.body.userId })
        .then(userInfo => {
            console.log("unsanatized user inf");
            console.log(userInfo);
        })
        .catch(err => {
            console.log("error retreiving sanatized user info");
            console.log(err);
        })
})

/* ==================================================

    Start the User Password Reset Workflow

    GET @ /api/user/startPasswordReset
==================================================*/
/**
 * @swagger
 * "/api/user/startPasswordReset":
 *   get:
 *     tags: [Users]
 *     summary: "Start User Password Reset Request Workflow"
 *     consumes: [application/json]
 *     produces: [application/json]
 *     parameters:
 *       - name: "userEmail" 
 *         description: "Email of account that is requesting to get password reset link"
 *         in: query
 *         required: true
 *         type: string 
 *         example: "test@test.com"
 */
router.get("/startPasswordReset/:userEmail", (req, res, next) => {
    console.log('\nPOST@/api/user/startPasswordReset');
    // console.log(req.params.uid);
    console.log('Email for account reset: ');
    console.log(req.params.userEmail);

    /*
        Password Reset Workflow
        =======================

        1. User Requests Password Reset from Login Page with supplied email in the form field
        2. Verify account w/ that email exists
            a. If Account Exists
                1. Create a 'ResetPassword' DB entry containing the UID of the email account requesting reset
                2. Send an email  `sendEmailFromAlertAdminAccoun()` to the account owner with reset link
                    ** The reset password link is application:/




    */
    // New Workflow
    /*
        1. Find the user with that email
            if exists, create the reset token

            if no exists, send error message back
    */
    User.findOne({ email: req.params.userEmail })
        .then(result => {

            console.log('Result from Userfind one: ' + result);
            
            if (!result) {
                // console.log("no account found with email: " + req.params.userEmail);

            }

            const newResetToken = new ResetPassword({
                uid: result._id
            })


            newResetToken.save(
                { new: true }    // return the saved entry with the _id
            )
                .then(results => {
                    console.log('password reset token successfully saved');

                    let emailBody = {
                        to: req.params.userEmail,
                        subject: 'FJLRS - Reset Password Request',
                        html: 'Please click on ' + process.env.resetPasswordLink + results.uid + ' to reset your password!'
                    }

                    // Pass along the rest of this request to be handled by the email call
                    helpers.sendEmailFromAlertAdminAccount(emailBody, res); // will return a res.status

                })
                .catch(err => {
                    console.log('error creating the password reset token!');
                    console.log(err);
                    return res.status(200).json({
                        message: {
                            severity: 'error',
                            summary: 'ResetPassword token failed to create!',
                            detail: 'Possibility that this user already has an open password reset active.'
                        }
                    })
                })


        })
        .catch(err => {
            console.log('!!! Error on User.findOne with email as search');
            console.log(err);

            // TODO send response

        })

})

/**
 * @swagger
 * "/api/user/verifyCanResetPassword":
 *   get:
 *     tags: [Users]
 *     summary: "Check if user has a ResetPassword DB entry to allow to reset password"
 *     consumes: [application/json]
 *     produces: [application/json]
 *     parameters:
 *       - name: "userEmail" 
 *         description: "Email of account that requesting ability to reset password."
 *         in: query
 *         required: true
 *         type: string 
 *         example: "test@test.com"
 */
router.get("/verifyCanResetPassword/:uid", (req, res, next) => {

    ResetPassword.findOne({ uid: req.params.uid })
        .then(result => {
            console.log('ResetPassword token search successful');
            console.log(result);

            // Might need to check and make sure that something returned
            if (!result) {
                // If there were no results
                return res.status(200).json({
                    message: {
                        severity: 'warn',
                        summary: 'No ResetPassword token found',
                        detail: 'Unable to allow password reset. Contact system administrator if you believe this to be in error'
                    },
                    isValid: false
                })
            }

            return res.status(200).json({
                message: {
                    severity: 'success',
                    summary: 'Valid Session',
                    detail: 'Reset password link valid!'
                },
                isValid: true
            })
        })
        .catch(err => {
            console.log("ERROR searching for a valid ResetPassword token for uid");
            console.log(err);
            return res.status(200).json({
                message: {
                    severity: 'warn',
                    summary: 'No ResetPassword token found.',
                    detail: 'Unable to allow password reset.  Contact system administrator if you believe this to be in error'
                },
                isValid: false
            })
        })
})


router.get("/passwdUpdate/:uid/:newPasswd", (req, res, next) => {
    // Update the password
    // then remove the PasswordReset token
    console.log("GET@/api/user/passwdUpdate/:uid/:newPasswd");
    console.log("uid: " + req.params.uid);
    console.log("newPasswd: " + req.params.newPasswd);

    // First hash the new password with bcrypt
    bcrypt.hash(req.params.newPasswd, 10)
        .then(hash => {
            console.log('setting users password to hash: ' + hash);

            // First make sure that there is still a valid token
            ResetPassword.findOneAndDelete({ uid: req.params.uid })
                .then(result => {

                    // Check if there was actually a token deleted
                    if (!result) {
                        // There were no tokens that matched to delete
                        return res.status(200).json({
                            message: {
                                severity: 'error',
                                summary: 'Error!',
                                detail: 'No valid ResetPassword tokens for user account!'
                            }
                        });
                    }

                    // There was a token that was deleted
                    // Make request to hash and update the password field
                    User.findByIdAndUpdate({ _id: req.params.uid }, { password: hash })
                        .then(result => {
                            console.log("User account password updated successfully!");
                            console.log(result);

                            return res.status(200).json({
                                message: {
                                    severity: 'success',
                                    summary: 'Password updated!',
                                    detail: 'User account password successfully updated'
                                }
                            });
                        })
                        .catch(err => {
                            console.log("User account password FAILED UPDATE!");
                            console.log(err);

                            return res.status(200).json({
                                message: {
                                    severity: 'error',
                                    summary: 'Password Update Failed!',
                                    detail: err
                                }
                            });
                        })

                })
                .catch(err => {
                    console.log('!!! error removing reset token');
                    console.log(err);
                    return res.status(200).json({
                        message: {
                            severity: 'error',
                            summary: 'RestPassword Token Removal Error',
                            detail: err
                        }
                    });
                })

        }) // end of hashing callback


})


/**
 * @swagger
 * "/api/user/createAdminUser":
 *   get:
 *     tags: [Users]
 *     summary: "Creates default admin user account"
 *     consumes: [application/json]
 *     produces: [application/json]
 */
router.get("/createAdminUser", (req, res, next) => {
    console.log('\nGET @ /api/user/createAdminUser')
    console.log("create new admin user with email admin@uark.edu and password test");

    bcrypt.hash("test", 10)
        .then(hash => {
            const user = new User({
                firstname: "ADMIN",
                lastname: "USER",
                email: "admin@uark.edu",
                password: hash,
                studentID: "000000000",
                phone: "000000000",
                userLevel: "admin",
                laserLab01: true,
                laserLab02: true,
                woodShop01: true,
                woodShop02: true,
                woodShop03: true,
                plotters: true,
                projectors: true
            });
            user.save()
                .then(result => {
                    console.log("created new admin user successfully");
                    res.status(201).json({
                        message: "User Created Successfull!",
                        result: result
                    });
                })
                .catch(err => {
                    console.log("new user create failed");
                    res.status(500).json({ message: "User Email Alread Exists" })
                });
        })
}); // end create admin user

/**
 * @swagger
 * "/api/user/createEmployeeUser":
 *   get:
 *     tags: [Users]
 *     summary: "Creates default employee user account"
 *     consumes: [application/json]
 *     produces: [application/json]
 */
router.get("/createEmployeeUser", (req, res, next) => {
    console.log("create new Employee user with email Employee@uark.edu and password test");

    bcrypt.hash("test", 10)
        .then(hash => {
            const user = new User({
                firstname: "Employee",
                lastname: "User",
                email: "employee@uark.edu",
                password: hash,
                studentID: "1212121212",
                phone: "000000000",
                userLevel: "employee",
                laserLab01: true,
                laserLab02: true,
                woodShop01: true,
                woodShop02: true,
                woodShop03: true,
                plotters: true,
                projectors: true
            });
            user.save()
                .then(result => {
                    console.log("created new admin user successfully");
                    res.status(201).json({
                        message: "User Created Successfull!",
                        result: result
                    });
                })
                .catch(err => {
                    console.log("new user create failed");
                    res.status(500).json({ message: "User Email Alread Exists" })
                });
        })
}); // end create admin user

/**
 * @swagger
 * "/api/user/createStudentUser":
 *   get:
 *     tags: [Users]
 *     summary: "Creates default student user account"
 *     consumes: [application/json]
 *     produces: [application/json]
 */
router.get("/createStudentUser", (req, res, next) => {
    console.log("create new student user with email student@uark.edu and password test");

    bcrypt.hash("test", 10)
        .then(hash => {
            const user = new User({
                firstname: "Student",
                lastname: "User ",
                email: "student@uark.edu",
                password: hash,
                studentID: "123456789",
                phone: "000000000",
                userLevel: "student",
                laserLab01: true,
                laserLab02: false,
                woodShop01: true,
                woodShop02: false,
                woodShop03: false,
                plotters: false,
                projectors: false
            });
            user.save()
                .then(result => {
                    console.log("created new admin user successfully");
                    res.status(201).json({
                        message: "User Created Successfull!",
                        result: result
                    });
                })
                .catch(err => {
                    console.log("new user create failed");
                    res.status(500).json({ message: "User Email Alread Exists" })
                });
        })
}); // end create admin user


router.get("/getHistoryAndNotes/:id", checkAuth, (req, res, next) => {
    console.log('\n\n========== Get history and notes for UID: ' + req.params.id + " =============");
    // TODO really not even sure why this is here but will leave it for now. 
})

module.exports = router;