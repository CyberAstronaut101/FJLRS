import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


// AuthGuard Ensures that the user Is Logged In
import { AuthGuard } from './auth/auth.guard';
// import { PrintingStudioComponent } from './printing-studio/printing-studio.component';
// import { ErrorComponent } from './error/error.component';


/*
path '' -- localhost:3000/
*/
const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full'},
    { path: 'home', loadChildren: './home/home.module#HomeModule'},
    { path: 'auth', loadChildren: './auth/auth.module#AuthModule' },
    { path: 'admin', canActivate: [AuthGuard], loadChildren: './admin/admin.module#AdminModule'},
    { path: 'employee', canActivate: [AuthGuard], loadChildren: './employee/employee.module#EmployeeModule'},
    { path: 'student', canActivate: [AuthGuard], loadChildren: './student/student.module#StudentModule'},
    { path: 'woodshop', canActivate: [AuthGuard], loadChildren: './woodshop/woodshop.module#WoodshopModule'},
    


  // { path: '', loadChildren: './app.module#AppModule'},
//   { path: 'home', loadChildren: './home/home.module#HomeModule'},
//   // { path: '', redirectTo: 'printing-studio', pathMatch: 'full'}, // was redirecting for less clicks
//   { path: 'printing-studio', loadChildren: './printing-studio/printing-studio.module#PrintingStudioModule' },      // Main Page For Now
//   { path: 'admin', loadChildren: './admin-panel/admin-panel.module#AdminPanelModule' },
  // { path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // , { enableTracing: true }
  exports: [RouterModule],   // so app.module.ts can use outside
  providers: [AuthGuard]
})
export class AppRoutingModule { }

/*
  {
    path: 'create', // localhost:4200/create
    component: TodoCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit/:todoId',
    component: TodoCreateComponent,
    canActivate: [AuthGuard]
  },*/
