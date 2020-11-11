const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const EmailAccount = require("../models/email");
const EmailHistory = require("../models/emailHistory");

const nodemailer = require("nodemailer");

const helpers = require("../utils/helpers");

/*
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  *GET @ /api/email
      get the alert and admin email accounts
  Only called from admin-menu on the email-manage component

  Called from email-manage-component in admin menu

  Returns:
    app systemEmail id and email address
    array of adminEmailAccounts

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
*/
/**
 * @swagger
 * "/api/email:
 *   get:
 *     tags: [Email]
 *     summary: "Returns all student Accounts. Must be authenticated to access this API call."
 *     consumes: [application/json]
 *     produces: [application/json]
 */
router.get("", checkAuth, (req, res, next) => {
  console.log("GET @ /api/email");
  EmailAccount.find()
    .then(documents => {
      console.log("Email Accounts retrieved:");

      // Sanatizing the password for the systemApp email account, only one with stored passwd
      // documents.forEach(element => {
      //   element.password = null;
      // });

      documents = documents.map(elem => {
        return {
          id: elem._id,
          email: elem.email,
          password: null,
          type: elem.type
        };
      });

      console.log(documents);

      EmailHistory.find()
        .then(emailHistDocuments => {
          console.log("Email History DB entries retrieved:");
          // console.log(emailHistDocuments);
          // change _id to id for the client side data

          emailHistDocuments = emailHistDocuments.map(elem => {
            return {
              id: elem._id,
              from: elem.from,
              to: elem.to,
              subject: elem.subject,
              html: elem.html,
              sendDate: elem.sendDate,
              rc: elem.rc
            };
          });

          res.status(200).json({
            message:
              "All Email Accounts and Email History fetched successfully!",
            emailAccounts: documents,
            emailHistoryItems: emailHistDocuments
          });
        })
        .catch(err => {
          console.log("!!! Error getting email history from db...");
          console.log(err);
        });
    })
    .catch(err => {
      console.log(
        "There was an error retrieving all email accounts from the DB"
      );
      console.log(err);
      res
        .status(403)
        .json({ message: "Error on API end, no emails retrieved from db" });
    });
});


// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// POST @ /api/email/createAccount
//      req.body will hold the EmailAccount info
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
router.post("/createAccount", checkAuth, (req, res, next) => {
  console.log("\n");
  console.log("email.js: Create New Email Account in DB");
  console.log(req.body);

  const newEmail = new EmailAccount({
    email: req.body.email,
    password: req.body.password,
    type: req.body.type
  });

  // need to send additional emailId to with the response
  newEmail
    .save()
    .then(createdEmail => {
      console.log("Success! Saved Email Account to DB:");
      console.log(createdEmail);
      res.status(200).json({
        emailId: createdEmail._id,
        severity: "success",
        summary: "Success!",
        detail: "New Email Account saved to DB successfully"
      });
    })
    .catch(err => {
      console.log("There was an error saving this account to the DB");
      console.error(err);
      res.status(200).json({
        severity: "error",
        summary: "Error Saving Email...",
        detail: err
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

  EmailAccount.findOneAndUpdate(
    { _id: req.params.id },
    { password: req.body.password }
  ).then(result => {
    console.log(result);
    if (result.n == 0) {
      console.log("No Update to email account");
      return res.status(401).json({ message: "Sysadmin Email not Updated!" });
    } else {
      console.log("update emailAccount successful");
      return res.status(200).json({
        severity: "success",
        summary: "Success!",
        detail: "Alert Email Account Password Updated Successfully"
      });
    }
  });
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

  EmailAccount.findOneAndUpdate(
    { _id: req.params.id },
    { email: req.body.email }
  ).then(result => {
    console.log(result);
    if (result.n == 0) {
      console.log("No Update to sysadmin alert email account");
      return res.status(200).json({
        severity: "error",
        summary: "Wait!",
        detail: "No Change Occured to System Admin Email Address"
      });
    } else {
      console.log("update emailAccount successful");
      let detailMsg =
        "Update SysAdmin Account id '" +
        req.params.id +
        "' to email: '" +
        req.body.email +
        "' Successful!";
      return res.status(200).json({
        severity: "success",
        summary: "Success!",
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

  EmailAccount.findOneAndDelete({ _id: req.params.id }).then(result => {
    console.log("Delete Account Details");
    console.log(result);

    if (!result) {
      console.log("find and delete email account failed");
      return res.status(200).json({
        severity: "error",
        summary: "Error!",
        detail: "Delete Email FAILED!"
      });
    } else {
      console.log("delete eamil account successful!");
      return res.status(200).json({
        severity: "warn",
        summary: "Success!",
        detail: "Deleted Email Account From DB Successfully!"
      });
    }
  });
});

/*
 =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 POST @ /api/email/sendemail/
      Will use the system alert email account
      Email body, recipients, will be within the bodof the req

    Expecting emailBody with post {
        toEmail: string,
        subject: string,
        body: string (html text formatting accepted)
    }

 =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
router.post("/sendemail", checkAuth, (req, res, next) => {
  console.log("\nPOST @ /api/email/sendemail");

  // console.log(req.body);
  // Create the emailBody Here
  const emailBody = {
    to: req.body.toEmail,
    subject: req.body.subject,
    html: req.body.body
  }

  console.log(emailBody);
  // Then pass the emailBody to the sendEmail which will 
  helpers.sendEmailFromAlertAdminAccount(emailBody, res);

});


// function sendEmailFromAlertAdminAccount(emailBody, res) {
//     console.log('sendEmailFromAlertAdminAccount Helper function');

//     EmailAccount.findOne({ type: "alertadmin" }).then(result => {
//         console.log("Result from getting sys app email: ");
//         console.log(result);
    
//         if (!result) {
//           // the result is null
//           return res.status(200).json({
//             severity: "warn",
//             summary: "Failed!",
//             detail:
//               "Transporter email account failed Authentication, Make sure a valid System Alert Email Address Exists"
//           });
//         }
//         // TODO make the service custom to the email that is in the db
//         // do some splitting
    
//         // // Getting the 'service' programatically
//         // let fullEmail = result.email;
//         // fullEmail = fullEmail.split("@");
//         // fullEmail = fullEmail[1].split(".");
//         // let service = fullEmail[0];
//         // // Not using this right now as I was trouble shooting the email server
    
//         // Create the transport object
//         var transporter = nodemailer.createTransport({
//           service: "gmail",
//           host: "smtp.gmail.com",
//           auth: {
//             user: result.email,
//             pass: result.password
//           }
//         });
    
//         // Temp for the offloading of sending
//         // var mailOptions = emailBody;
//         var mailOptions = {
//           from: result.email,
//           to: emailBody.to,
//           subject: emailBody.subject,
//           html: emailBody.html
//         };
    
//         console.log("Email attempting to be sent....");
//         console.log(mailOptions);
//         transporter.sendMail(mailOptions, function(error, info) {
//           if (error) {
//             console.log("\n#@$#@#$ Sending Error Response to the srvv (401 error)");
//             console.log(error.response);
    
//             // Save This Email to the EmailHistoryDB
//             // helpers.saveEmailHistoryItem( mailOptions, error.response);
    
//             transporter.close();
//             if ("Username and Password not accepted." in error) {
//               return res.status(200).json({
//                 severity: "error",
//                 summary: "Error!",
//                 detail: "Username and Password not accpeted"
//               });
//             }
//             return res.status(200).json({
//               severity: "error",
//               summary: "Error!",
//               detail: error.response
//             });
//           } else {
//             console.log("!!!Email was sent successfully: " + info.response);
//             // helpers.saveEmailHistoryItem( mailOptions, info.response);
//             console.log("\tattempting to save the email history item...");
    
//             helpers.saveEmailHistoryItem(mailOptions, info.response, function(
//               err,
//               historySavedStatus
//             ) {
//               if (err) {
//                 console.log("Error with saving history item...");
//                 return res.status(200).json({
//                   severity: "error",
//                   summary: "Email API Server",
//                   detail: "Error... :"
//                 });
//               }
    
//               console.log("Response from saving email history item in email.js:");
//               console.log(historySavedStatus);
    
//               transporter.close();
    
//               return res.status(200).json({
//                 severity: "success",
//                 summary: "Success!",
//                 detail:
//                   "Email sent to " +
//                   mailOptions.to +
//                   " with returnCode: " +
//                   historySavedStatus.rc,
//                 emailHistory: historySavedStatus
//               });
//             });
//           }
//         });
//       });

// };

// Moved to utils/helpers
// var saveEmailHistoryItem = function(mailOptions, rc, callback) {
//   console.log("\n\n...simulating db write...");
//   callback(null, "sAvEd!!");
// }

module.exports = router;
// exports.sendEmailFromAlertAdminAccount = sendEmailFromAlertAdminAccount;
