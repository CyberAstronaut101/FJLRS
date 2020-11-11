const MessagingResponse = require('twilio').twiml.MessagingResponse

const methods = {
    run: function(request, response) {
        // Strip the trigger word from the response.
        const message = request.Body.split(' ').slice(1).join(' ')
        //console.log(request);

        // Create a new response object to send to Twilio.
        const twiml = new MessagingResponse()

        // Add the message to it, and send it back to Twilio.
        twiml.message(message)
        response.set('Content-Type', 'text/xml')
        response.send(twiml.toString()) 
    },
  
    meta: {
      aliases: ['test', 'control']
    }
  };
  
  module.exports = methods;
  