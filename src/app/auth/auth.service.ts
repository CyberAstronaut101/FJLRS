import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

import { AuthData } from "./auth-data.model";
import { LoginData } from "./login-data.model";
import { Subject, Subscribable, Subscription } from "rxjs";
import { map } from 'rxjs/operators'

import { User } from "./user.model";

import { environment } from "../../environments/environment";

// For the ptoast message response
import { Message } from "primeng/api"



/* ========================================================================
    * AuthService
    *---------------------------------------------

    The auth service exists at the root level of the application and handles
    managment of login sessions, executin

======================================================================== */

// Construct the base 
const BACKEND_URL = environment.apiUrl + '/user'

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    // Holds the token for current log
    private token: string;              // Current session token
    private isAuthenticated = false;    // variable to track authentication status

    // private tokenTimer: NodeJS.Timer; // change to any if it complaigns
    private tokenTimer: any; // using any instead of NodeJS.Timer due to type checking errors

    private user: User;                 // Holds the user db entry after successful login

    // use subject to push auth info to compoinents that are interested
    private authStatusListener = new Subject<boolean>();

    // Add listener for any errors from calls. See https://www.primefaces.org/primeng/showcase/#/messages
    private pMessageUpdateListener = new Subject<Message>();



    constructor(private http: HttpClient,
                private router: Router) { }


    /*================================================================================
        Login/Logout Related Functions
    =================================================================================*/

    loginUser(email: string, password: string) {
        console.log('AuthService::loginUser()');

        // Create data payload to send to API
        const authData: LoginData = {
            email: email,
            password: password
        };

        // console.log(authData);

        // Make HTTP POST request to /api/user/login
        this.http
            .post<{ token: string, expiresIn: number, message: any, loggedInUser: User }>(
                BACKEND_URL + '/login',
                authData
            )
            .subscribe(response => {
                console.log('POST@/api/user/login return:');
                console.log(response); // token recieved from successful login

                const token = response.token;
                this.token = token;

                // If a token exists..
                if (token) {
                    const expiresInDuration = response.expiresIn;
                    console.log('token ttl: ' + expiresInDuration);
                    console.log('userLevel:' + response.loggedInUser.userLevel);

                    // Change auth status
                    this.isAuthenticated = true;
                    // Update the user to contain the db entry from the logged in user
                    this.user = response.loggedInUser;

                    // Set the login status to true (successful login)
                    // This authStatusListener will push an update to any component who is 
                    // specifically listening
                    this.authStatusListener.next(true);

                    // sets token timer
                    this.setAuthTimer(expiresInDuration);

                    // saves AuthData to local storage
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                    this.saveAuthData(token, expirationDate, this.user);

                    // Navigate to root page of app
                    this.router.navigate(['/']);
                    return true;
                }
            }, error => {
                // If there was an error returned from the login API call
                console.log('Error from http login post call: ');
                console.log(error)
                this.authStatusListener.next(false);                // User is not authenticated

                this.pMessageUpdateListener.next({
                    severity: 'error',
                    summary: 'Login Failed!',
                    detail: error.error.message
                });
                return error;
            });
            
        // After HTTP call

    } // end loginUser call

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        // update all intresed items
        this.authStatusListener.next(false);
        // redirect to homepage

        // clears token timer when logged out manually
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.user.id = null;
        this.router.navigate(['/']);
    }

    // tries to auth user using cookies within local client browser storage
    autoAuthUser() {
        const authInformation = this.getAuthData();
        if (!authInformation) {
            // no stored info
            return;
        }

        // check if the token is still valid
        const now = new Date();
        console.log("Current Date() at autoAuth: ");
        console.log(now);
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        // check if date is in the FuTuRe
        console.log("autoAuthUser()");
        console.log(authInformation, expiresIn);

        if (expiresIn > 0) {
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.user = authInformation.user;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListener.next(true); // tell everyone auth is successful

        }
    }

    // Helper function called within loginUser()
    private setAuthTimer(duration: number) {
        console.log('Setting TTL for timer: ' + duration);

        this.tokenTimer = setTimeout(() => {
            // clear token when it expires
            this.logout();
        }, duration * 1000);
    }

    private saveAuthData(token: string, expirationDate: Date, user: User) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem('user', JSON.stringify(user));

    }

    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('user');
    }

    private getAuthData() {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        const user = JSON.parse(localStorage.getItem('user'));
        if (!token || !expirationDate) {
            return;
        }
        // if ;they exist
        return {
            token: token,
            expirationDate: new Date(expirationDate),
            user: user
        }
    }

    /*================================================================================
        Get info about current logged in user functions
    =================================================================================*/

    getUserInfo(userId: string ) {
        console.log('Getting Info on user with id: ' + userId);
        if(userId == null){
            return;
        }
        this.http
            .get<{severity: string, summary: string, detail: string, userFullName: string}>(BACKEND_URL + "/getInfo/" + userId)
            .subscribe(ret => {
                console.log('User info return');
                console.log(ret);
                return ret.userFullName;
            });
    } 

    getLocalUserVar() {
        if (!this.user) {
            console.log("auther.service.getLocalUserVar() error --> cant return getLocalUserVar() for null this.user!");
            return null;
        } else {
            console.log("auth.service.getLocalUserVar()--> returning local this.user variable...");
            return this.user;
        }
    }

    getUserId() {
        console.log('getUserID() :');
        console.log(this.user);
        if (!this.user) {
            // no user logged in presently
            return null;
        } else {
            return this.user.id;
        }
    }

    getUserFullName() {
        console.log('getUserFullName()');
        if (!this.user) {
            return null; // no user logged in?
        } else {
            const fullName = this.user.firstname + ' ' + this.user.lastname;
            console.log(fullName);
            return fullName;
        }


    }

    getUserLevel() {
        console.log('getUserLevel() :');
        console.log(this.user);
        if (!this.user) {
            // no user logged in presently
            return "default";
        } else {
            return this.user.userLevel;
        }
    }

    /*================================================================================
        GETTER functions for class variables

        observables and auth status /
    =================================================================================*/

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    getPMessageUpdateListener() {
        return this.pMessageUpdateListener.asObservable();
    }

    getIsAuth() {
        return this.isAuthenticated;
    }

    getToken() {
        return this.token;
    }


    /*================================================================================
        User Creation Function
    =================================================================================*/

    createUser(
        // what is expected from the form
        firstname: string,
        lastname: string,
        email: string,
        password: string,
        studentID: string,
        phone: string,
        userLevel: string) {

        const authData: AuthData = {
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: password,
            studentID: studentID,
            phone: phone,
            userLevel: userLevel
        }

        console.log("Sending this authData to server to create new user: ");
        console.log(authData);

        // send request
        this.http
            .post<{ message: string }>(
                BACKEND_URL + "/signup",
                authData)
            .subscribe((results) => {
                console.log('create user successful');
                console.log(results);
                this.router.navigate(['/']);
            }, err => {
                console.log('create user unsuccessful')
                this.authStatusListener.next(false);
            });
    } // end create user
    


    /*================================================================================
        Excess or unused functions (For Now)

        Specifically, these two functions were created for use in some sort of "kiosk"
        that would allow students to check into the lab space using their student ID

        These will def. need to be revisited to not authenticate the user just based
        on a matching StudentID being input and no password check (because in kiosk mode)

        Ideally, we can build out functions that just checks to see if the person exists
        and then does another subset of functions that does not require the student to 
        be authenticated.
    =================================================================================*/
    loginUserId(userId: string){
        console.log('AuthService::loginUserId: ' + userId);

        // This functions allows for a successful authentication
        // if a matching studentID is found.

        // Initially this function was designed for use in kiosk mode
        // where students might just swype their studentID cards
        // to check into the lab space

        let postData = {
            userId: userId
        }
        this.http
            .post<{ token: string, expiresIn: number, message: any, loggedInUser: User}>(
                BACKEND_URL + '/loginId',
                postData
            )
            .subscribe(response => {
                console.log("Response from loginId post request:");
                console.log(response);

                // Add the respose message to the pmessagesconst token = response.token;
                this.token = response.token;
                if (this.token) {

                    const expiresInDuration = response.expiresIn;
                    console.log('token ttl: ' + expiresInDuration);
                    console.log('userLevel:' + response.loggedInUser.userLevel);

                    this.isAuthenticated = true;
                    
                    this.user = response.loggedInUser;

                    // Set the login status to true (successful login)
                    this.authStatusListener.next(true); // inform everyone

                    // sets token timer
                    this.setAuthTimer(expiresInDuration);

                    // saves AuthData to local storage
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                    this.saveAuthData(this.token, expirationDate, this.user);

                    // Navigate to root page of app
                    this.router.navigate(['/']);
                    
                    // TODO return on navigate callback
                    // ! Seperate these calls to be dependent on wood/digital shop
                    // The woodshop will jump to a screen with the training levels, as 
                    // well as the number of people currently in the shop
                    //  When people are leaving the shop, swype out to get the time
                    // spent in the lab and to update the user count

                    // If it is for the digital lab, then this function will check
                    // the laser appts for a matching appointment

                    // If someone swypes in early, let them know their laser and how long they 
                    // have till they can go

                    // If someone finishes early, then swype out and the next person in the queue will be alerted

                    return true;
                }
            }, error => {
                console.log('Error on Logging in with StudentID... 404 Returned');
            })
    }

    
    loginUserIdWoodShop(userId: string) {
        console.log('AuthService::loginUserIdWoodShop with studentID: ' + userId);

        let postData = {
            userId: userId
        }
        this.http
            .post<{ token: string, expiresIn: number, message: any, loggedInUser: User}>(
                BACKEND_URL + '/loginId',
                postData
            )
            .subscribe(response => {
                console.log("Response from loginId post request:");
                console.log(response);

                // Add the respose message to the pmessagesconst token = response.token;
                this.token = response.token;
                if (this.token) {

                    const expiresInDuration = response.expiresIn;
                    console.log('token ttl: ' + expiresInDuration);
                    console.log('userLevel:' + response.loggedInUser.userLevel);

                    this.isAuthenticated = true;
                    
                    this.user = response.loggedInUser;

                    // Set the login status to true (successful login)
                    this.authStatusListener.next(true); // inform everyone

                    // sets token timer
                    this.setAuthTimer(expiresInDuration);

                    // saves AuthData to local storage
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                    this.saveAuthData(this.token, expirationDate, this.user);


                    console.log('Login successful, redirecting to the woodshop kiosk page for user...');
                    // Navigate to root page of app
                    // this.router.navigate(['/']);
                    this.router.navigate(['/woodshop','kiosk']);
                    
                    // TODO return on navigate callback
                    // ! Seperate these calls to be dependent on wood/digital shop
                    // The woodshop will jump to a screen with the training levels, as 
                    // well as the number of people currently in the shop
                    //  When people are leaving the shop, swype out to get the time
                    // spent in the lab and to update the user count

                    // If it is for the digital lab, then this function will check
                    // the laser appts for a matching appointment

                    // If someone swypes in early, let them know their laser and how long they 
                    // have till they can go

                    // If someone finishes early, then swype out and the next person in the queue will be alerted

                    return true;
                }
            }, error => {
                console.log('Error on Logging in with StudentID... 404 Returned');
            })
        /*
            This method will login a user via a kiosk using a student ID
            
            If successful, then the status of number of students in the lab will be checked
            If there are enough stude
        */

    }

    
   








}