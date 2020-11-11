const express = require("express");
const router = express.Router();


/*
    Adddind dependcies for TextEverything texting capabilities

*/
const MessagingResponse = require('twilio').twiml.MessagingResponse
const twilio = require('twilio');
const Users = require('../../models/user');
//const RegisteredUsers = require('../../models/registeredTextUser') // Todo need to change this so it will register a new person in the FayJones database. Need to tie everything together
// Setup the config file to read in the API creds for Twilio
let config;
try {
  config = require('../../config/config.json');
} catch (ex) {
  console.error('Failed to load config/config.json!');
  console.error('Make sure the file exists.');
  console.error('If you need help, check out the config.example.json file.');
  // process.exit(1);
  console.error('TEXTING WILL NOT WORK WITHOUT THE CONFIG/CONFIG.json file! ')
}

// How to pass the request to the plugins. Need to change the index.js 
// see plugins.handle();
// Path To texteverything routes and plugins is 
// ./routes/texteverything/
const plugins = require('./pluginLoad');




// Post at /api/textmessage/
router.post("", (request, response) => {
    // Think this was returning false as i was using ngrok. No need to verify
    // const twilioSignature = request.header('X-Twilio-Signature');
    // validTwilioRequest = twilio.validateRequest(
    //   config.twilio.authToken,
    //   twilioSignature,
    //   config.twilio.webhookUrl,
    //   request.body
    // );
    console.log("request from text: ");
    console.log(request.body);
  
    // TODO considering all twilio requests to be valid and truthful
    validTwilioRequest = true;
  
    if (validTwilioRequest) {
      response.set('Content-Type', 'text/xml');
  
  
      // Add middleware to check if the request is valid
      console.log("\n~~~ app.js recieved text from phone number ~~~");
      console.log(request.body.From+ "\n");
      //console.log(request);
      let command = request.body.Body.split(' ')[0];
  
      // Search for the matching number
      Users.find( { phone: request.body.From.toString()})
        .then(results => {
          console.log("\n Results from registered users query");
          console.log(results)
          if(results.length == 0) {
            if(command == "register" || command == "Register" ) {
              plugins.handle(request.body, response)
            } else {
              let resMessage = "Sorry, it looks like this number is not registered yet! In order to use <insert tech service cool jazzy name here> you must register your phone number.\n\n Respond with a messaage formatted like--> \'register FirstName LastName ADusername@email.uark.edu\' -- Your email MUST contain @email.uark.edu! For more help respond with \'register help\'"
              const twiml = new MessagingResponse();
              twiml.message(resMessage);
              response.set('Content-Type', 'text/xml')
              return response.send(twiml.toString()) 
            }
          } else {
            // There are results from the DB check on phone number
            plugins.handle(request.body, response);
          }
  
  
          // Once  verifyed that the person exists within the DB of registered users, let the plugins handle the jazz
          //plugins.handle(request.body, response);
        })
        .catch(err => {
          console.log("Error from registeredUsers query");
          console.log(err);
          response.sendStatus(403);
  
        })
  
      }  // end if of validTwilioRequest
  
  
      
  
    //   if (!config.twilio.allowedNumbers.includes(request.body.From)) {
    //     console.log(
    //       `Received command from disallowed number ${
    //         request.From
    //       }. Not responding.`
    //     );
  
    //     const twiml = new MessagingResponse();
    //     response.send(twiml.toString());
    //     return;
    //   }
  
    //   plugins.handle(request.body, response);
    // } else {
    //   console.log('** validTwilioRequest false ***');
    //   console.log('Received a potentially spoofed request - dropping silently.');
    //   response.sendStatus(403);
    // }
  });


module.exports = router;
