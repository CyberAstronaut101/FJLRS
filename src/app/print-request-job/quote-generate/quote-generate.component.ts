import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobRequestService } from '../job-request.service';
import { RequestFormComponent } from '../request-form/request-form.component';

@Component({
  selector: 'app-quote-generate',
  templateUrl: './quote-generate.component.html',
  styleUrls: ['./quote-generate.component.css']
})
export class QuoteGenerateComponent implements OnInit {

  constructor(private requestComponent: RequestFormComponent, public jobRequestService: JobRequestService, private router: Router) { }

  ngOnInit() {
  }

  lastPage() {
    // Goes back to the upload files page
    this.requestComponent.decreaseIndex();
    this.router.navigate(['/jobrequest/extraOptions']);
  }

  nextPage() {
    // Validate info and then move to next page..
    this.requestComponent.increaseIndex();
    this.router.navigate(['/jobrequest/submitRequest']);
  }
}
