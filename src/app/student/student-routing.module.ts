import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { StudentComponent } from './student/student.component';

// Base route
const routes: Routes = [
  { path: '', component:  StudentComponent }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class StudentRoutingModule {}

