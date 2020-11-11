import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { AngularMaterialModule } from "../angular-material.module";
import { AuthRoutingModule } from "./auth-routing.module";

// For PrimeNG Toast and confirm dialog
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';

import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { KioskloginComponent } from './kiosklogin/kiosklogin.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { AutofocusDirective } from './autofocus.directive';

@NgModule({
  declarations: [LoginComponent, SignupComponent, KioskloginComponent, ResetpasswordComponent, AutofocusDirective],
  imports: [CommonModule,  FormsModule, ReactiveFormsModule,  AuthRoutingModule, ToastModule, ConfirmDialogModule, AngularMaterialModule, MessagesModule, MessageModule]
})
export class AuthModule {}
