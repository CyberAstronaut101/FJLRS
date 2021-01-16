# FayjonesLabApp

[![build status](https://github.com/ejmason101/FJLRS/workflows/Build/badge.svg)](https://github.com/ejmason101/FJLRS/actions)

## Preparing Development Environment

Node Version Manager [Windows Downloads](https://github.com/coreybutler/nvm-windows/releases) running node v12.18.3 currently. Please ensure that your node is the correct version by running `node -v`

Using Angular 8 currently, you do not need to install angular globally, just pull down this project and run `npm install` with node v12.18.3

Download MongoDB Compass. This application is used to interface with the MongoDB Atlas instance. The connect string is shared in the developement discord under `#config-files`

## Running the project

When developing locally, two servers need to be running locally on your computer. One is the Angular development server, started via `ng serve`, and the other is the Node API, started with `npm start` OR `node ./backend/server.js`.

The Angular development server will compile and serve the website on `localhost:4200`. The API will run on `localhost:8080`.

Make sure that when you first clone, you make a copy of `./backend/config/config.example.json`, rename the copy to `config.production.json`, and replace the mongoURL with the secret shared in the discord. If you do not update the config file, the Node API will error out because a connection to the database was not successful. If you are running into any problems ping me on discord.

In the production version, the Angular project is first compiled via `ng build prod` and the output is saved to `./backend/angular`. The Node API is the main service running on the production server. If a request comes in that is not prefixed with `/api` OR does not match any of the API routes, then the Node API will serve the static production files located in `./backend/angular`.

## Technology Stack

MEAN (MongoDB, Express.js, Angular, Node.js) used to build this application.

## Libraries used within this project

There are a variety of different libraries imported to this project. See the below list for a name, description, and the link to documentation.

Material and PrimeNG are the two main component libraries that are being used in this project:

Angular Material; component library for angular projects by Google: https://material.angular.io/
PrimeNG; component library for angular projects: https://www.primefaces.org/primeng/showcase/#/


# Default Readme from Angular Below

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.0.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.


## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

