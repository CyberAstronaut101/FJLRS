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

  constructor(private requestComponent: RequestFormComponent, public jobRequestService: JobRequestService, private router: Router) { }

  componentStepIndex = 1;

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
