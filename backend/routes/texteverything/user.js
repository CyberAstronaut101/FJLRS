/*
   Executed if the command 'register' is recieved
   
   Command valid paths

   register Elliot Mason, ejmason@uark.edu --> {
       firstName: ,
       lastName: ,
       email: ,
       phoneNumber: +1....
   }
    -- Will create a user associated with this phone number in the db with the email passed

    Not sure if this will be intertwined with the app, but i already have the phone number there

*/

const RegisteredUsers = require('../../models/registeredTextUser')
const MessagingResponse = require('twilio').twiml.MessagingResponse

const methods = {
    run: function(request, response) {
        // Strip the trigger word from the response.
        const message = request.Body.split(' ').slice(1).join(' ')
        console.log("############ New 'user' REQUEST ############");
        console.log(request);

        // If the command is  `register help` then 
        if (request.Body.toLowerCase() == "register help") {
            const twiml = new MessagingResponse();
            let message = "To Register a name and email to this phone number, respond with a text message formatted: \n \'register FirstName LastName ADusername@email.uark.edu\'"

            twiml.message(message);
            response.set('Content-Type', 'text/xml')
            response.send(twiml.toString())
  
        } else {
            // The command is not 'register help' or 'Register Help'
            // register usermod <emailRegisteredWith>


            // Verify that the passed command has a 
            // firstName
            // lastName
            // uarkEmail!

            // slice n dice

            let recievedCommand = request.Body.split(' ').splice(1)
            console.log(recievedCommand)
            if(recievedCommand.length == 0) {
                console.log("Only 'user' in requested text message. Returinging");
                const twiml = new MessagingResponse();
                let message = "Command invalid. Only 'user' recieved, send 'user help'. \n\nNo Actions Preformed!"

                twiml.message(message);
                response.set('Content-Type', 'text/xml')
                response.send(twiml.toString())
            }

            let firstName = recievedCommand[0]
            let lastName = recievedCommand[1]

            // need to make sure that the email is formatted as @email.uark.edu
            let uarkEmail = recievedCommand[2]

            // TODO ADD AN ADMIN REUQEST PATH THAT IS QUIET

            let resMessage = "Recieved data for new register person ---> FirstName: " + firstName + " , LastName: " + lastName + " , uarkEmail: " + uarkEmail


            // Make sure the names are valid
            if(firstName && lastName) {
                // the first and last name are valid
                console.log("Valid first and last names... checking email valididty");

                // check validity of the email address
                if(uarkEmail.includes("@email.uark.edu")) {
                    // valid email address
                    console.log("Register email is correct, contains '@email.uark.edu'!");
                    console.log("Saving with phoneNumber: ");
                    console.log(request.From);
                    
                    // All info exists, save this user to the db!
                    let newRegisteredUser = new RegisteredUsers({
                        firstName: firstName,
                        lastName: lastName,
                        phoneNumber: request.From,
                        uarkEmail: uarkEmail,
                        trainedOn: ""
                    })
                    newRegisteredUser.save()
                        .then(res => {
                            console.log("response from saving new registered user: ");
                            console.log(res);
                            let resMessage = "Your number has been successfully Registered. Thank you: " + lastName + ', ' + firstName;
                            const twiml = new MessagingResponse()
                            twiml.message(resMessage);
                            return response.send(twiml.toString());
                        })
                        .catch(err => {
                            console.log("Error on saving new registeredUser!");
                            console.log(err);
                            let resMessage = "There is an error on registered. You are trying to re-register. Please contact Admin for help!" ;
                            const twiml = new MessagingResponse()
                            twiml.message(resMessage);
                            return response.send(twiml.toString());
                        })

                } else {
                    // the email address is invalid. Send text back?
                    let resMessage = "Your passed email address does not include @email.uark.edu. No Actions." ;
                    const twiml = new MessagingResponse()
                    twiml.message(resMessage);
                    return response.send(twiml.toString());
                }
            } else {
                // If either the first or last name is invalid?

                let resMessage = "Either your firstname or last name was invalid. No Actions." ;
                const twiml = new MessagingResponse()
                twiml.message(resMessage);
                return response.send(twiml.toString());
            }


            // const twiml = new MessagingResponse()
            // twiml.message(resMessage);
            // return response.send(twiml.toString());

            // Add the message to it, and send it back to Twilio.
            // twiml.message(message)
            // response.set('Content-Type', 'text/xml')
            // response.send(twiml.toString()) 
        }
        // Figure out how to parse efficiently

        //  Make a mongoose object

        // Save to mongod  -- Get mongod connection check in the app.js 

        // if failed, say why

        // if successful, send text back 

        // Create a new response object to send to Twilio.
        
    },
  
    meta: {
      aliases: ['user']
    }
  };
  
  module.exports = methods;
  