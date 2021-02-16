import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { JobRequestService } from '../job-request.service';
import { RequestFormComponent } from '../request-form/request-form.component';

@Component({
  selector: 'app-select-materials',
  templateUrl: './select-materials.component.html',
  styleUrls: ['./select-materials.component.css'],
  providers: [MessageService]
})
export class SelectMaterialsComponent implements OnInit {

  /*
    Once Aaron gets around to finishing the material management admin interface, this will dynamically
    pull from the list of materials to prompt the user to select which one they want.

    For now, we are just sticking with a hard-coded list of materials so we can wrap up this part of the project
    and then circle back.
  */

  componentStepIndex = 1;

  materials: any[];   // TODO change this to the model that matches what the DB schema for materials is
  selectedMaterial: {};

  constructor(private messageService: MessageService, private requestComponent: RequestFormComponent, public jobRequestService: JobRequestService, private router: Router) {
    
    // TODO have this replaced with dynamic DB pulled data. 
    this.materials = [
      { name: "White PLA", matId: "TEMP DB ID" },
      { name: "Black PLA", matId: "TEMP DB ID" },
      { name: "Gray PLA", matId: "TEMP DB ID" }
    ]
  }

  

  ngOnInit() {
    // Need to revisit this.. if there isnt a job request started already the process should start at the file upload window..
    this.requestComponent.setIndex(this.componentStepIndex);

    // See if material has been selected, if so, load the value for client side
    if(this.jobRequestService.hasMaterial) {
      console.log("Material already selected, loading");
      this.selectedMaterial = this.jobRequestService.jobSubmissionInformation.material;
    }

  }

  lastPage() {
    if(this.selectedMaterial) {
      this.jobRequestService.materialSelected(this.selectedMaterial);

      this.requestComponent.increaseIndex();
      this.router.navigate(['/jobrequest/uploadFiles']);

      return;
    }
    // Goes back to the upload files page
    this.requestComponent.decreaseIndex();
    this.router.navigate(['/jobrequest/uploadFiles']);
  }

  nextPage() {
    this.messageService.clear();
    console.log("Selected Material");
    console.log(this.selectedMaterial);

    // Validate info
    if(this.selectedMaterial) {
      this.jobRequestService.materialSelected(this.selectedMaterial);

      this.requestComponent.increaseIndex();
      this.router.navigate(['/jobrequest/extraOptions']);

      return;
    } else {
      // No material selectd, thow error and say it is required!
      console.log("Selected material is required...");
      this.messageService.add({
        severity: 'error',
        summary: 'Material Required',
        detail: 'Please select material for print job'
      })
    }

  }

}
