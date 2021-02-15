import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { JobRequestService } from '../job-request.service';
import { RequestFormComponent } from '../request-form/request-form.component';

@Component({
  selector: 'app-uploadfiles',
  templateUrl: './uploadfiles.component.html',
  styleUrls: ['./uploadfiles.component.css'],
  providers: [MessageService]
})
export class UploadfilesComponent implements OnInit {

  componentStepIndex = 0;

  submitted: boolean = false;

  uploadFiles: any[]; // list that p-fileUpload uses to display files to client

  fileToUpload: any;  // file used to pass to service
  fileSelected: boolean = false;

  constructor(private messageService: MessageService, private requestComponent: RequestFormComponent, public jobRequestService: JobRequestService, private router: Router) { }

  ngOnInit() {
    console.log("3D Print Job UploadFiles OnInit()..");

    if(this.jobRequestService.doesFileToUploadExist()) {
      console.log("FILE TO UPLOAD ALREADY EXISTS!");

      // Update Variables
      this.fileSelected = true;
      this.fileToUpload = this.jobRequestService.jobSubmissionInformation.file;

      console.log(this.fileToUpload);
    }

    this.requestComponent.setIndex(this.componentStepIndex);
  }

  onSelect($event) {
    this.fileToUpload = $event.files[0];
    this.jobRequestService.uploadFileSelected(this.fileToUpload);
  }

  nextPage() {
    // Validate info and then move to next page..
    if(this.jobRequestService.doesFileToUploadExist()) {
      // File was selected, go ahead and add to the service and move to next pane
      // Move to next step
      this.requestComponent.increaseIndex();
      this.router.navigate(['/jobrequest/materials']);
    } else {
      // Throw error
      console.log("File selection is required.");
      this.messageService.add({
        severity: 'error',
        summary: 'Job File Required',
        detail: 'Please select object file for print request'
      })

    }

    

  }

}
