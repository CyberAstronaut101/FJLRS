import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/admin/manage-users/user.service';

// PrimeNG Message
import { Message } from 'primeng//api';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css'],
  providers: [MessageService]
})
export class ResetpasswordComponent implements OnInit {

  isValidResetRequest = false;
  userId: string;
  isLoading = true;


  public passwordResetForm: FormGroup;


  // For API messages
  private messagesUpdatedSub: Subscription;

  // For Watching the angular routing parameters
  private routerSub: any;

  // Form values for reset

  constructor(private userService: UserService,
    private messageService: MessageService,
    private route: ActivatedRoute) { }

  ngOnInit() {

    console.log('\n~~~~~~~~\nResetPasswordComponent OnInit');
    //
    this.routerSub = this.route.params.subscribe(params => {
      console.log(params.id);
      this.userId = params.id;
      // Make a request to verify if passed uid is for a valid token
      this.userService.verifyCanResetPassword(params.id);
    });


    // Initialize the validators for the form
    this.passwordResetForm = new FormGroup({
      firstPasswd: new FormControl('', [Validators.required]),
      secondPasswd: new FormControl('', [Validators.required])
    });


    this.messagesUpdatedSub = this.userService.getUserMessagesUpdatedListener()
      .subscribe(newMessages => {
        console.log('resetpassword component -->new message from api server...');
        console.log(newMessages);

        /*
          IMPORTANT INFO

          This component checks if the reset password session is valid based on the
          return severity of the messages coming back from the API server

          IF warn || error --> THEN not valid
          IF success --> Valid reset session
        */
        let areErrorMsgs = false;
        newMessages.forEach(newMessage => {
          if (newMessage.severity === 'warn' || newMessage.severity === 'error') {
            areErrorMsgs = true;
          }
        });

        if (areErrorMsgs) {
          this.isValidResetRequest = false;
        } else {
          this.isValidResetRequest = true;
        }

        this.messageService.clear();
        this.messageService.addAll(newMessages);
      });
    // Use User service to validate if this is a valid request
  }

  onUpdateNewUserPassword(passwdForm: NgForm) {
    console.log('new password form submitted');

    this.passwordResetForm.setValidators(this.checkPasswords);
    this.passwordResetForm.updateValueAndValidity();

    if(this.passwordResetForm.valid) {
      console.log('new password form is valid');

      console.log(passwdForm);

      // Service call to hash and update the password
      this.userService.updateUserAccountPassword(this.userId, passwdForm.value.firstPasswd);

    } else {
      console.log('new password form is invalid');
      
      // Message not being updated by the user service subscription, wont change status of the reset form
      this.messageService.clear();
      this.messageService.add({
        severity: 'error',
        summary: 'Password Error',
        detail: 'Both Passwords must match exactly'
      });
      this.passwordResetForm.reset();
    }

  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    if(group) {
      if(group.get('firstPasswd').value !== group.get('secondPasswd').value) {
        return { notMatching: true};
      }
    }

    return null;
  }

}
