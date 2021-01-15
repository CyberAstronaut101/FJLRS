
import { Component, OnInit, ModuleWithComponentFactories, OnDestroy } from '@angular/core';
// import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

// PrimeNG Imports
import { MessageService, Message } from 'primeng/api';
import { MenuItem } from 'primeng/components/common/menuitem';

import { EmailService } from './email.service';
import { EmailAccount, EmailHistory } from '../../../assets/interfaces';

import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MatDialogConfig, MatDialog, MatTableDataSource } from '@angular/material';
import { ConfirmationDialogComponent } from 'src/app/shared-components/confirmation-dialog/confirmation-dialog.component';
import { NewemailaccountComponent } from 'src/app/shared-components/newemailaccount/newemailaccount.component';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'admin-manage-alert-emails',
  templateUrl: './manage-alert-emails.component.html',
  styleUrls: ['./manage-alert-emails.component.css'],
  providers: [MessageService]
})
export class ManageAlertEmailsComponent implements OnInit {



  /*
		This Component is rendered within the admin-panel
        Purpose: Display the email account that will be used to send communications with students
        1. Create Email Account
        2. Delete Email Account
        ** limiting on the backend to only one active account allowed **
        3. Send test email button to each of the email accounts
	*/
  isLoading = false;

  private authStatusSub: Subscription;

  msgs: Message[] = [];
  items: MenuItem[];

  public sysalertEmail: EmailAccount;
  public sysadminEmail: EmailAccount[] = [];
  public emailSentHistory: EmailHistory[] = [];

  private emailSub: Subscription; // for email accounts
  private emailSentSub: Subscription; // for the p-message msg[]
  private emailHistorySub: Subscription;

  // Variables for the Email Search
  emailDataSource;
  checked;
  resultsLength = 0;
  displayedColumns: string[] = ['select', 'From', 'To', 'Subject', 'Return Code', 'Send Date'];
  selection = new SelectionModel<EmailHistory>(true, []);
  selectionLength = Selection.length;

  constructor(
    public route: ActivatedRoute,
    public emailService: EmailService,
    private messageService: MessageService,
    private dialog: MatDialog
  ) { }

  // Added for a confim on delete email account popup


  ngOnInit() {
    /*
      Request email account
    */

    this.emailService.getAllAccounts();

    console.log('Email Data:');

    this.emailSub = this.emailService.getUserUpdateListener()
      .subscribe((emailAccounts: EmailAccount[]) => {
        console.log('Email Account Subscription updated with new values!');
        console.log(emailAccounts);
        this.sysadminEmail = [];
        this.sysalertEmail = null;

        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < emailAccounts.length; i++) {
          if (emailAccounts[i].type == 'sysadmin') {
            this.sysadminEmail.push(emailAccounts[i]);
          }
          if (emailAccounts[i].type == 'alertadmin') {
            this.sysalertEmail = emailAccounts[i];
          }
        }

        // Add check to see if there is no sysalertEmail
        // if there isnt, then display an error message to user
        if (this.sysalertEmail == null) {
          console.log("No sysalertEmail retrieved from API server...");
          let appEmailAlert = {
            severity: "warn",
            summary: "No Application Email",
            detail: "No System Email Account! App will not be able to send emails!"
          }

          this.messageService.clear();
          this.messageService.add(appEmailAlert);
        }

      });

    this.emailHistorySub = this.emailService.getEmailHistoryUpdateListener()
      .subscribe((result: EmailHistory[]) => {
        console.log("!! EMAIL HISTORY SUBSCRIPTION UPDATED !!");
        console.log(result);

        this.emailSentHistory = [];
        // Setup table Data
        this.emailSentHistory = result;
        this.emailDataSource = new MatTableDataSource(this.emailSentHistory);
        this.resultsLength = this.emailSentHistory.length;

      });

    this.emailSentSub = this.emailService.getEmailSentListener()
      .subscribe((result: any) => {
        console.log("## p-message updated ###");
        console.log(result);

        // this.msgs = [];
        // this.msgs.push(result);
        this.messageService.clear();
        this.messageService.add(result);
      })

  }

  onSaveNewAlertAdmin(form: NgForm) {
    // saving this in the db so the different email addresses (alertadmin, sysadmin) can be queried
    let emailAccountType = 'alertadmin';

    // clear the messages on the component
    this.msgs = [];

    console.log('onSaveNewSystemEmail()');
    if (form.invalid) {
      // push a msg to the thing
      console.log('form is invalid');
      this.msgs.push({ severity: 'error', summary: 'Save Error', detail: 'System Alert Email Not Saved' });
    } else {
      // form is !invalid, use EmailService to create a new account
      console.log('createEmailAccount() --> sending to API server');

      this.emailService.createEmailAccount(form.value.sysAlertEmail, form.value.sysAlertPassword, emailAccountType);



    }
    console.log("New Alert Admin Sys Account!")
    console.log(form);

  }

  onUpdateAlertAdmin(form: NgForm, id: string) {
    console.log(form);
    this.msgs = [];

    if (!form.value.sysAlertPassword) {
      return this.msgs.push({
        severity: 'error',
        summary: 'Password Invalid!',
        detail: 'please enter a valid password to update alert email account with'
      });
    }
    console.log("onUpdateAlertAdmin( " + id + " , " + form.value.adminEmailPassword + ")");

    // call email service to update entry with id: id with the password form.value.password
    console.log("updating alert admin email password with");
    console.log(form.value.adminEmailPassword);

    this.msgs = [];
    this.emailService.updateEmailAccount(id, form.value.adminEmailPassword);


  }

  onSendTestEmail() {
    // Sends a test email from the sys email to the sys email
    this.emailService.sendTestEmail(this.sysalertEmail.email);
  }

  onSendTestAdminEmail(toEmail: EmailAccount) {
    this.msgs = [];
    // nothign returns, service will update the component var msgs with the right stuff
    console.log("Sending test email to:");
    console.log(toEmail);
    this.emailService.sendTestAdminEmail(toEmail.email);
    // console.log();

    // if(this.sysadminEmail.email == null) {
    //   console.log("The sysadminEmail is null");

    // }
    // this.emailService.sendTestAdminEmail(this.sysadminEmail.email);
  }


  // This is deleting the System Alert Email Account
  onDeleteSystemEmailAccount(id: string) {
    this.msgs = [];



    console.log("Deleting sys alert email account with id: ");
    console.log(id);

    this.emailService.deleteSystemEmailAccount(id);
    this.sysalertEmail = null;
  }

  onCheckAppEmailAuthStatus(): void {
    this.emailService.sendTestEmail(this.sysalertEmail.email);
  }

  onConfirmDeleteSystemAccount(id: string): void {
    this.msgs = [];

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Are you sure you want to delete the FJLRS System Email Account? The system will not be able to send emails without a valid account.'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Yes clicked');
        // DO SOMETHING
        console.log("Deleting sys alert email account with id: ");
        console.log(id);

        this.emailService.deleteSystemEmailAccount(id);
        this.sysalertEmail = null;
      }
    });
  }

  onConfirmUpdateSystemAccountPasswd(form: NgForm, id: string) {
    this.msgs = [];

    // Make sure there is a password
    if (!form.value.sysAlertPassword) {
      return this.msgs.push({
        severity: 'error',
        summary: 'Password Invalid!',
        detail: 'Please enter a password if you want to update the FJLRS system application email...'
      });
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Are you sure you want to update the fjlrs system email password to: \'' + form.value.sysAlertPassword + '\'?'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Yes clicked');
        // DO SOMETHING

        console.log("onConfirmUpdateSystemAccountPasswd( " + id + " , " + form.value.sysAlertPassword + ")");

        // call email service to update entry with id: id with the password form.value.password
        console.log("emailService.updateEmailAccount(id, newPasswd)");
        console.log(form.value.sysAlertPassword);

        this.emailService.updateEmailAccount(id, form.value.sysAlertPassword);
        // this.emailService.deleteSystemEmailAccount(id);
        // this.sysalertEmail = null;
      }
    });
  }

  onConfirmAddAdminAccount(): void {
    console.log('NewEmailAccount Dialog for new admin email account...');
    this.msgs = [];
    const dialogRef = this.dialog.open(NewemailaccountComponent, {
      width: '350px',
      data: 'Enter New Admin Email Address:'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Yes clicked');
        console.log(result);
        // DO SOMETHING
        // console.log(id);
        this.emailService.createEmailAccount(result.data, null, 'sysadmin');
        // this.sysalertEmail = null;
      }
    });

  }


  onSaveNewSysAdmin(form: NgForm) {
    let emailAccountType = 'sysadmin';
    this.msgs = [];

    console.log('onSaveNewSysAdminEmail');
    if (form.invalid) {
      console.log('form is invalid');
      this.msgs.push({
        severity: 'error',
        summary: 'Save Error',
        detail: 'System Admin Email Not Saved.'
      });
    } else {
      // form is valid
      console.log("manage emails component calling service createEmailAccount()");
      this.emailService.createEmailAccount(
        form.value.sysAdminEmailAddress,
        null,
        emailAccountType);



      form.reset();
      // set the sysAdmin ---- MAKE THIS THE RESPONSE ON THE SERVICE CALL
      // this.sysadminEmail = {
      //   id: null,
      //   email: form.value.sysAdminEmailAddress,
      //   password: null,
      //   type: 'sysadmin'
      // }

      // newsysAdminEmail = {
      //   id:

      // end of else block
    }

  }

  onUpdateSysAdmin(form: NgForm, id: string) {
    this.msgs = [];

    console.log('manage emails component onUpdateSysAdmin()');
    console.log(id);
    console.log(form.value.adminEmailAddress);

    this.emailService.updateSysAdminAccount(id, form.value.adminEmailAddress);
  }

  // For Deleting the sysadmin email, the one that gets any alert emails
  onDeleteSysAdminAccount(id: string) {
    this.msgs = [];

    console.log("manage-alert-email component calling emailService delteAdminEmailAccount()");
    console.log(id);

    this.emailService.deleteAdminEmailAccount(id);
  }


  save(severity: string) {
    console.log("save() called from email-manage");
    this.msgs = [];

    console.log()


    this.msgs.push({ severity: 'success', summary: 'Success Message', detail: 'Order submitted' });
  }

  // HELPER FUNCTIONS FOR THE MAT DATA TAB

  onItemSelected(row: string) {
    console.log("Email History Item Selected in row:", row);
  }


  applyFilter(filterValue: string) {
    console.log("applying filter: "+filterValue);
    this.emailDataSource.filter = filterValue.trim().toLowerCase();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    // console.log('checking if all rows are sleected');
    const numSelected = this.selection.selected.length;
    const numRows = this.emailDataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.emailDataSource.data.forEach(row => this.selection.select(row));
  }

  ngOnDestroy() {
    this.emailSub.unsubscribe();
    this.emailSentSub.unsubscribe();
  }

}
