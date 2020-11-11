# FayjonesLabApp

## Preparing Development Environment

Node Version Manager [Windows Downloads](https://github.com/coreybutler/nvm-windows/releases) running node v12.18.3 currently

Using Angular 8 currently: `npm install -g @angular/cli`

Download MongoDB Compass - will give MongoDB connection creds in discord

Using Visual Studio Code w/ plugins:

* Todo Tree to view all lines with a `TODO` in the comment

## Technology Stack

MEAN (MongoDB, Express.js, Angular, Node.js) used to build this application.

---

## Directory Structure

### API Node.js Files
Below is the `backend` directory, which holds the Node.js API and serves the production build of the Angular SPA
```
.
├── angular
│   ├── THIS IS THE PROD BUILD OUTPUT FILES FROM THE ANGULAR PROJECT
├── middleware
│   └── check-auth.js
├── models
│   ├── dept_3dprinters.js
│   ├── dept_digitallab.js
│   ├── dept_operatingHours.js
│   ├── dept_operatingOverrides.js
│   ├── dept_woodshop.js
│   ├── deptInfo.js
│   ├── email.js
│   ├── emailHistory.js
│   ├── laser.js
│   ├── laserEvent.js
│   ├── news.js
│   ├── printerHistory.js
│   ├── printerMachine.js
│   ├── printerQueue.js
│   ├── registeredTextUser.js
│   ├── resetPassword.js
│   ├── todo.js
│   └── user.js
├── routes
│   ├── texteverything
│   │   ├── index.js
│   │   ├── plotters.js
│   │   ├── pluginLoad.js
│   │   ├── register.js
│   │   └── user.js
│   ├── buisnessHours.js
│   ├── calendar.js
│   ├── depts.js
│   ├── email.js
│   ├── home.js
│   ├── laser.js
│   ├── news.js
│   ├── printerLab.js
│   ├── printerQueue.js
│   ├── todos.js
│   └── user.js
├── utils
│   └── helpers.js
├── app.js
└── server.js
```

### Angular Files

```
.
├── app
│   ├── admin
│   │   ├── admin
│   │   │   ├── admin.component.css
│   │   │   ├── admin.component.html
│   │   │   ├── admin.component.spec.ts
│   │   │   └── admin.component.ts
│   │   ├── manage-alert-emails
│   │   │   ├── emailhistorytable
│   │   │   │   ├── emailhistorytable.component.css
│   │   │   │   ├── emailhistorytable.component.html
│   │   │   │   ├── emailhistorytable.component.spec.ts
│   │   │   │   ├── emailhistorytable.component.ts
│   │   │   │   ├── pager.service.ts
│   │   │   │   └── test.scss
│   │   │   ├── email.service.spec.ts
│   │   │   ├── email.service.ts
│   │   │   ├── manage-alert-emails.component.css
│   │   │   ├── manage-alert-emails.component.html
│   │   │   ├── manage-alert-emails.component.spec.ts
│   │   │   └── manage-alert-emails.component.ts
│   │   ├── manage-depts
│   │   │   ├── manage-depts.component.css
│   │   │   ├── manage-depts.component.html
│   │   │   ├── manage-depts.component.spec.ts
│   │   │   ├── manage-depts.component.ts
│   │   │   └── manage-depts.service.ts
│   │   ├── manage-hours
│   │   │   ├── manage-hours.component.css
│   │   │   ├── manage-hours.component.html
│   │   │   ├── manage-hours.component.spec.ts
│   │   │   └── manage-hours.component.ts
│   │   ├── manage-news
│   │   │   ├── manage-news.component.css
│   │   │   ├── manage-news.component.html
│   │   │   ├── manage-news.component.spec.ts
│   │   │   ├── manage-news.component.ts
│   │   │   └── news.service.ts
│   │   ├── manage-users
│   │   │   ├── manage-users.component.css
│   │   │   ├── manage-users.component.html
│   │   │   ├── manage-users.component.spec.ts
│   │   │   ├── manage-users.component.ts
│   │   │   └── user.service.ts
│   │   ├── admin.guard.ts
│   │   ├── admin.module.ts
│   │   └── admin.routing.ts
│   ├── auth
│   │   ├── kiosklogin
│   │   │   ├── kiosklogin.component.css
│   │   │   ├── kiosklogin.component.html
│   │   │   ├── kiosklogin.component.spec.ts
│   │   │   └── kiosklogin.component.ts
│   │   ├── login
│   │   │   ├── login.component.css
│   │   │   ├── login.component.html
│   │   │   └── login.component.ts
│   │   ├── resetpassword
│   │   │   ├── resetpassword.component.css
│   │   │   ├── resetpassword.component.html
│   │   │   ├── resetpassword.component.spec.ts
│   │   │   └── resetpassword.component.ts
│   │   ├── signup
│   │   │   ├── signup.component.css
│   │   │   ├── signup.component.html
│   │   │   └── signup.component.ts
│   │   ├── auth-data.model.ts
│   │   ├── auth-interceptor.ts
│   │   ├── auth-routing.module.ts
│   │   ├── auth.guard.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── autofocus.directive.spec.ts
│   │   ├── autofocus.directive.ts
│   │   ├── login-data.model.ts
│   │   └── user.model.ts
│   ├── digitalshop
│   │   └── digitalshop.module.ts
│   ├── directives
│   │   └── enforceSaneTime.directive.ts
│   ├── employee
│   │   ├── employee
│   │   │   ├── employee.component.css
│   │   │   ├── employee.component.html
│   │   │   ├── employee.component.spec.ts
│   │   │   └── employee.component.ts
│   │   ├── employee-routing.module.ts
│   │   └── employee.module.ts
│   ├── error
│   │   ├── error.component.css
│   │   ├── error.component.html
│   │   ├── error.component.spec.ts
│   │   └── error.component.ts
│   ├── home
│   │   ├── homeview
│   │   │   ├── homeview.component.css
│   │   │   ├── homeview.component.html
│   │   │   ├── homeview.component.spec.ts
│   │   │   └── homeview.component.ts
│   │   ├── home.module.ts
│   │   ├── home.routing.ts
│   │   └── home.service.ts
│   ├── machine-printer
│   │   ├── machine-printer.component.css
│   │   ├── machine-printer.component.html
│   │   ├── machine-printer.component.spec.ts
│   │   └── machine-printer.component.ts
│   ├── navigation
│   │   ├── navigation.component.css
│   │   ├── navigation.component.html
│   │   ├── navigation.component.spec.ts
│   │   └── navigation.component.ts
│   ├── printerlab
│   │   ├── printerlab.module.ts
│   │   └── printerlab.service.ts
│   ├── shared-components
│   │   ├── confirmation-dialog
│   │   │   ├── confirmation-dialog.component.css
│   │   │   ├── confirmation-dialog.component.html
│   │   │   ├── confirmation-dialog.component.spec.ts
│   │   │   └── confirmation-dialog.component.ts
│   │   ├── new-dept-info-dialog
│   │   │   ├── new-dept-info-dialog.component.css
│   │   │   ├── new-dept-info-dialog.component.html
│   │   │   ├── new-dept-info-dialog.component.spec.ts
│   │   │   └── new-dept-info-dialog.component.ts
│   │   ├── newemailaccount
│   │   │   ├── newemailaccount.component.css
│   │   │   ├── newemailaccount.component.html
│   │   │   ├── newemailaccount.component.spec.ts
│   │   │   └── newemailaccount.component.ts
│   │   ├── news-view
│   │   │   ├── news-view.component.css
│   │   │   ├── news-view.component.html
│   │   │   ├── news-view.component.spec.ts
│   │   │   └── news-view.component.ts
│   │   └── user-view
│   │       ├── user-view.component.css
│   │       ├── user-view.component.html
│   │       ├── user-view.component.spec.ts
│   │       └── user-view.component.ts
│   ├── shop
│   │   └── shop.module.ts
│   ├── student
│   │   ├── student
│   │   │   ├── student.component.css
│   │   │   ├── student.component.html
│   │   │   ├── student.component.spec.ts
│   │   │   └── student.component.ts
│   │   ├── student-routing.module.ts
│   │   └── student.module.ts
│   ├── woodshop
│   │   ├── wood-kiosk
│   │   │   ├── wood-kiosk.component.css
│   │   │   ├── wood-kiosk.component.html
│   │   │   └── wood-kiosk.component.ts
│   │   ├── woodshop-routing.module.ts
│   │   ├── woodshop.module.ts
│   │   └── woodshop.service.ts
│   ├── angular-material.module.ts
│   ├── app-routing.module.ts
│   ├── app.component.css
│   ├── app.component.html
│   ├── app.component.spec.ts
│   ├── app.component.ts
│   ├── app.module.ts
│   └── error-interceptor.ts
├── assets
│   ├── img
│   │   ├── all static assets here ....
│   ├── .gitkeep
│   ├── interfaces.ts
│   └── isntall.gif
├── environments
│   ├── .gitignore
│   ├── environment.prod.ts
│   └── environment.ts
├── custom-theme.scss
├── favicon.ico
├── index.html
├── main.ts
├── polyfills.ts
├── styles.css
└── test.ts
```


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

