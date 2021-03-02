import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ManageHoursComponent } from './manage-hours/manage-hours.component';
import { ManageAlertEmailsComponent } from './manage-alert-emails/manage-alert-emails.component';
import { ManageNewsComponent } from './manage-news/manage-news.component';
import { AdminComponent } from './admin/admin.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from '../angular-material.module';
import { AdminRoutingModule } from './admin.routing';
import { FormsModule } from '@angular/forms';

import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ConfirmationDialogComponent } from '../shared-components/confirmation-dialog/confirmation-dialog.component';
import { NewemailaccountComponent } from '../shared-components/newemailaccount/newemailaccount.component';
import { EmailhistorytableComponent } from './manage-alert-emails/emailhistorytable/emailhistorytable.component';
// import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

import { AgGridModule } from 'ag-grid-angular';
import { ManageDeptsComponent } from './manage-depts/manage-depts.component';
import { NewDeptInfoDialogComponent } from '../shared-components/new-dept-info-dialog/new-dept-info-dialog.component';


// For time input
import {CalendarModule} from 'primeng/calendar';
import { EnforceSaneTimeDirective } from '../directives/enforceSaneTime.directive';

import {AccordionModule} from 'primeng/accordion';

import { EditorModule } from 'primeng/editor';
import { FullCalendarComponent } from '@fullcalendar/angular';

import { PanelModule } from 'primeng/panel';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TreeModule } from 'primeng/tree';
import { ManageMaterialsComponent } from './manage-materials/manage-materials.component';
import { PrinterManagementComponent } from './printer-management/printer-management.component';

@NgModule({
  declarations: [
    ManageUsersComponent,
    ManageHoursComponent,
    ManageAlertEmailsComponent,
    ManageNewsComponent,
    AdminComponent,
    ConfirmationDialogComponent,
    NewDeptInfoDialogComponent,
    NewemailaccountComponent,
    EmailhistorytableComponent,
    ManageDeptsComponent,
    EnforceSaneTimeDirective,
    ManageMaterialsComponent,
    PrinterManagementComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    AdminRoutingModule,
    FormsModule,
    ToastModule,
    MessagesModule,
    MessageModule,
    AgGridModule.withComponents([]),
    CalendarModule,
    AccordionModule,
    EditorModule,
    PanelModule,
    SplitButtonModule,
    TreeModule

    

  ],
  entryComponents: [ ConfirmationDialogComponent, NewemailaccountComponent, NewDeptInfoDialogComponent]
})
export class AdminModule { }
