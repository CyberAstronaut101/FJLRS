import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrinterlabRoutingModule } from './printerlab-routing.module';
import { PrinterlabHomeComponent } from './printerlab-home/printerlab-home.component';

@NgModule({
  declarations: [PrinterlabHomeComponent],
  imports: [
    CommonModule,
    PrinterlabRoutingModule
  ]
})
export class PrinterlabModule { }
