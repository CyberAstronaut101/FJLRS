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

try {
    config_data = require('./config/config.example.json');
} catch (e) {
    console.log("===================================================");
    console.log("Looks like app.js has an error trying to import the");
    console.log("Config file at /backend/config/");
    console.log("Make sure that the file it is trying to require()");
    console.log("Exists and has a matching name.");
    console.log("===================================================");
    process.exit(1);
}

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


/**================================================== *
 * ==========  Swagger API Documentation Setup  ========== *
 * ================================================== */
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


/* =======  End of Swagger API Documentation Setup  ======= */




// Setup port, ip, monogoURL
var port = process.env.PORT || 8080,
    ip   =  '0.0.0.0' || process.env.IP,
    mongoURL =  process.env.MONGO_URL || config_data.mongoURL,
    mongoURLLabel = "";




/**================================================== *
 * ==========  MongoDB Connection Setup  ========== *
 * ================================================== */
var db = mongoose.connection;
db.on('error', function callback() {
    console.error.bind(console, 'connection error:');
    /*
        If this section executes, it means that the connection to the MongoDB instance failed
        This could be because there is no config file under /backend/config/ that has a valid mongoURL
        or that the MongoDB atlas instance is down - but this reason is highly unlikely.
        For now, I am just going to add a nice message to the console that will address the config issue
    */
    console.log();
    console.log("=================================================");
    console.log("woooah, looks like the API cannot successfully");
    console.log("connect to the MongoDB instance. Make sure that ");
    console.log("the mongoURL in the config file is correct");
    console.log("=================================================");
    // Killing API process b/c the db is down. 
    process.exit(1);

});
db.once('open', function callback () {
    console.log("Connected to Mongodb Instance");
    console.log("Accepting connections to webapp @ port " + port)

});

mongoose.connect(mongoURL, {useNewUrlParser : true});
mongoose.set('useFindAndModify', false); // https://mongoosejs.com/docs/deprecations.html#-findandmodify-

/* =======  End of MongoDB Connection Setup  ======= */


/**================================================== *
 * ==========  GridFS MongoDB File Storage Setup  ========== *
 * ================================================== */
// https://www.npmjs.com/package/multer-gridfs-storage
// https://www.freecodecamp.org/news/gridfs-making-file-uploading-to-mongodb/
// This block initializes the gridfs storage engine

/* =======  End of GridFS MongoDB File Storage Setup  ======= */



/**================================================== *
 * ==========  ExpressJS Request Parsing Setup  ========== *
 * ================================================== */
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

/* =======  End of ExpressJS Request Parsing Setup  ======= */



/**================================================== *
 * ==========  Configure API Route Files  ========== *
 * ================================================== */

const todosRoutes = require("./routes/todos");
const userRoutes = require("./routes/user");
const newsRoutes = require("./routes/news");
const emailRoutes = require("./routes/email");
const calendarRoutes = require("./routes/calendar");
const materialRoutes = require("./routes/material");
const printQueueRoutes = require("./routes/printerLab");
const printerMgmnt = require("./routes/printer");

// The files above are then used here to define which request paths they should handle
app.use("/api/todos", todosRoutes);
app.use("/api/user", userRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/material", materialRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/printlab", printQueueRoutes);
app.use("/api/printer", printerMgmnt);


// var swaggerFrontEndOptions = {explorer: true}
// This serves the swagger docs @ :/api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// This serves the config file for debugging and testing purposes
app.get('/swagger.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  })



/* =======  End of Configure API Route Files  ======= */


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
