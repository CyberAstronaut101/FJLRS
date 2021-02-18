import { Component, OnInit } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
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
  uid: string;


  constructor(
    private jobRequestService: JobRequestService,
    private authService: AuthService) {
  }

  public activeIndex: number = 0;


  submit() {
    // Data to submit
    console.log('Submit for job request clicked');

    // Make sure file is selected
    // Make sure material is selected
    // Dont worry about extraComments, set to 'none'

    if(this.extraComments.length == 0) {
      this.extraComments = ""
    }

    console.log(this.uploadFile);
    console.log(this.selectedMaterial);
    console.log(this.extraComments);


    let formData:FormData = new FormData();
    formData.append('file', this.uploadFile, this.uploadFile.name);
    formData.append('material', this.selectedMaterial.name);
    formData.append('comments', this.extraComments);
    formData.append('uid', this.uid);

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

    if(this.authService.getIsAuth()) {
      // User logged in
      this.uid = this.authService.getUserId();
    }
  }

}
