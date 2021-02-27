import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestFormComponent } from './request-form/request-form.component';


// Base route is /jobrequest
const routes: Routes = [
   { path: '', component: RequestFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrintRequestJobRoutingModule { }
