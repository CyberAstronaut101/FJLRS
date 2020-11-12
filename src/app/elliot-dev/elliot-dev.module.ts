import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ElliotDevRoutingModule } from './elliot-dev-routing.module';
import { WorldClockComponent } from './world-clock/world-clock.component';

@NgModule({
  declarations: [ WorldClockComponent],
  imports: [
    CommonModule,
    ElliotDevRoutingModule
  ]
})
export class ElliotDevModule { }
