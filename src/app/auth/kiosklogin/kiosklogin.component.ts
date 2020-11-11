import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-kiosklogin',
  templateUrl: './kiosklogin.component.html',
  styleUrls: ['./kiosklogin.component.css'],
  providers: [MessageService]
})
export class KioskloginComponent implements OnInit {

  isLoading = false;

  kioskRole = 'default';

  private authStatusSub: Subscription;

  private pMessageSub: Subscription;

  constructor(private authService: AuthService,
              private messageService: MessageService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    console.log(this.activatedRoute.snapshot.paramMap.get('kioskRole') );
    this.kioskRole = this.activatedRoute.snapshot.paramMap.get('kioskRole');
    // The kioskRole is either null, wood, or digital


    // Check on the authentication Status
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );

    // Setup Subscription for any messages
    this.pMessageSub = this.authService.getPMessageUpdateListener().subscribe(
      newMsg => {
        console.log('PMessages updated from authService call!');
        console.log(newMsg);
        this.messageService.add({
          severity: newMsg.severity,
          summary: newMsg.summary,
          detail: newMsg.detail
        });
      }
    );
  }

  onSubmitID(loginForm: NgForm) {
    console.log('onSubmitID()');

    if (loginForm.invalid) {
      console.log('Login form was submitted with no data. Returning');

      this.messageService.add({
        severity: 'error',
        summary: 'No StudentID Passed!',
        detail: 'Passed Value: ' + loginForm.value.formId
      })

      return;
    }
    /*
      When using a student ID with a magstrip reader,
      the input will be in the form:

        ;010795711=0062?

      This input parsing is going to assume each student ID is

        1. 9 Characters Long
        2. Each swype starts with a ';' and ends at char #10 with '='

      Then this will be submitted and IF a user exists with this id, then they are logged into the system
    
      FIRST check if the first char is a ; or not

    */

    let trimmedID = loginForm.value.formId

    if (loginForm.value.formId.charAt(0) == ';') {
      // id input via magstrip reader, remove the ; and ending =0062?
      trimmedID = trimmedID.substring(1, 10);
    }

    console.log('Submitting ' + trimmedID + ' to authService.loginUserId');

    /*
      * There are three different ways that this can continue.
          1. The route is /auth/kioskLogin
          2. The route is /auth/kioskLogin/wood
          3. The route is /auth/kioskLogin/digital
      
    */

    if (this.kioskRole == 'wood') {
      console.log('KioskRole: Wood Shop');
      // Login the user using the StudentID to the woodshop
      this.authService.loginUserIdWoodShop(trimmedID);

    } else if ( this.kioskRole == 'digital') {
      console.log('KioskRole: Digital Lab');
      this.authService.loginUserId(trimmedID);
    } else {
      console.log('Default Kiosk Role');
      this.authService.loginUserId(trimmedID);
    }

  }

}
