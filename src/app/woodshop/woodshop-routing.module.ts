import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { WoodKioskComponent } from './wood-kiosk/wood-kiosk.component';

// woodshop routes

// Base route: /woodshop
const routes: Routes = [
    { path: '', component: WoodKioskComponent },
    { path: 'kiosk', component: WoodKioskComponent }  
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class WoodshopRoutingModule {}
