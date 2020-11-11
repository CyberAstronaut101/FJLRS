import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';


// selector: 'app-signup',
@Component({
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
    isLoading = false;
    private authStatusSub: Subscription;

    levels = ['student','employee','admin'];

    constructor(public authService: AuthService) {}

    ngOnInit() {
        this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
            authStatus => {
                this.isLoading = false;
            }
        );
    }

    onSignup(form: NgForm) {
        console.log(form.value);
        if(form.invalid){
            return;
        }
        // start the loading animation
        this.isLoading = true;

        // use authService to communicate with the server
        this.authService.createUser(
            form.value.firstName,
            form.value.lastName,
            form.value.email,
            form.value.password,
            form.value.studentID,
            form.value.phone,
            form.value.userLevel);
    }

    ngOnDestroy() {
        this.authStatusSub.unsubscribe();
    }
}