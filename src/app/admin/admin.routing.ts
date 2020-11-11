import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AdminComponent } from './admin/admin.component';
import { AdminGuard } from './admin.guard';



// Base route
const routes: Routes = [
  { path: '', canActivate: [AdminGuard], component:  AdminComponent }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  providers: [AdminGuard],
  exports: [RouterModule]
})
export class AdminRoutingModule {}

