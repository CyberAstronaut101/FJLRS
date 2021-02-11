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

  extraComments: string;    // textbox variable binding

  constructor(private requestComponent: RequestFormComponent, public jobRequestService: JobRequestService, private router: Router) { }

  ngOnInit() {
  }

  lastPage() {
    // Goes back to the upload files page
    this.requestComponent.decreaseIndex();
    this.router.navigate(['/jobrequest/materials']);
  }

  nextPage() {
    // Validate info and then move to next page..
    this.requestComponent.increaseIndex();
    this.router.navigate(['/jobrequest/quote']);
  }

}
