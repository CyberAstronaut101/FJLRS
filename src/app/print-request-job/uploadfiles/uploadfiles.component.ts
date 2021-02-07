import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobRequestService } from '../job-request.service';
import { RequestFormComponent } from '../request-form/request-form.component';

@Component({
  selector: 'app-uploadfiles',
  templateUrl: './uploadfiles.component.html',
  styleUrls: ['./uploadfiles.component.css']
})
export class UploadfilesComponent implements OnInit {

  personalInformation: any;

  submitted: boolean = false;

  

  constructor(private requestComponent: RequestFormComponent, public jobRequestService: JobRequestService, private router: Router) { }



  ngOnInit() {
  }

  onUpload($event) {
    console.log("Files have been selected for upload...");
    console.log($event);
  }

  nextPage() {
    // Validate info and then move to next page..

    this.requestComponent.increaseIndex();
    this.router.navigate(['/jobrequest/materials']);

  }

}
