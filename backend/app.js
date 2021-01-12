const path = require('path');
// holds the express app
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Swagger API Docs
const swaggerUi = require('swagger-ui-express');
const  swaggerJSDoc = require('swagger-jsdoc');

// IMPORTANT !!!!!! IMPORTANT
// This is where you define which config file that is normally hidden to pull the DB credentials from
// config_data = require('./config/config.example.json');
// config_data = require('./config/config.development.json');
const config_data = require('./config/config.production.json');

/*=================================================================================
Express.js Setup

    1. Setup Swagger 
    2. Setup Port, IP, and MongoURL values
    3. Connect to MongoDB via mongoose
    4. TODO setup forgot password process.env value logic
    5. Setup bodyParser -> json
    6. Setup static folder @ :/angular <> This folder holds the production build of the angular app 
                                        (ng build --prod) which is served by the Node.js API server
                                        if no arguments are provided (eg localhost:8080/ vs. localhost:8080/api/... )
    7. Setup CORS
    8. Handle express routes
    9. Serve the SPA is the incoming request is not an API reuqest

Helpful Links:
    Swagger JSDOC API Document Generator: https://github.com/Surnet/swagger-jsdoc/blob/master/docs/GETTING-STARTED.md
    Mongoose MongoDB Connector: https://mongoosejs.com/docs/
    
Express instantiated below
VVVVVVVVVVVVV
=================================================================================*/
const app = express();

/*
    Swagger is an OpenAPI documentation application that makes use of jsdoc within
    api documents to auto generate a api-docs website.

    This is available at localhost:8080/api-docs && the generated config file @ localhost:8080/swagger.json
                ( or fjlrs.com or whatever domain is used for the application )
    See TODO ADD SWAGGER DOCS + CODE SNIPPIT WORDLIST
*/
var swaggerDefinition = {
    swagger: '2.0',
    info: {
        title: 'Fay Jones Lab Request System API',
        version: '0.0.69',
        description: 'RESTful API Documentation',
    },
    host: 'fjlrs.com',
    basePath: '/',
};

// TODO make a list, need to supply full file path, relative ./routes/user.js did not work
var userApiDocs = path.join(__dirname, "routes/user.js");
// console.log(userApiDocs);

// options for the swagger docs
var swaggerOptions = {
    swaggerDefinition,
    // path to the API docs
    apis: [userApiDocs],
    // Tags are how we can seperate the api calls into groups
    tags: [
        {
            name: "Users",
            description: "All things w/ user management"
        },
        {
            name: "File Operations",
            description: "File management API calls"
        },
        {
            name: "Email",
            description: ""
        }
    ]
};

// Initialize swaggerJSDoc, which will loop through all the swaggerOptions.apis filepaths for and jsdoc tagged with @swagger
// If if throws errors here, error lies within the routes/*.js file @swagger definition
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Setup port, ip, monogoURL
var port = process.env.PORT || 8080,
    ip   =  '0.0.0.0' || process.env.IP,
    mongoURL =  process.env.MONGO_URL || config_data.mongoURL,
    mongoURLLabel = "";

// Create the mongoose connection -- MON
var db = mongoose.connection;
db.on('error', function callback() {
    console.error.bind(console, 'connection error:');
    console.error("TODO ALERT ADMIN THAT THE DB IS OFFLINE");
    // Wait like 20 seconds and then try again
    // wait(10);

});
db.once('open', function callback () {
    console.log("Connected to Mongodb Instance");
    console.log("Accepting connections to webapp @ port " + port)
});

mongoose.connect(mongoURL, {useNewUrlParser : true});
mongoose.set('useFindAndModify', false); // https://mongoosejs.com/docs/deprecations.html#-findandmodify-

// So we also have a password reset link that is set as a process env value

// Old config from running docker images on OpenShift platform
// if(mongoURL){
//     console.log('mongoURL from openshift is: ' + mongoURL);
//     // Set reset password link to point to the okc cluster
//     process.env.resetPasswordLink = "http://fjlrs.origin.uark.edu/auth/resetpassword/";
// } else {
//     console.log('mongoURL was empty, setting to local development')
//     mongoURL = 'mongodb://localhost:27017/fj_lrs_db'
//     // Set the reset password link to point to localhost development in this case
//     process.env.resetPasswordLink = "http://localhost:4200/auth/resetpassword/";
// }

// parsing requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Static folders
app.use("/", express.static(path.join(__dirname, "angular")));

// Alloc CORS -- allows one site to access another sites resources despite being under different domain names
app.use((req, res, next) => {
    res.setHeader(
        "Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader(
        "Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");

    next();
});

// Heartbeat Request Route. This is so GCP wont throw non-stop healthcheck alerts for the app
app.get('/healthcheck', (req, res) => res.send('OK'));

/*
    Defined Routes Files

    Each of these files contain the route logic for each of the topics
    More on this below..

    *** A lot of these are from other development modules, will keep for now but remove as needed ***
*/
const todosRoutes = require("./routes/todos");
const userRoutes = require("./routes/user");
const newsRoutes = require("./routes/news");
const laserRoutes = require("./routes/laser");
const emailRoutes = require("./routes/email");
const calendarRoutes = require("./routes/calendar");
const buisnessHoursRoutes = require("./routes/buisnessHours");
const printerQueueRoutes = require("./routes/printerQueue");
const homeRoutes = require("./routes/home");
const deptRoutes = require("./routes/depts.js");
// The files above are then used here to define which request paths they should handle
app.use("/api/todos", todosRoutes);
app.use("/api/user", userRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/laser", laserRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/buisnessHours", buisnessHoursRoutes);

// var swaggerFrontEndOptions = {explorer: true}
// This serves the swagger docs @ :/api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// This serves the config file for debugging and testing purposes
app.get('/swagger.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  })

// !TODO add woodshop, laserlab, and 3dprinter routes here
// All Twilio Files for TextEverything here
// app.use("/api/textmessage", textEverythingIndex);
// For Departments
const printerLabRoutes = require("./routes/printerLab.js");
app.use("/api/printerLab", printerLabRoutes);
// Added Routes for the Singular Machine and printer queue implementation
app.use("/api/printerQueue", printerQueueRoutes);
// Added Routes
app.use("/api/home", homeRoutes);
// Added Deparptment Management Routes
app.use("/api/department", deptRoutes);

/* =======================================================================
  Here is where the magic happens...

  The way express.js works is that the request will continue traveling until they 
  meet an express that can handle it.

  Since all the api routes are defined above, if a request comes in to the 
  app that IS NOT an api request (starts with /api)..

  Then we will serve index.html from the /backend/angular folder.
  This folder contains the output files from the production angular build (ng build --prod)

=======================================================================*/
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "angular", "index.html"));
});

module.exports = app;
