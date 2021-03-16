import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountHomeComponent } from './account-home/account-home.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { MatTabsModule } from '@angular/material';
import { AccountActiveJobsComponent } from './account-active-jobs/account-active-jobs.component';
import { AccountJobHistoryComponent } from './account-job-history/account-job-history.component';

@NgModule({
  declarations: [AccountHomeComponent, AccountSettingsComponent, AccountActiveJobsComponent, AccountJobHistoryComponent],
  imports: [
    CommonModule,
    AccountRoutingModule,
    MatTabsModule             // Could also use AngularMaterialModule
  ]
})
export class AccountModule { }
