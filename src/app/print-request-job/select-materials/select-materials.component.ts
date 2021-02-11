import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobRequestService } from '../job-request.service';
import { RequestFormComponent } from '../request-form/request-form.component';

@Component({
  selector: 'app-select-materials',
  templateUrl: './select-materials.component.html',
  styleUrls: ['./select-materials.component.css']
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
  selectedMaterial: string;

  constructor(private requestComponent: RequestFormComponent, public jobRequestService: JobRequestService, private router: Router) {
    
    this.materials = [
      { name: "White PLA" },
      { name: "Black PLA" },
      { name: "Gray PLA" }
    ]
  }

  

  ngOnInit() {
    // Need to revisit this.. if there isnt a job request started already the process should start at the file upload window..
    this.requestComponent.setIndex(this.componentStepIndex);

  }
  

  lastPage() {
    // Goes back to the upload files page
    this.requestComponent.decreaseIndex();
    this.router.navigate(['/jobrequest/uploadFiles']);
  }

  nextPage() {
    // Validate info and then move to next page..
    this.requestComponent.increaseIndex();
    this.router.navigate(['/jobrequest/extraOptions']);
  }

}
