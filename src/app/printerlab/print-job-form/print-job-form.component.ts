import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { forkJoin } from 'rxjs';
import { PrinterlabService } from '../printerlab.service';

@Component({
  selector: 'print-job-form',
  templateUrl: './print-job-form.component.html',
  styleUrls: ['./print-job-form.component.css']
})
export class PrintJobFormComponent implements OnInit {

  @ViewChild('fileInput', { static: false}) fileInput: FileUpload;

  constructor(private printerLabService:PrinterlabService) { }

  mode = "create";
  uploadedFiles: any[] = []

  items: MenuItem[];
  uplo: File;

  ngOnInit() {
    // Setup the steps for submitting a job request
    this.items = [
      {label: 'Step 1'},
      {label: 'Step 2'},
      {label: 'Step 3'}
  ];
  
  }


  // Saving whole job request
  onSubmitJobRequest() {

    console.log("Job Submit Request...");

    const promiseList = [];
    const ObservableList = [];
    
    console.log(this.fileInput.files);
    
    this.fileInput.files.forEach(file => {
      promiseList.push(this.printerLabService.uploadFile(file));
    })

    // Or delete here if needed..

    // if(promiseList.length) {
    //   forkJoin(promiseList).subscribe(
    //     files => {
    //       const Date
    //     }
    //   )
    // }

  }


}
