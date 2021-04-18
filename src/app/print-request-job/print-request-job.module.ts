import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrintRequestJobRoutingModule } from './print-request-job-routing.module';
import { RequestFormComponent } from './request-form/request-form.component';
import { JobRequestService } from './job-request.service';

import { StepsModule } from 'primeng/steps';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { MatCardModule, MatDialogModule } from '@angular/material';


import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextareaModule} from 'primeng/inputtextarea';

@NgModule({
  declarations: [RequestFormComponent],
  imports: [
    CommonModule,
    PrintRequestJobRoutingModule,
    StepsModule,
    ToastModule,
    FormsModule,
    MatCardModule,
    ButtonModule,
    CardModule,
    FileUploadModule,
    DropdownModule,
    InputTextareaModule,
    MatDialogModule
  ],
  providers: [
    JobRequestService
  ]
})
export class PrintRequestJobModule { }
