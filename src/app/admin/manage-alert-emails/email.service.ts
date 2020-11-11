import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs';
import { map } from 'rxjs/operators'

import { EmailAccount, EmailHistory, PMessage } from '../../../assets/interfaces';
import { environment } from "../../../environments/environment";

// Construct the url to use to access the node.js API server
const BACKEND_URL = environment.apiUrl + "/email";

@Injectable({
  providedIn: 'root'
})
export class EmailService {


  sysAlertEmailAccount: EmailAccount;
  sysAdminEmailAccount: EmailAccount[] = [];

  // stores the current email accouts
  private emails: EmailAccount[] = [];
  private emailHistory: EmailHistory[] = [];

  // observable to have component listen to whenever the emailAccounts change status
  private emailsUpdated = new Subject<EmailAccount[]>();
  private emailHistoryUpdated = new Subject<EmailHistory[]>();

  // emailSent will be updated for the messages that are going to appear on the email-manage component
  // PMessage is the interface for the message popup on the component.
  // On update .next() calls the component, if it has a p-message, will display what is currently in the observable

  // List and observable for the p-message on the compnent using this service
  private pMessages: PMessage[] = [];
  private emailSent = new Subject<PMessage[]>();


  constructor(
    private http: HttpClient) { }

  // getUserUpdateListener(){
  //      return this.usersUpdated.asObservable();
  // }




  // Makes request to API to create a new email account in the db
  createEmailAccount(email: string, password: string, type: string): any {
    console.log("~~~Creating new email account~~~");

    // WARNING, NOT ENFORCING TYPE HERE
    const newEmailAccount: EmailAccount = {
      id: null,
      email: email,
      password: password,
      type: type
    }

    console.log('EmailAccount() --> adding single new email account');
    console.log(newEmailAccount);


    let URL = BACKEND_URL + '/createAccount';
    // Make the request to the API
    this.http
      .post<{ emailId: string, severity: string, summary: string, detail: string }>(
        URL, newEmailAccount)
      .subscribe((responseData) => {
        // data coming back from the API server
        console.log(responseData);
        // get the entry ID and save it
        const id = responseData.emailId;
        newEmailAccount.id = id;

        if (newEmailAccount.type == 'sysadmin') {
          // push the new email account to the sysAdminEmailAccount
          this.sysAdminEmailAccount.push(newEmailAccount);
        }

        if (newEmailAccount.type == 'alertadmin') {
          // push the new email account to the alertAdminEmailAccount
          this.sysAlertEmailAccount = newEmailAccount;
        }

        this.pMessages = [];
        let newMessage: PMessage = {
          severity: responseData.severity,
          summary: responseData.summary,
          detail: responseData.detail
        }
        this.pMessages.push(newMessage);
        this.emailSent.next([...this.pMessages]);

        // update the emails being listened to
        this.emails.push(newEmailAccount);
        this.emailsUpdated.next([...this.emails]);



      });
  };

  updateEmailAccount(
    id: string,
    password: string) {

    console.log("updateEmailAccount() --> updating single email account");
    const reqBody = {
      password: password
    }
    this.http
      .put<{ severity: string, summary: string, detail: string }>(BACKEND_URL + '/' + id, reqBody)
      .subscribe(response => {
        console.log("updateEmailAccount() --> Response:");
        console.log(response);

        this.pMessages = [];
        let newMessage: PMessage = {
          severity: response.severity,
          summary: response.summary,
          detail: response.detail
        }
        this.pMessages.push(newMessage);

        this.emailSent.next([...this.pMessages]);
      })

  }


  // Only update the sysAdmin email,
  // email that recieves any mission critical alerts!
  updateSysAdminAccount(
    id: string,
    email: string) {
    console.log('email service updateSysAdminAccount()');
    console.log(id)
    console.log(email);

    const reqBody = {
      email: email
    };

    this.http
      .put<{ severity: string, summary: string, detail: string }>(BACKEND_URL + '/alert/' + id, reqBody)
      .subscribe(response => {
        console.log("updateSysAdminAccount()--> Response:");
        console.log(response);

        this.pMessages = [];
        let newMessage: PMessage = {
          severity: response.severity,
          summary: response.summary,
          detail: response.detail
        }
        this.pMessages.push(newMessage);

        this.emailSent.next([...this.pMessages]);
      });
  }

  // For deleting the System Alert Email Account
  deleteSystemEmailAccount(id: string) {
    console.log("deleteEmailAccount() --> deleting single email account");
    var urlString = BACKEND_URL + '/' + id;
    console.log(urlString);
    this.http.delete<{ severity: string, summary: string, detail: string }>(urlString)
      .subscribe((response) => {
        console.log("http delete email request finished");

        // remove email account from the observable
        const updatedEmails = this.emails.filter(emailAcct => emailAcct.id !== id);
        console.log("this.emails being updated with:");
        console.log(updatedEmails);

        this.emails = updatedEmails;
        // remove the items from account var
        this.sysAlertEmailAccount = null;

        this.pMessages = [];
        let newMessage: PMessage = {
          severity: response.severity,
          summary: response.summary,
          detail: response.detail
        }
        this.pMessages.push(newMessage);

        this.emailSent.next([...this.pMessages]);

        this.emailsUpdated.next([...this.emails]);
      })
  }

  deleteAdminEmailAccount(id: string) {
    console.log('deleteAdminEmailAccount() --> Deleting single sysAdmin account');
    var urlString = BACKEND_URL + '/' + id;
    console.log(urlString);
    this.http.delete<{ severity: string, summary: string, detail: string }>(urlString)
      .subscribe((response) => {
        console.log('http delete sysadmin email request finished');

        const updatedEmails = this.emails.filter(emailAcct => emailAcct.id !== id);

        this.emails = updatedEmails;
        console.log('Updated Email Array being pushed:');
        console.log(updatedEmails);
        console.log('Response from server');
        console.log(response);

        // remove the account var
        this.sysAdminEmailAccount = [];
        this.emailsUpdated.next([...this.emails]);

        this.pMessages = [];
        let newMessage: PMessage = {
          severity: response.severity,
          summary: response.summary,
          detail: response.detail
        }
        this.pMessages.push(newMessage);

        this.emailSent.next([...this.pMessages]);
      })
  }

  getAllAccounts() {
    console.log("INIT: Load sysApp Email Account, admin email accounts, and email history db");

    this.http
      .get<{ message: string, emailAccounts: EmailAccount[], emailHistoryItems: EmailHistory[] }>(BACKEND_URL)
      .subscribe(resData => {
        console.log("! API SERVER getAllAccounts() response:");
        console.log(resData);

        // clear emails arrayf
        this.emails = [];
        // clear historyItems array
        this.emailHistory = [];



        // resData.emailAccounts.forEach(account => {

        // })

        // Clear old values
        this.emails = [];
        resData.emailAccounts.forEach(element => {
          this.emails.push(element);
        });

        resData.emailHistoryItems.forEach(element => {
          this.emailHistory.push(element);
        })


        this.emailHistoryUpdated.next([...this.emailHistory]);
        this.emailsUpdated.next([...this.emails]);

      })
    // .pipe(map((emailData) => {
    //   // sanatize the password so it isnt being passed around to the client
    //   return emailData.emails.map(emailAccount => {
    //     return {
    //       id: emailAccount._id,
    //       email: emailAccount.email,
    //       password: null,
    //       type: emailAccount.type
    //     };
    //   });
    // }))
    // .subscribe(emailAccounts => {
    //   console.log("Email Data:");
    //   console.log(emailAccounts);
    //   // loop through the retrived data and store the accounts respectivly
    //   this.emails = emailAccounts;
    //   // push to listening components waiting for data
    //   this.emailsUpdated.next([...this.emails]);
    // });
  }


  // getAllAccounts() {
  //   console.log("INIT: Load sysApp Email Account, admin email accounts, and email history db");

  //   this.http
  //     .get<{ message: string, emails: any }>(BACKEND_URL)
  //     .pipe(map((emailData) => {
  //       // sanatize the password so it isnt being passed around to the client
  //       return emailData.emails.map(emailAccount => {
  //         return {
  //           id: emailAccount._id,
  //           email: emailAccount.email,
  //           password: null,
  //           type: emailAccount.type
  //         };
  //       });
  //     }))
  //     .subscribe(emailAccounts => {
  //       console.log("Email Data:");
  //       console.log(emailAccounts);
  //       // loop through the retrived data and store the accounts respectivly
  //       this.emails = emailAccounts;
  //       // push to listening components waiting for data
  //       this.emailsUpdated.next([...this.emails]);
  //     });
  // }

  // Send email from sys email to the sys email
  // returns status from the email send
  sendTestEmail(email: string): any {
    const emailBody = {
      toEmail: email,
      subject: "~`~`~`~ TEST EMAIL FROM FJLRS ~`~`~`~",
      body: "<h1>This Email was sent from the admin-panel as a test email! If recieved successfully, then the FJLRS app has access to sending emails.</h1>"
    }

    this.http
      .post<{ message: any }>(BACKEND_URL + '/sendemail', emailBody)
      .subscribe(response => {
        console.log("Result from sending test email:");
        console.log(response);

        this.pMessages = [];
        let newMessage: PMessage = {
          severity: response.message.severity,
          summary: response.message.summary,
          detail: response.message.detail
        }
        this.pMessages.push(newMessage);

        this.emailSent.next([...this.pMessages]);
      })

  }

  sendTestAdminEmail(email: string) {
    // takes email as the reciepient of the email
    const emailBody = {
      toEmail: email,
      subject: "#ALERT# FJLRS - Test Email",
      body: "<h1>This is to inform you that this email has been added as a system admin on fjlrs.uark.edu</h1><p>If you believe this is a mistake: contact fay jones lab request system admin</p><p>You are going to be alerted on: System Admin Alerts, Bug Submissions, Mistake Reporting, LaserLab Scheduling</p>"
    };

    this.http
      .post<{ severity: string, summary: string, detail: string, emailHistory: EmailHistory }>(BACKEND_URL + '/sendemail', emailBody)
      .subscribe(result => {
        console.log("Result from the test sysadmin alert -- ");
        console.log(result);
        console.log("EmailHistory record:");
        console.log(result.emailHistory);
        this.pMessages = [];

        let pageMessage: PMessage = {
          severity: result.severity,
          summary: result.summary,
          detail: result.detail
        };

        this.emailHistory.push(result.emailHistory);
        this.emailHistoryUpdated.next([...this.emailHistory]);

        // push updated Messages to the array
        this.pMessages.push(pageMessage);
        // update component p-message array with new messages
        this.emailSent.next([...this.pMessages]);
      })
  }

  getUserUpdateListener() {
    return this.emailsUpdated.asObservable();
  }

  getEmailSentListener() {
    return this.emailSent.asObservable();
  }

  getEmailHistoryUpdateListener() {
    return this.emailHistoryUpdated.asObservable();
  }

  // getSysAlertEmail() {
  //     if(this.sysAlertEmailAccount)
  //         return this.sysAlertEmailAccount;
  // }

  // getSysAdminEmail() {
  //     if(this.sysAdminEmailAccount)
  //         return this.sysAdminEmailAccount;
  // }




}
