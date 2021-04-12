import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrinterlabDetailComponent } from './printerlab-detail/printerlab-detail.component';
import { PrinterlabHomeComponent } from './printerlab-home/printerlab-home.component';


// /printerlab/
const routes: Routes = [
  { path: '', component: PrinterlabHomeComponent },
  { path: 'detail', component: PrinterlabDetailComponent }    //printerlab/detail/:jobId
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrinterlabRoutingModule { }
