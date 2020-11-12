# Node.js API Backend using Express.js

## app.js
 
Contains main config and setup for Express, connects to MongoDB instance

## server.js

Sets up server config, binding to port and starting the request listener

## `/backend/angular`

This directory contains the production files for the angular project. When a new version is ready to be deployed, calling `ng build --prod` will update these files and then if the API is hit with no matching paths, the application will serve the angular files.

## Middleware

Functions that can be called between the initial API hit and before any code executes on the corresponding API endpoint.

## Models

Contains files that define MongoDB schemas

## Routes

Contains files that logically partition API routes
