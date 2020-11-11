import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeviewComponent } from './homeview/homeview.component';


// Base route
const routes: Routes = [
  { path: '', component: HomeviewComponent }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
