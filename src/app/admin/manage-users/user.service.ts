import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Subject } from 'rxjs';
import { map } from 'rxjs/operators'


// import { Todo } from './todo.model';
import { User } from '../../auth/user.model';

import { environment } from "../../../environments/environment";
import { PMessage } from '../../../assets/interfaces';
import { Router } from '@angular/router';

const BACKEND_URL = environment.apiUrl + "/user";

@Injectable({providedIn: 'root'})
export class UserService {
    private users: User[] = []; // maybe use typescript with new model?

    private usersUpdated = new Subject<User[]>();

    // For any components that need primeNG messaging 
    private pMessages: PMessage[] = [];
    private messagesUpdated = new Subject<PMessage[]>();

    constructor(
        private http: HttpClient,
        public router: Router) {}

    getUserUpdateListener(){
        return this.usersUpdated.asObservable();
    }

    getUserMessagesUpdatedListener() {
        return this.messagesUpdated.asObservable();
    }
    
    // Returns ALL users in the users collection
    getUsers(){
        this.http
            .get<{message: string, users: User[]}>(BACKEND_URL)
            
            .subscribe((userData) => {
                console.log("Users: ");
                console.log(userData);

                // set the news stored in instance of this service
                this.users = userData.users;
                // push out copy of the news to all listening components
                this.usersUpdated.next([...this.users]);
            })
    }



    /*================================
        Update training levels for user

     ================================*/
     updateTrainingLevels(user: User) {
         console.log("user-service --- updateTrainingLevels");
         console.log(user);

         let url = BACKEND_URL + '/updateUserTraining';

         // make the call to the API server
         this.http
            .post<{message: string}>(url, user)
            .subscribe(resData => {
                console.log("returned from the API server:");
                console.log(resData);

                // update the local users array with the new values

            });

     }

     getUserWoodshopLevels(userId: string) {
         console.log("UserService::getUserWoodshopLevels("+userId+")");

         let url = BACKEND_URL + '/getWoodshopLevels'

         // GET REQUEST
         this.http
            .get<{message: string}>(url)
            .subscribe(resData => {
                console.log("User Woodshop Training Levels Returned from API:");
                console.log(resData);

                // TODO take the array of boolean values for training level 1,2,3 
                // and display them on the sign in!

                // Also update and show the current number of student in the 
                // woodshop / Keep a running tab on ppl that are currently there

                



            })
     }


    /*================================
        Request Password Reset Email

            Starts the workflow for resetting a user account password

            Params are the uid and the userEmail

            TODO change to just the userEmail, let the backend find the uid if it exists

    ================================*/
    startPasswordResetWorkflow(userEmail: string) {
        console.log('UserService::startPasswordResetWorkflow( ' + userEmail + ')');

        let url = BACKEND_URL + '/startPasswordReset/' + userEmail;
        // Make a request to the API server with the uid to start the flow
        this.http
            .get<{message: PMessage}>(url)
            .subscribe(resData => {
                console.log('returned from API on startpasswd reset workflow:');
                console.log(resData);

                this.pMessages = [];
                this.pMessages.push(resData.message);
                this.messagesUpdated.next([...this.pMessages]);
            });
    }

    /*================================
        Check If User can reset their password

        Will take a uid and check if there is a valid token,
            if yes, then will return a message and a value for isValidResetRequest
            is no, send back mbessage and set isValidResetRequest to false

        

    ================================*/
    verifyCanResetPassword(uid: string) {
        console.log('UserService:;verifyCanResetPassword(' + uid + ')');

        this.http
            .get<{message: PMessage }>(BACKEND_URL + '/verifyCanResetPassword/' + uid)
            .subscribe(resData => {
                console.log('data returned from API verifyCanResetPassword request');
                console.log(resData);

                this.pMessages = [];
                this.pMessages.push(resData.message);
                this.messagesUpdated.next([...this.pMessages]);
            });
    }

    updateUserAccountPassword(userId: string, newPasswd: string) {
        console.log('Updating user account password with ' + newPasswd);

        // Make request to the backend @ /api/user/:id/:newPasswd
        this.http
            .get<{message: PMessage}>(BACKEND_URL + '/passwdUpdate/' + userId + '/' + newPasswd)
            .subscribe(resData => {
                console.log('Data returned from GET@/api/user/passwdUpdate/:id/:newPasswd');
                console.log(resData);




                // Add to messages, then redirect
                this.pMessages = [];
                this.pMessages.push(resData.message);
                this.messagesUpdated.next([...this.pMessages]);

                // Wait 2 seconds on success then redirect to the login page
                setTimeout(() => {
                    this.router.navigate(['/auth/login']);
                }, 2000);


            });

    }



    getUserAdminPanelRender(uid: string) {
        console.log("Requesting all history, user notes for user with ID: " + uid );

        // TODO

    }
    
}