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

@NgModule({
  declarations: [PrinterlabHomeComponent, PrinterlabDetailComponent],
  imports: [
    CommonModule,
    PrinterlabRoutingModule,
    AngularMaterialModule,
    FormsModule,
    MatDividerModule,
    FileUploadModule,
    StepsModule,
    

  ]
})
export class PrinterlabModule { }
