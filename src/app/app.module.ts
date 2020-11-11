import { BrowserModule } from '@angular/platform-browser'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import {  AngularMaterialModule } from './angular-material.module';
import { ErrorComponent } from './error/error.component';
import { ErrorInterceptor } from './error-interceptor';
import { AuthInterceptor } from './auth/auth-interceptor';
import { AppRoutingModule } from './app-routing.module';
import { MachinePrinterComponent } from './machine-printer/machine-printer.component';
import { AuthService } from './auth/auth.service';
import { AdminModule } from './admin/admin.module';
import { AgGridModule } from 'ag-grid-angular';
// import { ConfirmationDialogComponent } from './shared-components/confirmation-dialog/confirmation-dialog.component';
import { FullCalendarModule } from '@fullcalendar/angular';
// import { NewDeptInfoDialogComponent } from './shared-components/new-dept-info-dialog/new-dept-info-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    ErrorComponent,
    MachinePrinterComponent
    // ConfirmationDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,
    AdminModule,
    FontAwesomeModule,
    FullCalendarModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    AuthService
    // { provide: OWL_DATE_TIME_LOCALE, useValue: 'en'}
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }

