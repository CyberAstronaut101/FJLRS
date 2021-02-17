import { Component, OnInit } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { Material } from 'src/assets/interfaces';
import { JobRequestService } from '../job-request.service';

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.css'],
  styles: [`:host /deep/ .ui-steps .ui-steps-item {
    width: 20%;
}`],
  providers: [MessageService]
})
export class RequestFormComponent implements OnInit {

  items: MenuItem[];

  // FILE UPLOAD DATA
  uploadFile: any;

  // MATERIAL SELECTION
  selectedMaterial: Material;
  materials = [
    { name: "White PLA", matId: "TEMP DB ID" },
    { name: "Black PLA", matId: "TEMP DB ID" },
    { name: "Gray PLA", matId: "TEMP DB ID" }
  ]

  // EXTRA COMMENTS
  extraComments: string;


  constructor(private jobRequestService: JobRequestService) {
  }

  public activeIndex: number = 0;


  submit() {
    // Data to submit
    console.log('Submit for job request clicked');
    // TODO validate file and material selected!

    console.log(this.uploadFile);
    console.log(this.selectedMaterial);
    console.log(this.extraComments);

    // let uploadData = {
    //   file: this.uploadFile,
    //   material: this.selectedMaterial,
    //   comments: this.extraComments
    // }

    let formData:FormData = new FormData();
    formData.append('file', this.uploadFile, this.uploadFile.name);
    formData.append('material', this.selectedMaterial.matId);
    formData.append('comments', this.extraComments);

    this.jobRequestService.submitJobRequest(formData);
  }

  // For file upload
  onSelect($event) {
    // this.fileToUpload = $event.files[0];
    this.uploadFile = $event.files[0];
    console.log("Attempting to upload file...")

    // let fileId = this.jobRequestService.uploadFile(this.uploadFile);

  }

  onUpload($event) {
    console.log($event);

    // Take the file and upload it?
  }




  // SWITCHING TO AN EASIER FORM APPROACH

  increaseIndex() {
    this.activeIndex++;
  }

  decreaseIndex() {
    this.activeIndex--;
  }

  setIndex(index: number) {
    if(index >= 0 && index <=4){
      this.activeIndex = index;
    }
  }

  ngOnInit() {

    this.items = [{
          label: 'Upload Files'
      },
      {
          label: 'Select Material and Color'
      },
      {
          label: 'Additional Comments'
      },
      {
          label: 'Job Quote'
      },
      {
        label: 'Submit Request'
      }
    ];
  }

}
