import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrinterlabHomeComponent } from './printerlab-home/printerlab-home.component';

const routes: Routes = [
  { path: '', component: PrinterlabHomeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrinterlabRoutingModule { }
