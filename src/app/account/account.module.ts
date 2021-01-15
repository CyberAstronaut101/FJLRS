import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountHomeComponent } from './account-home/account-home.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [AccountHomeComponent, AccountSettingsComponent],
  imports: [
    CommonModule,
    AccountRoutingModule,
    MatTabsModule             // Could also use AngularMaterialModule
  ]
})
export class AccountModule { }
