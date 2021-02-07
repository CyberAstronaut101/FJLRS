import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobRequestService } from '../job-request.service';
import { RequestFormComponent } from '../request-form/request-form.component';

@Component({
  selector: 'app-submit-job-request',
  templateUrl: './submit-job-request.component.html',
  styleUrls: ['./submit-job-request.component.css']
})
export class SubmitJobRequestComponent implements OnInit {

  constructor(private requestComponent: RequestFormComponent, public jobRequestService: JobRequestService, private router: Router) { }

  ngOnInit() {
  }

  submit() {
    // TODO validate info within the job request service and then submit the request
  }

  lastPage() {
    // Goes back to the upload files page
    this.requestComponent.decreaseIndex();
    this.router.navigate(['/jobrequest/quote'])
  }

}
