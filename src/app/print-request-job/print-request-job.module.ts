import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrintRequestJobRoutingModule } from './print-request-job-routing.module';
import { RequestFormComponent } from './request-form/request-form.component';
import { JobRequestService } from './job-request.service';
import { UploadfilesComponent } from './uploadfiles/uploadfiles.component';
import { StepsModule } from 'primeng/steps';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material';
import { SelectMaterialsComponent } from './select-materials/select-materials.component';
import { ExtraOptionsComponent } from './extra-options/extra-options.component';
import { QuoteGenerateComponent } from './quote-generate/quote-generate.component';
import { SubmitJobRequestComponent } from './submit-job-request/submit-job-request.component';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';

@NgModule({
  declarations: [RequestFormComponent, UploadfilesComponent, SelectMaterialsComponent, ExtraOptionsComponent, QuoteGenerateComponent, SubmitJobRequestComponent],
  imports: [
    CommonModule,
    PrintRequestJobRoutingModule,
    StepsModule,
    ToastModule,
    FormsModule,
    MatCardModule,
    ButtonModule,
    CardModule,
    FileUploadModule
    

  ],
  providers: [
    JobRequestService
  ]
})
export class PrintRequestJobModule { }
