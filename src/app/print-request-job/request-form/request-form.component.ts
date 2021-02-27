import { Component, OnInit } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { ConfirmationDialogComponent } from 'src/app/shared-components/confirmation-dialog/confirmation-dialog.component';
import { RequestSubmitSuccessComponent } from 'src/app/shared-components/request-submit-success/request-submit-success.component';
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

  // FILE UPLOAD DATA
  uploadFile: any;
  selectedMaterial: Material;
  // TODO make this programatic
  materials = [
    { name: "White PLA", matId: "TEMP DB ID" },
    { name: "Black PLA", matId: "TEMP DB ID" },
    { name: "Gray PLA", matId: "TEMP DB ID" }
  ]
  extraComments: string = "";
  uid: string;

  private jobSubmissionSub: Subscription;

  constructor(
    private jobRequestService: JobRequestService,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private dialog: MatDialog) {
  }

  ngOnInit() {

    if(this.authService.getIsAuth()) {
      // User logged in
      this.uid = this.authService.getUserId();
    }

    // Setup listener for after job is submitted
    this.jobSubmissionSub = this.jobRequestService.getJobRequestListener()
      .subscribe(any => {
        console.log("After successful submission.....");

        console.log(any);
        this.messageService.clear();
        this.messageService.add(any.message);
        
        // Prompt user with confirmation dialog
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '350px',
          data: 'Successfully submitted job request, id:'
        });
        dialogRef.afterClosed().subscribe(result => {

            // User acknoledged the dialog
            // Regardless of yes/no, redirect
            this.router.navigate(['/printerlab']);

        });
        


      });


  }

  submit() {
    this.messageService.clear();
    // Data to submit
    console.log('Submit for job request clicked');

    // Make sure file is selected
    // Make sure material is selected
    // Dont worry about extraComments, set to 'none'

    // Check if file has been selected
    if(!this.uploadFile) {
      console.log("No file selected..");
      this.messageService.add({
        severity: "error",
        summary: "Not Submitted",
        detail: "No job file selected for upload"
      })
      return;
    }

    if(!this.selectedMaterial) {
      console.log("No Material selected..");
      this.messageService.add({
        severity: "error",
        summary: "Not Submitted",
        detail: "No print material selected"
      })
      return;
    }

    // MongoDB wants item with length, so if no additional commands set to 'none provided'
    if(this.extraComments.length == 0){
      this.extraComments = "None Provided";
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
  }

  

}
