const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');


const DeptInfo = require("../models/deptInfo");

// Base route, /api/buisnessHours

/*
    interface ServerResponseMessage {
        severity: string,
        summary: string,
        detail: string
    }
*/

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 GET @ /api/buisnessHours
              
    Returns all the dept information from db

    deptName: {type: String, required: true, unique: true },  // digitallab, woodshop
    buisnessHours: {
        daysOfWeek: { type: Number, value: [Number]},
        startTime: { type: String, required: true},
        endTime: { type: String, required: true }
    }

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= */
router.get("", checkAuth, (req, res, next) => {
    console.log(" ========== GET @ /api/buisnessHours ===============");
    DeptInfo.find()
        .then(documents => {
            console.log("Deparptments Recieved");
            console.log(documents);
            console.log(documents.length);

            if(documents.length == 0) {
                console.log(" ========== END @ /api/buisnessHours ===============");
                return res.status(200).json({
                    deptHourInfo: documents,
                    severity: 'error',
                    summary: 'No Deparptment Buisness Hours Data Loaded',
                    detail: 'Error on API END, deparptments.length == 0 OR There are no current deparpments created'
                });
            }

            console.log(" ========== END @ /api/buisnessHours ===============");
            return res.status(200).json({
                deptHourInfo: documents,
                severity: 'success',
                summary: 'Dept Info Get Success!',
                detail: 'All Dept Infomation Loaded successfully'
            });
        })
        .catch(err => {
            console.log("There was an error retrieving all email accounts from the DB");
            console.log(err);
            res.status(403).json(
                { message: "Error on API end, No Buisness Hours Deparptment Info Loaded" }
            );
        });
    

})


/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 POST @ /api/buisnessHours/createDeparptment

    Create a new deparptment with the given 

    returns deptId: string, severity: string, summary: string, detail: string
              
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= */
router.post("/createDeparptment", checkAuth, (req, res, next) => {
    console.log('\n');
    console.log("POST @ /api/buisnessHours/createDeparptment");
    console.log(req.body);

    
    const newDeparptment = new DeptInfo({
        deptName: req.body.deptName,
        buisnessHours: req.body.buisnessHours
    })

    // need to send additional emailId to with the response
    newDeparptment.save()
        .then(createdDept => {
            console.log("Saved Email Account to DB:");
            console.log(createdDept);
            return res.status(200).json({
                deptId: createdDept,
                severity: 'success',
                summary: 'Success!',
                detail: 'New Email Account saved to DB successfully'
            });
        })
        .catch(err => {
            console.log("Error saving deparptment to the db");
            console.log(err);
            return res.status(200).json({
                severity: 'error',
                summary: 'Error',
                detail: 'Email Type ' + type + 'already exists for the system!'
            });
        });

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
                let detailMsg = "Update SysAdmin Account with email of " + req.body.email + " Successful!";
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
    console.log("POST @ /api/email/sendemail");

    // Get alertAdmin email account
    EmailAccount.findOne( { type: 'alertadmin' } )
        .then(result => {
            console.log("Result from getting sys admin email: ");
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

            console.log("Email being sent:");
            console.log(mailOptions);
            transporter.sendMail(mailOptions, function(error, info) {
                if(error) {
                    console.log("\n#@$#@#$ Sending Error Response to the srvv (401 error)");
                    console.log(error);

                    transporter.close();

                    return res.status(200).json({ 
                        severity: 'error',
                        summary: 'Error!',
                        detail: 'Error Within the email configuration. Email Not Sent.'
                     });

                } else {
                    console.log("Email was sent successfully: " + info.response);

                    transporter.close();
                    return res.status(200).json({ 
                        severity: 'success',
                        summary: 'Success!',
                        detail: 'Email Was Sent Successfully!'
                     });
                }
            })


        });

})




module.exports = router;