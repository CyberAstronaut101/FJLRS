import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeviewComponent } from './homeview/homeview.component';
import { AngularMaterialModule } from '../angular-material.module';
import { FormsModule } from '@angular/forms';
import { AuthModule } from '../auth/auth.module';
import { HomeRoutingModule } from './home.routing';

import { NewsViewComponent } from '../shared-components/news-view/news-view.component';
import { UserViewComponent } from '../shared-components/user-view/user-view.component';

@NgModule({
  declarations: [HomeviewComponent, NewsViewComponent, UserViewComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule,
    AuthModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
