import { BrowserModule } from '@angular/platform-browser'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';


// For the Icons in the sidenav, and wherever else you see fit
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'; // For usecases see -- https://www.npmjs.com/package/@fortawesome/angular-fontawesome

// This file just imports all the components from material are used throughout the application
import { AngularMaterialModule } from './angular-material.module'; // "Google formatting" see -- https://material.angular.io/

import { ErrorComponent } from './error/error.component';
import { ErrorInterceptor } from './error-interceptor';
import { AuthInterceptor } from './auth/auth-interceptor';
import { AppRoutingModule } from './app-routing.module';
import { MachinePrinterComponent } from './machine-printer/machine-printer.component';

// AuthService has functions that control the user session info, can call functions to get info about user to render in the html
import { AuthService } from './auth/auth.service';
import { AdminModule } from './admin/admin.module';

import { AgGridModule } from 'ag-grid-angular';

// Fullcalendar -- potential free user
import { FullCalendarModule } from '@fullcalendar/angular';
import { RequestSubmitSuccessComponent } from './shared-components/request-submit-success/request-submit-success.component';

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
  providers: [      // See https://angular.io/guide/architecture-services
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    AuthService
    // { provide: OWL_DATE_TIME_LOCALE, useValue: 'en'}
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }

