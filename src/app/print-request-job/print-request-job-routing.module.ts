import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExtraOptionsComponent } from './extra-options/extra-options.component';
import { QuoteGenerateComponent } from './quote-generate/quote-generate.component';
import { RequestFormComponent } from './request-form/request-form.component';
import { SelectMaterialsComponent } from './select-materials/select-materials.component';
import { SubmitJobRequestComponent } from './submit-job-request/submit-job-request.component';
import { UploadfilesComponent } from './uploadfiles/uploadfiles.component';

// Base route is /jobrequest
const routes: Routes = [
   { path: '', component: RequestFormComponent, children: [
      { path: '', redirectTo: 'uploadFiles', pathMatch: 'full'},
      { path: 'uploadFiles', component: UploadfilesComponent },
      { path: 'materials', component: SelectMaterialsComponent },
      { path: 'extraOptions', component: ExtraOptionsComponent },
      { path: 'quote', component: QuoteGenerateComponent },
      { path: 'submitRequest', component: SubmitJobRequestComponent }      
   ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrintRequestJobRoutingModule { }
