import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WoodKioskComponent } from './wood-kiosk/wood-kiosk.component';
import { WoodshopRoutingModule } from './woodshop-routing.module';
import { AngularMaterialModule } from '../angular-material.module';

@NgModule({
  declarations: [WoodKioskComponent],
  imports: [
    CommonModule,
    WoodshopRoutingModule,
    AngularMaterialModule
  ]
})
export class WoodshopModule { }
