import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrinterlabRoutingModule } from './printerlab-routing.module';
import { PrinterlabHomeComponent } from './printerlab-home/printerlab-home.component';
import { MatCardModule, MatDividerModule, MatTabsModule } from '@angular/material';
import { AngularMaterialModule } from '../angular-material.module';
import { FormsModule } from '@angular/forms';
import {FileUploadModule} from 'primeng/fileupload';
import {StepsModule} from 'primeng/steps';
import { PrinterlabDetailComponent } from './printerlab-detail/printerlab-detail.component';
import { DropdownModule } from 'primeng/dropdown';
import { PrinterlabHistoryComponent } from './printerlab-history/printerlab-history.component';

@NgModule({
  declarations: [PrinterlabHomeComponent, PrinterlabDetailComponent, PrinterlabHistoryComponent],
  imports: [
    CommonModule,
    PrinterlabRoutingModule,
    AngularMaterialModule,
    FormsModule,
    MatDividerModule,
    FileUploadModule,
    StepsModule,
    DropdownModule
    

  ]
})
export class PrinterlabModule { }
