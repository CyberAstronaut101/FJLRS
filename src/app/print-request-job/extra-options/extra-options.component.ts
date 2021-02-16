import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobRequestService } from '../job-request.service';
import { RequestFormComponent } from '../request-form/request-form.component';

@Component({
  selector: 'app-extra-options',
  templateUrl: './extra-options.component.html',
  styleUrls: ['./extra-options.component.css']
})
export class ExtraOptionsComponent implements OnInit {

  componentStepIndex = 2;

  extraComments: string;    // textbox variable binding

  constructor(private requestComponent: RequestFormComponent, public jobRequestService: JobRequestService, private router: Router) { }

  ngOnInit() {
    this.requestComponent.setIndex(this.componentStepIndex);
  }

  lastPage() {
    // Goes back to the upload files page
    this.requestComponent.decreaseIndex();
    this.router.navigate(['/jobrequest/materials']);
  }

  nextPage() {
    // Validate info and then move to next page..
    console.log("extra comments");
    console.log(this.extraComments);

    // Since extra comments are not required, only add it to the service
    // if the comments exist. 
    if(this.extraComments) {
      this.jobRequestService.jobSubmissionInformation.comment = this.extraComments;
    }

    // But
    this.requestComponent.increaseIndex();
    this.router.navigate(['/jobrequest/quote']);
  }

}
