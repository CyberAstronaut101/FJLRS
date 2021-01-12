# FayjonesLabApp

## Preparing Development Environment

Node Version Manager [Windows Downloads](https://github.com/coreybutler/nvm-windows/releases) running node v12.18.3 currently

Using Angular 8 currently: `npm install -g @angular/cli`

Download MongoDB Compass - will give MongoDB connection creds in discord

Using Visual Studio Code w/ plugins:

## Technology Stack

MEAN (MongoDB, Express.js, Angular, Node.js) used to build this application.

#### Accessing MongoDB shell

First Navigate to Resources->Secrets->nodejs-mongo-persistent

This Secret should have 3 entries, the `database-admin-password`, `database-password`, and `database-user`

If you then naviagate to the MongoDB Pod -> Terminal

To open the MongoDB shell: `mongo` 

To Authenticate as admin user: `db.auth("admin", "database-admin-password-from-secret-here")`

### Workflow Descriptions

#### Requesting a user account password reset

There will be no interface that an admin user can directly create a new password on a user account. Instead, the user will be given the means to reset the password. The workflow to accomplish this is as follows:

1. Create Reset Password Token
   
   The ResetPassword token is simply an entry in mongoDB, in which the uid entry holds which user account to reset the password on
   ```
   {
      _id: resetEmailDBEntry,
      uid: userToResetPassword
   }
   ```

2. Send Email to User

   The system will then send an email with a URL in the form of 
   ```
   http://ip-of-fjlrs-app-server:/auth/resetPassword/:id
   ```
   Where :id is the _id of the ResetPassword entry saved in MongoDB

3. User will click on link
   
   Webapp opens with a no checkAuth route to the resetPassword component.

   This component will only have data if the :id corresponds to a ResetPassword entry, and then the user is able to be indexed with the `uid` field

   The User will then enter a new password twice, and the form will salt then update the password for the User db entry

   

### Module Layout
* Admin Module
   * Manage Alert Email Component
   * Manage Hours Component
   * Manage News Component
   * Manage Users Component
* Student Module
   * Student Component
* Auth Module
   * Login Component
   * Signup Component
* Home Module
   * Homeview Component
* Woodshop Module
* DigitalShop Module
* Navigation Component

* Error Component

## Conversion From Angular7 to Angular8

This repo is the rebuild of the FayJones LRS app built in Angular7 to Angular 8

This implementation will be more lightweight and less of a testing ground as the previous version. 

### RoadMap



### Digital Lab


### Wood Lab


### 3D Printers


### User Management


### Stats


### Admin Panel



### Good Links

https://coderwall.com/p/mk18zq/automatic-git-version-tagging-for-npm-modules

https://www.angularjswiki.com/angular/how-to-use-font-awesome-icons-in-angular-applications/

https://www.ag-grid.com/angular-getting-started/









# Default Readme from Angular Below

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.0.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Uark Cluster

https://console.origin.uark.edu:8443/

fjlrs.origin.uark.edu

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

