import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobRequestService } from '../job-request.service';

@Component({
  selector: 'app-uploadfiles',
  templateUrl: './uploadfiles.component.html',
  styleUrls: ['./uploadfiles.component.css']
})
export class UploadfilesComponent implements OnInit {

  personalInformation: any;

  submitted: boolean = false;

  constructor(public jobRequestService: JobRequestService, private router: Router) { }



  ngOnInit() {
  }

  nextPage() {
    // Validate info and then move to next page..

    return;
  }

}
