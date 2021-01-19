import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrinterlabRoutingModule } from './printerlab-routing.module';
import { PrinterlabHomeComponent } from './printerlab-home/printerlab-home.component';
import { MatCardModule, MatDividerModule, MatTabsModule } from '@angular/material';
import { PrintJobFormComponent } from './print-job-form/print-job-form.component';
import { AngularMaterialModule } from '../angular-material.module';
import { FormsModule } from '@angular/forms';
import {FileUploadModule} from 'primeng/fileupload';

@NgModule({
  declarations: [PrinterlabHomeComponent, PrintJobFormComponent],
  imports: [
    CommonModule,
    PrinterlabRoutingModule,
    AngularMaterialModule,
    FormsModule,
    MatDividerModule,
    FileUploadModule

  ]
})
export class PrinterlabModule { }
