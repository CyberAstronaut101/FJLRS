const app = require("./app");
const debug = require("debug")("node-angular");
const http = require("http");

/* ====================================================

Node Server Setup

This file will make sure it can get ownership of the port,
checking process user level and if the port is already in use
making sure port 8080 or on process.env.PORT

The Express.js Routing logic for requests is located in `app.js`

and app is instantiated w/ const app = express(); and is exposed
to other files with the `module.exports = app;` at the bottom of the apps

==================================================== */


const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};


const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
};

var portOrigin = process.env.PORT || 8080
const port = normalizePort(portOrigin || "3000");
app.set("port", port);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port, '0.0.0.0');