import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/*===========================================================================
  app-routing.module.ts

  This module contains all the routes and the data that should be loaded if 
  the route is called within the angular application.

  Examples of how to call routes within Angular Typescript or creating buttons
  that navigate to pages


  HTML Buttons using [routerLink] 
  ---------------------------------
  <a [routerLink]="['/account']"> FOOBAR </a> 

===========================================================================*/
import { AuthGuard } from './auth/auth.guard';

// This error component could be used but bad paths just route to the root of the app -- localhost:4200/
// import { ErrorComponent } from './error/error.component';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full'},
    { path: 'home', loadChildren: './home/home.module#HomeModule'},
    { path: 'auth', loadChildren: './auth/auth.module#AuthModule' },
    { path: 'admin', canActivate: [AuthGuard], loadChildren: './admin/admin.module#AdminModule'},
    { path: 'employee', canActivate: [AuthGuard], loadChildren: './employee/employee.module#EmployeeModule'},
    { path: 'student', canActivate: [AuthGuard], loadChildren: './student/student.module#StudentModule'},
    { path: 'woodshop', canActivate: [AuthGuard], loadChildren: './woodshop/woodshop.module#WoodshopModule'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // , { enableTracing: true }
  exports: [RouterModule],   // so app.module.ts can use outside
  providers: [AuthGuard]
})
export class AppRoutingModule { }